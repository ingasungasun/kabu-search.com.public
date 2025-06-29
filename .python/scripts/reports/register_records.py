#!/usr/bin/env python

import concurrent.futures
import contextlib
import gzip
import io
import os
import sys
import traceback
import zipfile

import bs4
import edinet.api
import edinet.xbrl.document
import edinet.xbrl.report
import mysql.connector
from edinet.errors import NotFoundError, TaxonomyError, TickerError, XBRLError
from edinet.xbrl import MANIFEST_FILE_NAME, PUBLIC_DOC_DIR

from lib.constants import MYSQL_CONFIG, STORAGE_DIR
from lib.functions import calculate_growth_rate, create_logger, newest_report

logger = create_logger(__name__)

LIMIT = 1
MAX_WORKERS = LIMIT


def analyze(record: tuple):
    """
    ---------------------------------------------------------------------------
    Exception               Logging     Abort   Description
    ---------------------------------------------------------------------------
    TickerError:            INFO        no      A stock does not have a ticker
    NotFoundError:          INFO        no      An XBRL file does not exist
    XBRLError:              INFO        no      Unable to read an XBRL file
    TaxonomyError           WARNING     no      Unable to analyze a taxonomy
    mysql.connector.Error:  WARNING     no      MySQL error
    Exception:              WARNING     yes     Unexpected error
    """
    doc_id = record[1]
    ticker = record[6]

    if ticker is None:
        raise TickerError("No ticker.")

    res = edinet.api.request_document(doc_id)
    res.raise_for_status()

    # application/json; charset=utf-8 は、データの取得に失敗した場合の設定値です。
    if res.headers["Content-Type"] == "application/json; charset=utf-8":
        metadata = res.json()["metadata"]
        status = metadata["status"]
        message = metadata["message"]

        if status == "404":
            raise NotFoundError(message)
        else:
            raise Exception(message)

    with zipfile.ZipFile(io.BytesIO(res.content)) as zip_file:
        manifest_file_path = f"{PUBLIC_DOC_DIR}/{MANIFEST_FILE_NAME}"

        if manifest_file_path not in zip_file.namelist():
            raise XBRLError(f"{MANIFEST_FILE_NAME} not found.")

        with zip_file.open(manifest_file_path) as manifest_file:
            manifest_soup = bs4.BeautifulSoup(manifest_file.read(), features="xml")
            instance = manifest_soup.find("instance")

        """
        edinet.xbrl.report
        """
        xbrl_file_name = instance["preferredFilename"]
        xbrl_file_path = f"{PUBLIC_DOC_DIR}/{xbrl_file_name}"

        with zip_file.open(xbrl_file_path) as xbrl_file:
            result = edinet.xbrl.report.analyze(xbrl_file)
            report = result["report"]
            standard = result["standard"]
            is_consolidated = result["is_consolidated"]

        """
        edinet.xbrl.document
        """
        documents = []
        ixbrl_tags = instance.find_all("ixbrl")

        for ixbrl_tag in ixbrl_tags:
            ixbrl_file_name = ixbrl_tag.string
            ixbrl_file_path = f"{PUBLIC_DOC_DIR}/{ixbrl_file_name}"

            with zip_file.open(ixbrl_file_path) as ixbrl_file:
                documents += edinet.xbrl.document.analyze(ixbrl_file, is_consolidated)

    return {
        "report": report,
        "standard": standard,
        "is_consolidated": is_consolidated,
        "documents": documents,
    }


