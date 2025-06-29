#!/usr/bin/env python

# 売上原価
def cost_of_sales(items):
    if (
        items.get("CostOfSales") is not None
        or items.get("CostOfGoodsSold") is not None
        or items.get("CostOfFinishedGoodsSold") is not None
    ):
        total = 0

        if items.get("CostOfSales") is not None:
            total += int(items["CostOfSales"])
        else:
            if items.get("CostOfGoodsSold") is not None:
                total += int(items["CostOfGoodsSold"])
            if items.get("CostOfFinishedGoodsSold") is not None:
                total += int(items["CostOfFinishedGoodsSold"])
        return total
    else:
        return None


# 当期純利益
def actual_profit_loss(items):
    if items.get("ProfitLossAttributableToOwnersOfParent") is not None:
        return int(items.get("ProfitLossAttributableToOwnersOfParent"))

    elif items.get("ProfitLoss") is not None:
        return int(items.get("ProfitLoss"))

    else:
        return None


# 売上債権
def notes_and_accounts_receivable(items):
    if (
        items.get("NotesAndAccountsReceivable") is not None
        or items.get("NotesReceivable") is not None
        or items.get("AccountsReceivable") is not None
    ):
        total = 0

        if items.get("NotesAndAccountsReceivable") is not None:
            total += int(items["NotesAndAccountsReceivable"])
        else:
            if items.get("NotesReceivable") is not None:
                total += int(items["NotesReceivable"])
            if items.get("AccountsReceivable") is not None:
                total += int(items["AccountsReceivable"])
        return total
    else:
        return None


# 棚卸資産
def inventories(items):
    if (
        items.get("Inventories") is not None
        or items.get("MerchandiseAndFinishedGoods") is not None
        or items.get("Merchandise") is not None
        or items.get("FinishedGoods") is not None
        or items.get("SemiFinishedGoods") is not None
        or items.get("WorkInProcess") is not None
        or items.get("RawMaterialsAndSupplies") is not None
        or items.get("RawMaterials") is not None
        or items.get("Supplies") is not None
    ):
        total = 0

        if items.get("Inventories") is not None:
            total += int(items["Inventories"])
        else:
            if items.get("MerchandiseAndFinishedGoods") is not None:
                total += int(items["MerchandiseAndFinishedGoods"])
            else:
                if items.get("Merchandise") is not None:
                    total += int(items["Merchandise"])
                if items.get("FinishedGoods") is not None:
                    total += int(items["FinishedGoods"])

            if items.get("SemiFinishedGoods") is not None:
                total += int(items["SemiFinishedGoods"])

            if items.get("WorkInProcess") is not None:
                total += int(items["WorkInProcess"])

            if items.get("RawMaterialsAndSupplies") is not None:
                total += int(items["RawMaterialsAndSupplies"])
            else:
                if items.get("RawMaterials") is not None:
                    total += int(items["RawMaterials"])
                if items.get("Supplies") is not None:
                    total += int(items["Supplies"])
        return total
    else:
        return None


# 仕入債務
def notes_and_accounts_payable(items):
    if (
        items.get("NotesAndAccountsPayable") is not None
        or items.get("NotesPayable") is not None
        or items.get("AccountsPayable") is not None
    ):
        total = 0

        if items.get("NotesAndAccountsPayable") is not None:
            total += int(items["NotesAndAccountsPayable"])
        else:
            if items.get("NotesPayable") is not None:
                total += int(items["NotesPayable"])
            if items.get("AccountsPayable") is not None:
                total += int(items["AccountsPayable"])
        return total
    else:
        return None


# フリーキャッシュフロー
def free_cash_flow(items):
    if (
        items.get("OperatingCashFlow") is not None
        and items.get("InvestingCashFlow") is not None
    ):
        return int(items["OperatingCashFlow"]) + int(items["InvestingCashFlow"])
    else:
        return None


# 株価（PBR と DividendYield の計算に使用する）
def stock_price(items):
    if (
        items.get("PER") is not None
        and items.get("EPS") is not None
        and items["EPS"] > 0
    ):
        return float(items.get("PER")) * float(items.get("EPS"))
    else:
        return None


# PBR
def pbr(items):
    StockPrice = stock_price(items)

    if StockPrice is not None and items.get("BPS") is not None and items["BPS"] > 0:
        return StockPrice / float(items.get("BPS"))
    else:
        return None


# ROA
def roa(items):
    if (
        (
            items.get("ProfitLossAttributableToOwnersOfParent") is not None
            or items.get("ProfitLoss") is not None
        )
        and items.get("Assets") is not None
        and items["Assets"] > 0
    ):
        profit_loss = (
            items.get("ProfitLossAttributableToOwnersOfParent")
            if items.get("ProfitLossAttributableToOwnersOfParent") is not None
            else items.get("ProfitLoss")
        )
        return int(profit_loss) / int(items["Assets"])
    else:
        return None


