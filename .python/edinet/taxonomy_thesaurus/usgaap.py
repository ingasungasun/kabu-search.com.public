#!/usr/bin/env python

# USGAAP
THESAURUS = {
    # --------------------
    # PL
    # --------------------
    # 売上高
    "NetSales": [
        "RevenueUSGAAPSummaryOfBusinessResults",
        "RevenuesUSGAAPSummaryOfBusinessResults",
    ],
    # 売上原価
    "CostOfSales": [],
    # 売上総利益
    "GrossProfit": [
        "GrossProfitUSGAAPSummaryOfBusinessResults",
    ],
    # 販売費及び一般管理費
    "SGA": [],
    # 営業利益
    "OperatingIncome": [
        "OperatingIncomeLossUSGAAPSummaryOfBusinessResults",
    ],
    # 営業外収益
    "NonOperatingIncome": [],
    # 営業外費用
    "NonOperatingExpenses": [],
    # 経常利益
    "OrdinaryIncome": [],
    # 特別利益
    "ExtraordinaryIncome": [],
    # 特別損失
    "ExtraordinaryLoss": [],
    # 税引前利益
    "ProfitLossBeforeTax": [
        "ProfitLossBeforeTaxUSGAAPSummaryOfBusinessResults",
    ],
    # 法人税等
    "IncomeTax": [],
    # 当期純利益
    "ProfitLoss": [],
    # 親会社株主に帰属する当期純利益
    "ProfitLossAttributableToOwnersOfParent": [
        "NetIncomeLossAttributableToOwnersOfParentUSGAAPSummaryOfBusinessResults",
    ],
    # 非支配株主に帰属する当期純利益
    "ProfitLossAttributableToNonControllingInterests": [],
    # --------------------
    # BS
    # --------------------
    # ----------
    # 資産
    # ----------
    # 資産
    "Assets": [
        "TotalAssetsUSGAAPSummaryOfBusinessResults",
    ],
    # 流動資産
    "CurrentAssets": [],
    # 現金及び預金
    "CashAndDeposits": [
        "CashAndCashEquivalentsUSGAAPSummaryOfBusinessResults",
    ],
    # 売上債権
    "NotesAndAccountsReceivable": [],
    # （受取手形）
    "NotesReceivable": [],
    # （売掛金）
    "AccountsReceivable": [],
    # （売買目的有価証券）
    "ShortTermInvestmentSecurities": [],
    # 棚卸資産
    "Inventories": [],
    # （商品及び製品）
    "MerchandiseAndFinishedGoods": [],
    # （商品）
    "Merchandise": [],
    # （製品）
    "FinishedGoods": [],
    # （仕掛品）
    "WorkInProcess": [],
    # （原材料及び貯蔵品）
    "RawMaterialsAndSupplies": [],
    # （原材料）
    "RawMaterials": [],
    # （貯蔵品）
    "Supplies": [],
    # 固定資産
    "NonCurrentAssets": [],
    # ----------
    # 負債
    # ----------
    # 負債
    "Liabilities": [],
    # 流動負債
    "CurrentLiabilities": [],
    # 仕入債務（支払手形及び買掛金）
    "NotesAndAccountsPayable": [],
    # （支払手形）
    "NotesPayable": [],
    # （買掛金）
    "AccountsPayable": [],
    # 固定負債
    "NonCurrentLiabilities": [],
    # ----------
    # 純資産
    # ----------
    # 純資産
    "NetAssets": [
        "EquityIncludingPortionAttributableToNonControllingInterestUSGAAPSummaryOfBusinessResults",
    ],
    # 資本金
    "ShareCapital": [],
    # 資本剰余金
    "CapitalSurplus": [],
    # 利益剰余金
    "RetainedEarnings": [],
    # 自己株式
    "TreasuryShares": [],
    # 親会社の所有者に帰属する持分合計
    "EquityAttributableToOwnersOfParent": [
        "EquityAttributableToOwnersOfParentUSGAAPSummaryOfBusinessResults",
    ],
    # 非支配株主持分
    "NonControllingInterests": [],
    # --------------------
    # CF
    # --------------------
    # 営業キャッシュフロー
    "OperatingCashFlow": [
        "CashFlowsFromUsedInOperatingActivitiesUSGAAPSummaryOfBusinessResults",
    ],
    # 投資キャッシュフロー
    "InvestingCashFlow": [
        "CashFlowsFromUsedInInvestingActivitiesUSGAAPSummaryOfBusinessResults",
    ],
    # 財務キャッシュフロー
    "FinancingCashFlow": [
        "CashFlowsFromUsedInFinancingActivitiesUSGAAPSummaryOfBusinessResults",
    ],
    # --------------------
    # 指標
    # --------------------
    # 1株当たり純資産
    "BPS": [
        "EquityAttributableToOwnersOfParentPerShareUSGAAPSummaryOfBusinessResults",
        "StockholdersEquityPerShareOfCommonStockUSGAAPSummaryOfBusinessResults",  # 6758,ソニーグループ  # noqa: E501
        "NetAssetsPerShareUSGAAPSummaryOfBusinessResults",  # 6857,アドバンテスト
        "NetAssetsPerShareSummaryOfBusinessResults",  # 6586,マキタ
    ],
    # 1株当たり当期純利益
    "EPS": [
        "BasicEarningsLossPerShareUSGAAPSummaryOfBusinessResults",
    ],
    # 自己資本比率
    "EquityToAssetRatio": [
        "EquityToAssetRatioUSGAAPSummaryOfBusinessResults",
    ],
    # 自己資本利益率
    "ROE": [
        "RateOfReturnOnEquityUSGAAPSummaryOfBusinessResults",
        "NetIncomeToSalesBelongingToShareholdersSummaryOfBusinessResults",  # 7203,トヨタ自動車  # noqa: E501
    ],
    # 株価収益率
    "PER": [
        "PriceEarningsRatioUSGAAPSummaryOfBusinessResults",
    ],
    # 1株当たり配当（_NonConsolidatedMember）
    "DividendPaidPerShare": [
        "DividendPaidPerShareSummaryOfBusinessResults",
    ],
    # 配当性向（_NonConsolidatedMember）
    "PayoutRatio": [
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
        "NumberOfEmployeesUSGAAP",
        "NumberOfEmployees",
    ],
}