try:
    with contextlib.suppress(IndexError):
        LIMIT = MAX_WORKERS = int(sys.argv[1])

    with mysql.connector.connect(**MYSQL_CONFIG) as cnx, cnx.cursor() as cursor:
        cursor.execute(
            f"""
            SELECT
                ed.id,
                ed.doc_id, 
                ed.ordinance_code,
                ed.form_code,
                ed.period_start, 
                ed.period_end,
                st.ticker
            FROM edinet_documents AS ed
            LEFT JOIN stocks AS st
            ON ed.edinet_code = st.edinet_code
            WHERE ed.needs_to_analyze = 1
            ORDER BY ed.file_date ASC
            LIMIT {LIMIT}
            """
        )
        records = cursor.fetchall()

        if len(records) == 0:
            sys.exit()

        with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
            future_to_record = {
                executor.submit(analyze, record): record for record in records
            }

            for future in concurrent.futures.as_completed(future_to_record):
                record = future_to_record[future]
                edinet_document_id = record[0]
                doc_id = record[1]
                ordinance_code = record[2]
                form_code = record[3]
                period_start = record[4]
                period_end = record[5]
                ticker = record[6]

                try:
                    result = future.result()
                    report = result["report"]
                    standard = result["standard"]
                    is_consolidated = result["is_consolidated"]
                    documents = result["documents"]

                    """
                    documents
                    """
                    DOC_DIR_PATH = (
                        f"{STORAGE_DIR}/documents/{ticker[0:2]}/{ticker}/{doc_id}"
                    )

                    if not os.path.isdir(DOC_DIR_PATH):
                        os.makedirs(DOC_DIR_PATH, mode=755)

                    for document in documents:
                        name = document["name"]
                        html = document["html"]
                        FILE_PATH = f"{DOC_DIR_PATH}/{name}"

                        if not os.path.isfile(FILE_PATH):
                            with gzip.open(FILE_PATH, "wb") as file:
                                file.write(bytes(html, encoding="utf-8"))

                    """
                    reports
                    """
                    cursor.execute(
                        """
                        INSERT INTO reports
                            (
                                doc_id,
                                ticker,
                                ordinance_code,
                                form_code,
                                period_start,
                                period_end,
                                standard,
                                is_consolidated,
                                net_sales,
                                cost_of_sales,
                                gross_profit,
                                sga,
                                operating_income,
                                non_operating_income,
                                non_operating_expenses,
                                ordinary_income,
                                extraordinary_income,
                                extraordinary_loss,
                                profit_loss_before_tax,
                                income_tax,
                                profit_loss,
                                income_before_minority_interests,
                                profit_loss_attributable_to_owners_of_parent,
                                profit_loss_attributable_to_non_controlling_interests,
                                actual_profit_loss,
                                assets,
                                current_assets,
                                cash_and_deposits,
                                notes_and_accounts_receivable,
                                inventories,
                                non_current_assets,
                                liabilities,
                                current_liabilities,
                                notes_and_accounts_payable,
                                non_current_liabilities,
                                net_assets,
                                share_capital,
                                capital_surplus,
                                retained_earnings,
                                treasury_shares,
                                equity_attributable_to_owners_of_parent,
                                non_controlling_interests,
                                operating_cash_flow,
                                investing_cash_flow,
                                financing_cash_flow,
                                free_cash_flow,
                                per,
                                pbr,
                                eps,
                                bps,
                                roe,
                                roa,
                                gross_profit_margin,
                                operating_income_margin,
                                ordinary_income_margin,
                                profit_loss_margin,
                                net_sales_per_employee,
                                profit_loss_per_employee,
                                current_ratio,
                                quick_ratio,
                                cash_ratio,
                                fixed_ratio,
                                fixed_long_term_conformity_ratio,
                                equity_to_asset_ratio,
                                total_asset_turnover,
                                receivables_turnover,
                                payables_turnover,
                                inventories_turnover,
                                dividend_paid_per_share,
                                payout_ratio,
                                dividend_on_equity,
                                dividend_yield,
                                issued_shares,
                                number_of_employees
                            )
                        VALUES
                            (
                                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                                %s, %s, %s, %s
                            )
                        ON DUPLICATE KEY UPDATE
                            ticker=VALUES(ticker),
                            ordinance_code=VALUES(ordinance_code),
                            form_code=VALUES(form_code),
                            period_start=VALUES(period_start),
                            period_end=VALUES(period_end),
                            standard=VALUES(standard),
                            is_consolidated=VALUES(is_consolidated),
                            net_sales=VALUES(net_sales),
                            cost_of_sales=VALUES(cost_of_sales),
                            gross_profit=VALUES(gross_profit),
                            sga=VALUES(sga),
                            operating_income=VALUES(operating_income),
                            non_operating_income=VALUES(non_operating_income),
                            non_operating_expenses=VALUES(non_operating_expenses),
                            ordinary_income=VALUES(ordinary_income),
                            extraordinary_income=VALUES(extraordinary_income),
                            extraordinary_loss=VALUES(extraordinary_loss),
                            profit_loss_before_tax=VALUES(profit_loss_before_tax),
                            income_tax=VALUES(income_tax),
                            profit_loss=VALUES(profit_loss),
                            income_before_minority_interests=VALUES(income_before_minority_interests),
                            profit_loss_attributable_to_owners_of_parent=VALUES(profit_loss_attributable_to_owners_of_parent),
                            profit_loss_attributable_to_non_controlling_interests=VALUES(profit_loss_attributable_to_non_controlling_interests),
                            actual_profit_loss=VALUES(actual_profit_loss),
                            assets=VALUES(assets),
                            current_assets=VALUES(current_assets),
                            cash_and_deposits=VALUES(cash_and_deposits),
                            notes_and_accounts_receivable=VALUES(notes_and_accounts_receivable),
                            inventories=VALUES(inventories),
                            non_current_assets=VALUES(non_current_assets),
                            liabilities=VALUES(liabilities),
                            current_liabilities=VALUES(current_liabilities),
                            notes_and_accounts_payable=VALUES(notes_and_accounts_payable),
                            non_current_liabilities=VALUES(non_current_liabilities),
                            net_assets=VALUES(net_assets),
                            share_capital=VALUES(share_capital),
                            capital_surplus=VALUES(capital_surplus),
                            retained_earnings=VALUES(retained_earnings),
                            treasury_shares=VALUES(treasury_shares),
                            equity_attributable_to_owners_of_parent=VALUES(equity_attributable_to_owners_of_parent),
                            non_controlling_interests=VALUES(non_controlling_interests),
                            operating_cash_flow=VALUES(operating_cash_flow),
                            investing_cash_flow=VALUES(investing_cash_flow),
                            financing_cash_flow=VALUES(financing_cash_flow),
                            free_cash_flow=VALUES(free_cash_flow),
                            per=VALUES(per),
                            pbr=VALUES(pbr),
                            eps=VALUES(eps),
                            bps=VALUES(bps),
                            roe=VALUES(roe),
                            roa=VALUES(roa),
                            gross_profit_margin=VALUES(gross_profit_margin),
                            operating_income_margin=VALUES(operating_income_margin),
                            ordinary_income_margin=VALUES(ordinary_income_margin),
                            profit_loss_margin=VALUES(profit_loss_margin),
                            net_sales_per_employee=VALUES(net_sales_per_employee),
                            profit_loss_per_employee=VALUES(profit_loss_per_employee),
                            current_ratio=VALUES(current_ratio),
                            quick_ratio=VALUES(quick_ratio),
                            cash_ratio=VALUES(cash_ratio),
                            fixed_ratio=VALUES(fixed_ratio),
                            fixed_long_term_conformity_ratio=VALUES(fixed_long_term_conformity_ratio),
                            equity_to_asset_ratio=VALUES(equity_to_asset_ratio),
                            total_asset_turnover=VALUES(total_asset_turnover),
                            receivables_turnover=VALUES(receivables_turnover),
                            payables_turnover=VALUES(payables_turnover),
                            inventories_turnover=VALUES(inventories_turnover),
                            dividend_paid_per_share=VALUES(dividend_paid_per_share),
                            payout_ratio=VALUES(payout_ratio),
                            dividend_on_equity=VALUES(dividend_on_equity),
                            dividend_yield=VALUES(dividend_yield),
                            issued_shares=VALUES(issued_shares),
                            number_of_employees=VALUES(number_of_employees)
                        """,
                        (
                            doc_id,
                            ticker,
                            ordinance_code,
                            form_code,
                            period_start,
                            period_end,
                            standard,
                            is_consolidated,
                            report["NetSales"],
                            report["CostOfSales"],
                            report["GrossProfit"],
                            report["SGA"],
                            report["OperatingIncome"],
                            report["NonOperatingIncome"],
                            report["NonOperatingExpenses"],
                            report["OrdinaryIncome"],
                            report["ExtraordinaryIncome"],
                            report["ExtraordinaryLoss"],
                            report["ProfitLossBeforeTax"],
                            report["IncomeTax"],
                            report["ProfitLoss"],
                            report["IncomeBeforeMinorityInterests"],
                            report["ProfitLossAttributableToOwnersOfParent"],
                            report["ProfitLossAttributableToNonControllingInterests"],
                            report["ActualProfitLoss"],
                            report["Assets"],
                            report["CurrentAssets"],
                            report["CashAndDeposits"],
                            report["NotesAndAccountsReceivable"],
                            report["Inventories"],
                            report["NonCurrentAssets"],
                            report["Liabilities"],
                            report["CurrentLiabilities"],
                            report["NotesAndAccountsPayable"],
                            report["NonCurrentLiabilities"],
                            report["NetAssets"],
                            report["ShareCapital"],
                            report["CapitalSurplus"],
                            report["RetainedEarnings"],
                            report["TreasuryShares"],
                            report["EquityAttributableToOwnersOfParent"],
                            report["NonControllingInterests"],
                            report["OperatingCashFlow"],
                            report["InvestingCashFlow"],
                            report["FinancingCashFlow"],
                            report["FreeCashFlow"],
                            report["PER"],
                            report["PBR"],
                            report["EPS"],
                            report["BPS"],
                            report["ROE"],
                            report["ROA"],
                            report["GrossProfitMargin"],
                            report["OperatingIncomeMargin"],
                            report["OrdinaryIncomeMargin"],
                            report["ProfitLossMargin"],
                            report["NetSalesPerEmployee"],
                            report["ProfitLossPerEmployee"],
                            report["CurrentRatio"],
                            report["QuickRatio"],
                            report["CashRatio"],
                            report["FixedRatio"],
                            report["FixedLongTermConformityRatio"],
                            report["EquityToAssetRatio"],
                            report["TotalAssetTurnover"],
                            report["ReceivablesTurnover"],
                            report["PayablesTurnover"],
                            report["InventoriesTurnover"],
                            report["DividendPaidPerShare"],
                            report["PayoutRatio"],
                            report["DividendOnEquity"],
                            report["DividendYield"],
                            report["IssuedShares"],
                            report["NumberOfEmployees"],
                        ),
                    )
                    cursor.execute(
                        """
                        UPDATE edinet_documents
                        SET needs_to_analyze = 0
                        WHERE id = %s
                        """,
                        (edinet_document_id,),
                    )
                    cnx.commit()

                except (TickerError, NotFoundError, XBRLError) as error:
                    cursor.execute(
                        """
                        UPDATE edinet_documents
                        SET needs_to_analyze = 0
                        WHERE id = %s
                        """,
                        (edinet_document_id,),
                    )
                    cnx.commit()

                    error.add_note(f"doc_id: {doc_id}")
                    logger.info(traceback.format_exc())

                except (TaxonomyError, mysql.connector.Error) as error:
                    error.add_note(f"doc_id: {doc_id}")
                    logger.warning(traceback.format_exc())

                except Exception as error:
                    error.add_note(f"doc_id: {doc_id}")
                    raise

                else:
                    calculate_growth_rate(ticker)
                    newest_report(ticker)

except Exception:
    logger.warning(traceback.format_exc())
