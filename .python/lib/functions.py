#!/usr/bin/env python

import datetime
import logging
import os

import edinet
import edinet.api
import env
import mysql.connector
from dateutil.relativedelta import relativedelta

from lib.classes import SSLSMTPHandler
from lib.constants import LOG_FILE_PATH, MYSQL_CONFIG


def create_logger(name="root"):
    # Logger
    logger = logging.getLogger(name)
    logger.setLevel(logging.DEBUG)
    logger.handlers.clear()

    # Formatter
    formatter = logging.Formatter(
        fmt="%(asctime)s [%(levelname)s] %(name)s (line:%(lineno)s)\n%(message)s\n",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    # StreamHandler (DEBUG)
    stream_handler = logging.StreamHandler()
    stream_handler.setFormatter(formatter)
    stream_handler.setLevel(logging.DEBUG)
    logger.addHandler(stream_handler)

    # FileHandler (INFO)
    try:
        if not os.path.isfile(LOG_FILE_PATH):
            with open(LOG_FILE_PATH, mode="w"):
                pass

        file_handler = logging.FileHandler(LOG_FILE_PATH)
        file_handler.setFormatter(formatter)
        file_handler.setLevel(logging.INFO)
        logger.addHandler(file_handler)
    except Exception as error:
        logger.warning(error)

    # SSLSMTPHandler (INFO)
    try:
        if (
            env.SMTP_HOST is not None
            and env.SMTP_PORT is not None
            and env.SMTP_USER is not None
            and env.SMTP_PASSWORD is not None
            and env.SMTP_FROM_ADDRESS is not None
            and env.SMTP_TO_ADDRESS is not None
        ):
            smtp_handler = SSLSMTPHandler(
                mailhost=(env.SMTP_HOST, env.SMTP_PORT),
                fromaddr=env.SMTP_FROM_ADDRESS,
                toaddrs=env.SMTP_TO_ADDRESS,
                subject="dummy subject",
                credentials=(env.SMTP_USER, env.SMTP_PASSWORD),
            )
            smtp_handler.setFormatter(formatter)
            smtp_handler.setLevel(logging.INFO)
            logger.addHandler(smtp_handler)
    except Exception as error:
        logger.warning(error)

    return logger


def date_list(start_date: str | datetime.date, end_date: str | datetime.date):
    if isinstance(start_date, str):
        start_date = datetime.date.fromisoformat(start_date)

    if isinstance(end_date, str):
        end_date = datetime.date.fromisoformat(end_date)

    if not isinstance(start_date, datetime.date):
        raise ValueError(
            "The type of argument 'start_date' must be string or datetime.date."
        )

    if not isinstance(end_date, datetime.date):
        raise ValueError(
            "The type of argument 'end_date' must be string or datetime.date."
        )

    if start_date > end_date:
        start_date, end_date = end_date, start_date

    dates: list[datetime.date] = []

    while start_date <= end_date:
        dates.append(start_date)
        start_date += datetime.timedelta(days=1)

    return dates


def missing_dates_in_edinet_metadata():
    DATE_FORMAT = "%Y-%m-%d"

    with mysql.connector.connect(**MYSQL_CONFIG) as cnx, cnx.cursor() as cursor:
        cursor.execute("SELECT file_date FROM edinet_metadata ORDER BY file_date ASC")
        records = cursor.fetchall()

    dates_str_in_table = [record[0].strftime(DATE_FORMAT) for record in records]
    dates_str_in_calendar = []

    today = datetime.date.today()
    temp_date = today - relativedelta(years=edinet.DOCUMENT_AVAILABLE_YEARS)

    while temp_date < today:
        date_str = temp_date.strftime(DATE_FORMAT)
        dates_str_in_calendar.append(date_str)
        temp_date += datetime.timedelta(days=1)

    missing_dates = set(dates_str_in_calendar) - set(dates_str_in_table)
    missing_dates = sorted(missing_dates)
    return missing_dates


def fetch_edinet_codes_in_stocks_table() -> list[str]:
    with mysql.connector.connect(**MYSQL_CONFIG) as cnx, cnx.cursor() as cursor:
        cursor.execute("SELECT edinet_code FROM stocks")
        records = cursor.fetchall()
        edinet_codes = list(map(lambda record: record[0], records))

    return edinet_codes


def register_edinet_documents(date: str):
    res = edinet.api.request_document_list(date)
    res.raise_for_status()
    res_json = res.json()
    metadata = res_json["metadata"]

    if metadata["status"] != "200":
        raise RuntimeError(metadata["message"])

    count = metadata["resultset"]["count"]
    checked_at = datetime.datetime.today().strftime("%Y-%m-%d %H:%M:%S")
    values = []
    edinet_codes = fetch_edinet_codes_in_stocks_table()

    for item in res_json["results"]:
        needs_to_analyze = 0

        if (
            (
                item["ordinanceCode"]
                == edinet.ORDINANCE_CODES["disclosure_of_company_details"]
                and item["formCode"] == edinet.FORM_CODES["annual_report"]
            )
            or (
                item["ordinanceCode"]
                == edinet.ORDINANCE_CODES["disclosure_of_specified_securities_details"]
                and item["formCode"]
                == edinet.FORM_CODES["annual_report_domestic_investment_securities"]
            )
        ) and item["edinetCode"] in edinet_codes:
            needs_to_analyze = 1

        values.append(
            (
                date,
                item["seqNumber"],
                item["docID"],
                item["edinetCode"],
                item["secCode"],
                item["JCN"],
                item["filerName"],
                item["fundCode"],
                item["ordinanceCode"],
                item["formCode"],
                item["docTypeCode"],
                item["periodStart"],
                item["periodEnd"],
                item["submitDateTime"],
                item["docDescription"],
                item["issuerEdinetCode"],
                item["subjectEdinetCode"],
                item["subsidiaryEdinetCode"],
                item["currentReportReason"],
                item["parentDocID"],
                item["opeDateTime"],
                item["withdrawalStatus"],
                item["docInfoEditStatus"],
                item["disclosureStatus"],
                item["xbrlFlag"],
                item["pdfFlag"],
                item["attachDocFlag"],
                item["englishDocFlag"],
                item["csvFlag"],
                item["legalStatus"],
                needs_to_analyze,
            )
        )

    with mysql.connector.connect(**MYSQL_CONFIG) as cnx, cnx.cursor() as cursor:
        cursor.execute(
            """
            INSERT INTO edinet_metadata
                (file_date, count, checked_at)
            VALUES
                (%s, %s, %s)
            ON DUPLICATE KEY UPDATE
                count=VALUES(count),
                checked_at=VALUES(checked_at)
            """,
            (date, count, checked_at),
        )
        cursor.executemany(
            """
            INSERT INTO edinet_documents
                (
                    file_date,
                    seq_number,
                    doc_id,
                    edinet_code,
                    sec_code,
                    jcn,
                    filer_name,
                    fund_code,
                    ordinance_code,
                    form_code,
                    doc_type_code,
                    period_start,
                    period_end,
                    submit_datetime,
                    doc_description,
                    issuer_edinet_code,
                    subject_edinet_code,
                    subsidiary_edinet_code,
                    current_report_reason,
                    parent_doc_id,
                    ope_datetime,
                    withdrawal_status,
                    doc_info_edit_status,
                    disclosure_status,
                    xbrl_flag,
                    pdf_flag,
                    attach_doc_flag,
                    english_doc_flag,
                    csv_flag,
                    legal_status,
                    needs_to_analyze
                )
            VALUES
                (
                    %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                    %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                    %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
                )
            ON DUPLICATE KEY UPDATE
                doc_id=VALUES(doc_id),
                edinet_code=VALUES(edinet_code),
                sec_code=VALUES(sec_code),
                jcn=VALUES(jcn),
                filer_name=VALUES(filer_name),
                fund_code=VALUES(fund_code),
                ordinance_code=VALUES(ordinance_code),
                form_code=VALUES(form_code),
                doc_type_code=VALUES(doc_type_code),
                period_start=VALUES(period_start),
                period_end=VALUES(period_end),
                submit_datetime=VALUES(submit_datetime),
                doc_description=VALUES(doc_description),
                issuer_edinet_code=VALUES(issuer_edinet_code),
                subject_edinet_code=VALUES(subject_edinet_code),
                subsidiary_edinet_code=VALUES(subsidiary_edinet_code),
                current_report_reason=VALUES(current_report_reason),
                parent_doc_id=VALUES(parent_doc_id),
                ope_datetime=VALUES(ope_datetime),
                withdrawal_status=VALUES(withdrawal_status),
                doc_info_edit_status=VALUES(doc_info_edit_status),
                disclosure_status=VALUES(disclosure_status),
                xbrl_flag=VALUES(xbrl_flag),
                pdf_flag=VALUES(pdf_flag),
                attach_doc_flag=VALUES(attach_doc_flag),
                english_doc_flag=VALUES(english_doc_flag),
                csv_flag=VALUES(csv_flag),
                legal_status=VALUES(legal_status)
            """,
            values,
        )
        cnx.commit()


def delete_edinet_documents(date: str):
    with mysql.connector.connect(**MYSQL_CONFIG) as cnx, cnx.cursor() as cursor:
        cursor.execute("DELETE FROM edinet_metadata WHERE file_date = %s", (date,))
        cnx.commit()


def delete_edinet_documents_older_than(date: str):
    with mysql.connector.connect(**MYSQL_CONFIG) as cnx, cnx.cursor() as cursor:
        cursor.execute("DELETE FROM edinet_metadata WHERE file_date < %s", (date,))
        cnx.commit()


def insert_into_stocks_table(values: list):
    if len(values) == 0:
        raise RuntimeError("Could not find companies.")

    market = values[0][3]
    comma_separated_tickers = ",".join(list(map(lambda value: f"'{value[2]}'", values)))

    with mysql.connector.connect(**MYSQL_CONFIG) as cnx, cnx.cursor() as cursor:
        cursor.execute(
            f"""
            SELECT ticker, name
            FROM stocks
            WHERE market = '{market}'
            AND ticker NOT IN ({comma_separated_tickers})
            """
        )
        records = cursor.fetchall()

        if len(records) > 0:
            message = f"These companies no longer exist in {market}."

            for record in records:
                ticker = record[0]
                name = record[1]
                message += f"\n{ticker}: {name}"

            logger = create_logger(__name__)
            logger.info(message)

        cursor.executemany(
            """
            INSERT INTO stocks
                (
                    edinet_code,
                    fund_code,
                    ticker,
                    market,
                    division,
                    name,
                    full_name,
                    english_name,
                    kana_name,
                    address,
                    industry,
                    scale,
                    closing_date,
                    is_foreign
                )
            VALUES
                (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                market=VALUES(market),
                division=VALUES(division),
                name=VALUES(name),
                scale=VALUES(scale),
                is_foreign=VALUES(is_foreign)
            """,
            values,
        )
        cnx.commit()


def calculate_growth_rate(ticker: str):
    with mysql.connector.connect(**MYSQL_CONFIG) as cnx, cnx.cursor() as cursor:
        cursor.execute(
            """
            UPDATE
                reports AS CURRENT
            JOIN
                (
                    SELECT
                        id,
                        MIN(net_sales) OVER (
                            ORDER BY period_end ASC
                            ROWS BETWEEN 1 PRECEDING AND 1 PRECEDING
                        ) AS net_sales,
                        MIN(actual_profit_loss) OVER (
                            ORDER BY period_end ASC
                            ROWS BETWEEN 1 PRECEDING AND 1 PRECEDING
                        ) AS actual_profit_loss
                    FROM
                        reports
                    WHERE
                        ticker = %s
                    ORDER BY
                        period_end ASC
                ) AS PREV
            ON
                CURRENT.id = PREV.id
            SET
                CURRENT.net_sales_growth_rate =
                (
                    CASE
                        WHEN
                            CURRENT.net_sales > 0
                            AND PREV.net_sales > 0
                        THEN
                            (CURRENT.net_sales - PREV.net_sales) / PREV.net_sales
                        ELSE
                            NULL
                    END
                ),
                CURRENT.profit_loss_growth_rate =
                (
                    CASE
                        WHEN
                            CURRENT.actual_profit_loss > 0
                            AND PREV.actual_profit_loss > 0
                        THEN
                            (CURRENT.actual_profit_loss - PREV.actual_profit_loss) / PREV.actual_profit_loss
                        ELSE
                            NULL
                    END
                )
            WHERE
                CURRENT.ticker = %s
            """,  # noqa: E501
            (ticker, ticker),
        )
        cnx.commit()


def newest_report(ticker: str):
    with mysql.connector.connect(**MYSQL_CONFIG) as cnx, cnx.cursor() as cursor:
        cursor.execute(
            """
            SELECT id
            FROM reports
            WHERE ticker = %s
            ORDER BY period_end DESC
            LIMIT 1
            """,
            (ticker,),
        )
        record = cursor.fetchone()

        if record is None:
            raise RuntimeError(f"ticker:{ticker} has no reports.")

        newest_report_id = record[0]

        cursor.execute(
            """
            UPDATE reports
            SET is_newest = CASE WHEN id = %s THEN 1 ELSE 0 END
            WHERE ticker = %s
            """,
            (newest_report_id, ticker),
        )
        cnx.commit()