# 売上総利益率
def gross_profit_margin(items):
    if (
        items.get("GrossProfit") is not None
        and items.get("NetSales") is not None
        and items["NetSales"] > 0
    ):
        return int(items["GrossProfit"]) / int(items["NetSales"])
    else:
        return None


# 営業利益率
def operating_income_margin(items):
    if (
        items.get("OperatingIncome") is not None
        and items.get("NetSales") is not None
        and items["NetSales"] > 0
    ):
        return int(items["OperatingIncome"]) / int(items["NetSales"])
    else:
        return None


# 経常利益率
def ordinary_income_margin(items):
    if (
        items.get("OrdinaryIncome") is not None
        and items.get("NetSales") is not None
        and items["NetSales"] > 0
    ):
        return int(items["OrdinaryIncome"]) / int(items["NetSales"])
    else:
        return None


# 当期純利益率
def profit_loss_margin(items):
    if (
        (
            items.get("ProfitLossAttributableToOwnersOfParent") is not None
            or items.get("ProfitLoss") is not None
        )
        and items.get("NetSales") is not None
        and items["NetSales"] > 0
    ):
        profit_loss = (
            items.get("ProfitLossAttributableToOwnersOfParent")
            if items.get("ProfitLossAttributableToOwnersOfParent") is not None
            else items.get("ProfitLoss")
        )
        return int(profit_loss) / int(items["NetSales"])
    else:
        return None


# 1人当たり売上高
def net_sales_per_employee(items):
    if (
        items.get("NetSales") is not None
        and items.get("NumberOfEmployees") is not None
        and items["NumberOfEmployees"] > 0
    ):
        return int(int(items["NetSales"]) / int(items["NumberOfEmployees"]))
    else:
        return None


# 1人当たり純利益
def profit_loss_per_employee(items):
    if (
        (
            items.get("ProfitLossAttributableToOwnersOfParent") is not None
            or items.get("ProfitLoss") is not None
        )
        and items.get("NumberOfEmployees") is not None
        and items["NumberOfEmployees"] > 0
    ):
        profit_loss = (
            items.get("ProfitLossAttributableToOwnersOfParent")
            if items.get("ProfitLossAttributableToOwnersOfParent") is not None
            else items.get("ProfitLoss")
        )
        return int(int(profit_loss) / int(items["NumberOfEmployees"]))
    else:
        return None


# 流動比率
def current_ratio(items):
    if (
        items.get("CurrentAssets") is not None
        and items.get("CurrentLiabilities") is not None
        and items["CurrentLiabilities"] > 0
    ):
        return int(items["CurrentAssets"]) / int(items["CurrentLiabilities"])
    else:
        return None


# 当座比率
def quick_ratio(items):
    NotesAndAccountsReceivable = notes_and_accounts_receivable(items)

    if (
        items.get("CashAndDeposits") is not None
        and NotesAndAccountsReceivable is not None
        and items.get("CurrentLiabilities") is not None
        and items["CurrentLiabilities"] > 0
    ):
        total = int(items["CashAndDeposits"]) + NotesAndAccountsReceivable

        if items.get("ShortTermInvestmentSecurities") is not None:
            total += int(items["ShortTermInvestmentSecurities"])

        return total / int(items["CurrentLiabilities"])
    else:
        return None


# 現金比率
def cash_ratio(items):
    if (
        items.get("CashAndDeposits") is not None
        and items.get("CurrentLiabilities") is not None
        and items["CurrentLiabilities"] > 0
    ):
        return int(items["CashAndDeposits"]) / int(items["CurrentLiabilities"])
    else:
        return None


# 固定比率
def fixed_ratio(items):
    if (
        items.get("NonCurrentAssets") is not None
        and items.get("NetAssets") is not None
        and items["NetAssets"] > 0
    ):
        return int(items["NonCurrentAssets"]) / int(items["NetAssets"])
    else:
        return None


# 固定長期適合率
def fixed_long_term_conformity_ratio(items):
    if (
        items.get("NonCurrentAssets") is not None
        and items.get("NetAssets") is not None
        and items.get("NonCurrentLiabilities") is not None
        and (items["NetAssets"] + items["NonCurrentLiabilities"]) > 0
    ):
        return int(items["NonCurrentAssets"]) / (
            int(items["NetAssets"]) + int(items["NonCurrentLiabilities"])
        )
    else:
        return None


# 総資産回転率
def total_asset_turnover(items):
    if (
        items.get("NetSales") is not None
        and items.get("Assets") is not None
        and items["Assets"] > 0
    ):
        return int(items["NetSales"]) / int(items["Assets"])
    else:
        return None


