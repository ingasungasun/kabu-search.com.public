#!/usr/bin/env python

# IFRS
THESAURUS = {
    # --------------------
    # PL
    # --------------------
    # 売上高
    "NetSales": [
        "NetSalesIFRS",
        "NetSalesIFRSSummaryOfBusinessResults",
        "Revenue2IFRS",  # 8253,クレディセゾン
        "Revenue2IFRSSummaryOfBusinessResults",
        "RevenueIFRS",
        "RevenueIFRSSummaryOfBusinessResults",  # 注意：クレディセゾンはこれを売上総利益とする  # noqa: E501
        "OperatingRevenueIFRS",
        "OperatingRevenueIFRSSummaryOfBusinessResults",
        "OperatingRevenuesIFRS",
        "SalesRevenuesIFRS",  # 7203,トヨタ自動車
        "InsuranceRevenueIFRS",  # 7157,ライフネット生命
        "RevenueKeyFinancialData",  # 6269, 三井海洋開発 ※メインが米ドル、円を併記する # noqa: E501
    ],
    # 売上原価
    "CostOfSales": [
        "CostOfSalesIFRS",
        "CostCostOfSalesIFRS",
    ],
    # 売上総利益
    "GrossProfit": [
        "GrossProfitIFRS",
        "GrossProfitIFRSSummaryOfBusinessResults",
        "GrossProfitLossIFRSSummaryOfBusinessResults",
        "OperatingGrossProfitIFRS",
        "OperatingGrossProfitLossIFRS",
        "NetRevenueIFRS",  # 8253,クレディセゾン
    ],
    # 販売費及び一般管理費
    "SGA": [
        "SellingGeneralAndAdministrativeExpensesIFRS",
        "GeneralAndAdministrativeExpensesIFRS",
    ],
    # 営業利益
    "OperatingIncome": [
        "OperatingIncomeLossIFRS",
        "OperatingIncomeLossIFRSSummaryOfBusinessResults",
        "OperatingIncomeIFRSSummaryOfBusinessResults",
        "OperatingProfitIFRS",
        "OperatingProfitIFRSSummaryOfBusinessResults",
        "OperatingProfitLossIFRS",
        "OperatingProfitLossIFRSSummaryOfBusinessResults",
    ],
    # 税引前利益
    "ProfitLossBeforeTax": [
        "ProfitLossBeforeTaxIFRS",
        "ProfitLossBeforeTaxIFRSSummaryOfBusinessResults",
    ],
    # 法人税等
    "IncomeTax": [
        "IncomeTaxExpenseIFRS",
    ],
    # 当期純利益
    "ProfitLoss": [
        "ProfitLossIFRS",
        "ProfitLossIFRSSummaryOfBusinessResults",
    ],
    # 親会社株主に帰属する当期純利益
    "ProfitLossAttributableToOwnersOfParent": [
        "ProfitLossAttributableToOwnersOfParentIFRS",
        "ProfitLossAttributableToOwnersOfParentIFRSSummaryOfBusinessResults",
    ],
    # 非支配株主に帰属する当期純利益
    "ProfitLossAttributableToNonControllingInterests": [
        "ProfitLossAttributableToNonControllingInterestsIFRS",
    ],
    # --------------------
    # BS
    # --------------------
    # ----------
    # 資産
    # ----------
    # 資産
    "Assets": [
        "AssetsIFRS",
        "TotalAssetIFRSSummaryOfBusinessResults",
        "TotalAssetsIFRSSummaryOfBusinessResults",
        "TotalAssets",
        "TotalAssetsSummaryOfBusinessResults",
    ],
    # 流動資産
    "CurrentAssets": [
        "CurrentAssetsIFRS",
    ],
    # 現金及び預金
    "CashAndDeposits": [
        "CashAndCashEquivalentsIFRS",
        "CashAndCashEquivalentsIFRSSummaryOfBusinessResults",
    ],
    # 売上債権
    "NotesAndAccountsReceivable": [
        "TradeReceivablesCAIFRS",
        "TradeReceivables2CAIFRS",
        "TradeReceivables2AssetsIFRS",  # 注意：CAではない
        "TradeAndOtherReceivablesCAIFRS",
        "TradeAndOtherReceivables2CAIFRS",
        "TradeAndOtherReceivables3CAIFRS",
        "TradeAndOtherReceivablesAssetsIFRS",  # 注意：CAではない
        "TradeReceivablesAndContractAssetsCAIFRS",
        "TradeReceivablesAndContractAssetsCAIFRSIFRS",
        "TradeReceivablesOtherReceivablesAndContractAssetsCAIFRS",
    ],
    # 棚卸資産
    "Inventories": [
        "InventoriesCAIFRS",
        "InventoriesCAIFRSIFRS",
        "InventoriesAssetsIFRS",
    ],
    # 固定資産
    "NonCurrentAssets": [
        "NonCurrentAssetsIFRS",
    ],
    # ----------
    # 負債
    # ----------
    # 負債
    "Liabilities": [
        "LiabilitiesIFRS",
    ],
    # 流動負債
    "CurrentLiabilities": [
        "TotalCurrentLiabilitiesIFRS",
    ],
    # 仕入債務（支払手形及び買掛金）
    "NotesAndAccountsPayable": [
        "TradePayablesCLIFRS",
        "TradePayables2CLIFRS",
        "TradePayables3CLIFRS",
        "TradeAndOtherPayablesCLIFRS",
        "TradeAndOtherPayables2CLIFRS",
        "TradeAndOtherPayables3CLIFRS",
    ],
    # 固定負債
    "NonCurrentLiabilities": [
        "NonCurrentLabilitiesIFRS",  # typo
    ],
    # ----------
    # 純資産
    # ----------
    # 純資産
    "NetAssets": [
        "EquityIFRS",
    ],
    # 資本金
    "ShareCapital": [
        "ShareCapitalIFRS",
    ],
    # 資本剰余金
    "CapitalSurplus": [
        "CapitalSurplusIFRS",
    ],
    # 利益剰余金
    "RetainedEarnings": [
        "RetainedEarningsIFRS",
    ],
    # 自己株式
    "TreasuryShares": [
        "TreasurySharesIFRS",
    ],
    # 親会社の所有者に帰属する持分合計
    "EquityAttributableToOwnersOfParent": [
        "EquityAttributableToOwnersOfParentIFRS",
        "EquityAttributableToOwnersOfParentIFRSSummaryOfBusinessResults",
    ],
    # 非支配株主持分
    "NonControllingInterests": [
        "NonControllingInterestsIFRS",
    ],
    # --------------------
    # CF
    # --------------------
    # 営業キャッシュフロー
    "OperatingCashFlow": [
        "NetCashProvidedByUsedInOperatingActivitiesIFRS",
        "CashFlowsFromUsedInOperatingActivitiesIFRSSummaryOfBusinessResults",
    ],
    # 投資キャッシュフロー
    "InvestingCashFlow": [
        "NetCashProvidedByUsedInInvestingActivitiesIFRS",
        "CashFlowsFromUsedInInvestingActivitiesIFRSSummaryOfBusinessResults",
    ],
    # 財務キャッシュフロー
    "FinancingCashFlow": [
        "NetCashProvidedByUsedInFinancingActivitiesIFRS",
        "CashFlowsFromUsedInFinancingActivitiesIFRSSummaryOfBusinessResults",
    ],
    # --------------------
    # 指標
    # --------------------
    # 1株当たり親会社の所有者に帰属する持分
    "BPS": [
        "EquityToAssetRatioIFRSSummaryOfBusinessResults",  # 注意：自己資本比率ではない
        "TotalEquityPerShareIFRSSummaryOfBusinessResults",
    ],
    # 1株当たり親会社の所有者に帰属する当期純利益
    "EPS": [
        "BasicEarningsLossPerShareIFRS",
        "BasicEarningsLossPerShareIFRSSummaryOfBusinessResults",
    ],
    # 親会社所有者帰属持分比率（自己資本比率）
    "EquityToAssetRatio": [
        "RatioOfOwnersEquityToGrossAssetsIFRSSummaryOfBusinessResults",
        "EquityToAssetRatioIFRSSummaryOfBusinessResults2",  # BPS と混同しないこと
    ],
    # 親会社所有者帰属持分利益率
    "ROE": [
        "RateOfReturnOnEquityIFRSSummaryOfBusinessResults",
    ],
    # 株価収益率
    "PER": [
        "PriceEarningsRatioIFRSSummaryOfBusinessResults",
    ],
    # 1株当たり配当（_NonConsolidatedMember）
    "DividendPaidPerShare": [
        "DividendPaidPerShareSummaryOfBusinessResults",
    ],
    # 配当性向（_NonConsolidatedMember）
    "PayoutRatio": [
        "PayoutRatioIFRSSummaryOfBusinessResults",
        "PayoutRatioSummaryOfBusinessResults",
    ],
    # --------------------
    # その他
    # --------------------
    # 発行済株式数（_NonConsolidatedMember）
    "IssuedShares": [
        "TotalNumberOfIssuedSharesSummaryOfBusinessResults",
    ],
    # 従業員数
    "NumberOfEmployees": [
        "NumberOfEmployeesIFRS",
        "NumberOfEmployeesIFRSSummaryOfBusinessResults",
        "NumberOfEmployees",
    ],
}