# 売上債権回転期間
def receivables_turnover(items):
    NotesAndAccountsReceivable = notes_and_accounts_receivable(items)

    if (
        NotesAndAccountsReceivable is not None
        and items.get("NetSales") is not None
        and items["NetSales"] > 0
    ):
        return NotesAndAccountsReceivable / (int(items["NetSales"]) / 365)
    else:
        return None


# 仕入債務回転期間
def payables_turnover(items):
    NotesAndAccountsPayable = notes_and_accounts_payable(items)
    CostOfSales = cost_of_sales(items)

    if (
        NotesAndAccountsPayable is not None
        and CostOfSales is not None
        and CostOfSales > 0
    ):
        return NotesAndAccountsPayable / (CostOfSales / 365)
    else:
        return None


# 棚卸資産回転期間
def inventories_turnover(items):
    Inventories = inventories(items)
    CostOfSales = cost_of_sales(items)

    if Inventories is not None and CostOfSales is not None and CostOfSales > 0:
        return Inventories / (CostOfSales / 365)
    else:
        return None


# 株主資本配当率
def dividend_on_equity(items):
    if (
        items.get("DividendPaidPerShare") is not None
        and items.get("BPS") is not None
        and items["BPS"] > 0
    ):
        return int(items["DividendPaidPerShare"]) / int(items["BPS"])
    else:
        return None


# 配当利回り
def dividend_yield(items):
    StockPrice = stock_price(items)

    if (
        items.get("DividendPaidPerShare") is not None
        and StockPrice is not None
        and StockPrice > 0
    ):
        return int(items["DividendPaidPerShare"]) / StockPrice
    else:
        return None


name_to_function = {
    "NetSales": None,
    "CostOfSales": cost_of_sales,  # composite
    "GrossProfit": None,
    "SGA": None,
    "OperatingIncome": None,
    "NonOperatingIncome": None,
    "NonOperatingExpenses": None,
    "OrdinaryIncome": None,
    "ExtraordinaryIncome": None,
    "ExtraordinaryLoss": None,
    "ProfitLossBeforeTax": None,
    "IncomeTax": None,
    "ProfitLoss": None,
    "IncomeBeforeMinorityInterests": None,
    "ProfitLossAttributableToOwnersOfParent": None,
    "ProfitLossAttributableToNonControllingInterests": None,
    "ActualProfitLoss": actual_profit_loss,
    "Assets": None,
    "CurrentAssets": None,
    "CashAndDeposits": None,
    "NotesAndAccountsReceivable": notes_and_accounts_receivable,  # composite
    "Inventories": inventories,  # composite
    "NonCurrentAssets": None,
    "Liabilities": None,
    "CurrentLiabilities": None,
    "NotesAndAccountsPayable": notes_and_accounts_payable,  # composite
    "NonCurrentLiabilities": None,
    "NetAssets": None,
    "ShareCapital": None,
    "CapitalSurplus": None,
    "RetainedEarnings": None,
    "TreasuryShares": None,
    "EquityAttributableToOwnersOfParent": None,
    "NonControllingInterests": None,
    "OperatingCashFlow": None,
    "InvestingCashFlow": None,
    "FinancingCashFlow": None,
    "FreeCashFlow": free_cash_flow,
    "PER": None,
    "PBR": pbr,
    "EPS": None,
    "BPS": None,
    "ROE": None,
    "ROA": roa,
    "GrossProfitMargin": gross_profit_margin,
    "OperatingIncomeMargin": operating_income_margin,
    "OrdinaryIncomeMargin": ordinary_income_margin,
    "ProfitLossMargin": profit_loss_margin,
    "NetSalesPerEmployee": net_sales_per_employee,
    "ProfitLossPerEmployee": profit_loss_per_employee,
    "CurrentRatio": current_ratio,
    "QuickRatio": quick_ratio,
    "CashRatio": cash_ratio,
    "FixedRatio": fixed_ratio,
    "FixedLongTermConformityRatio": fixed_long_term_conformity_ratio,
    "EquityToAssetRatio": None,
    "TotalAssetTurnover": total_asset_turnover,
    "ReceivablesTurnover": receivables_turnover,
    "PayablesTurnover": payables_turnover,
    "InventoriesTurnover": inventories_turnover,
    "DividendPaidPerShare": None,  # NonConsolidatedMember
    "PayoutRatio": None,  # NonConsolidatedMember
    "DividendOnEquity": dividend_on_equity,
    "DividendYield": dividend_yield,
    "IssuedShares": None,  # NonConsolidatedMember
    "NumberOfEmployees": None,
}
