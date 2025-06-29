#!/usr/bin/env python

# JGAAP
THESAURUS = {
    # --------------------
    # PL
    # --------------------
    # 売上高
    "NetSales": [
        "NetSales",
        "NetSalesSummaryOfBusinessResults",
        "OperatingRevenue1",
        "OperatingRevenue1SummaryOfBusinessResults",
        "OperatingRevenue2",
        "OperatingRevenue2SummaryOfBusinessResults",
        "OperatingRevenue",
        "OperatingRevenueSummaryOfBusinessResults",
        "OperatingRevenues",
        "OperatingRevenuesSummaryOfBusinessResults",
        "Revenue",
        "RevenueSummaryOfBusinessResults",
        "Revenue2",
        "Proceeds",  # 収益
        "BusinessRevenue",  # 事業収益
        "BusinessRevenueSummaryOfBusinessResults",  # 事業収益
        "NetSalesOfCompletedConstructionContracts",  # 完成工事高
        "NetSalesOfCompletedConstructionContractsSummaryOfBusinessResults",  # 完成工事高  # noqa: E501
        "NetSalesOfCompletedConstructionContractsCNS",  # 完成工事高
        "OperatingRevenueINV",  # REIT
        "GrossOperatingRevenue",  # 9946, ミニストップ
        "GrossOperatingRevenueSummaryOfBusinessResults",  # 9946, ミニストップ
    ],
    # 売上原価
    "CostOfSales": [
        "CostOfSales",
        "CostOfSalesOEElectricELE",  # 売上原価
        "TotalCostOfSales",  # 売上原価合計
        "TotalCostOfSalesCOS",  # 売上原価合計
        "OperatingCost",  # 営業原価
        "OperatingCost2",  # 営業支出
        "CostOfOperatingRevenuesCOSExpOA",  # 事業費
        "TotalOperatingCostCOSExpOA",  # 営業原価合計
        "TotalBusinessExpensesCOSExpOA",  # 事業費合計
        "CostOfSalesOfCompletedConstructionContractsCNS",  # 完成工事原価
        "CostOfCompletedWorkCOSExpOA",  # 完成業務原価
        "ShippingBusinessExpensesWAT",  # 海運業費用合計
    ],
    # （商品売上原価）
    "CostOfGoodsSold": [
        "CostOfGoodsSold",
        "TotalCostOfSalesCostOfGoodsSold",
    ],
    # （製品売上原価）
    "CostOfFinishedGoodsSold": [
        "CostOfFinishedGoodsSold",
        "CostOfMerchandiseAndFinishedGoodsSoldCOS",  # 商品及び製品売上原価
        "CostOfProductsManufactured",  # 当期製品製造原価
    ],
    # 売上総利益
    "GrossProfit": [
        "GrossProfit",
        "GrossProfitOnCompletedConstructionContractsCNS",  # 完成工事総利益
        "OperatingGrossProfit",  # 営業総利益
        "OperatingGrossProfitWAT",  # 営業総利益（海運業）
        "ShippingBusinessIncomeWAT",  # 海運業利益
        "NetOperatingRevenueSEC",  # 純営業収益
        "BusinessGrossProfit",  # 事業総利益
        "BusinessGrossProfitOrLoss",  # 事業総利益
    ],
    # 販売費及び一般管理費
    "SGA": [
        "SellingGeneralAndAdministrativeExpenses",
        "SellingGeneralAndAdministrativeExpensesGAS",  # 供給販売費及び一般管理費合計
        "TotalSellingGeneralAndAdministrativeExpensesSGA",  # 販売費・一般管理費計
        "GeneralAndAdministrativeExpensesSGA",  # 一般管理費
        "GeneralAndAdministrativeExpensesIVT",  # 一般管理費
        "GeneralAndAdministrativeExpensesWAT",  # 一般管理費
        "OperatingGeneralAndAdministrativeExpensesIVT",  # 営業費用及び一般管理費
    ],
    # 営業利益
    "OperatingIncome": [
        "OperatingIncome",
        "OperatingProfitLossOperatingProfitLoss",
        "OperatingProfit",  # REIT
    ],
    # 営業外収益
    "NonOperatingIncome": [
        "NonOperatingIncome",
    ],
    # 営業外費用
    "NonOperatingExpenses": [
        "NonOperatingExpenses",
    ],
    # 経常利益
    "OrdinaryIncome": [
        "OrdinaryIncome",
        "OrdinaryProfit",  # REIT
    ],
    # 特別利益
    "ExtraordinaryIncome": [
        "ExtraordinaryIncome",
    ],
    # 特別損失
    "ExtraordinaryLoss": [
        "ExtraordinaryLoss",
    ],
    # 税引前利益
    "ProfitLossBeforeTax": [
        "IncomeBeforeIncomeTaxes",
        "ProfitBeforeIncomeTaxes",  # REIT
    ],
    # 法人税等
    "IncomeTax": [
        "IncomeTaxes",
    ],
    # 当期純利益
    "ProfitLoss": [
        "ProfitLoss",
        "Profit",
        "NetIncome",
    ],
    # 少数株主損益調整前当期純利益
    #
    # 2015年4月1日以後に開始する連結会計年度から、
    # 連結財務諸表における当期純利益の定義が変更された。
    # 従来の「少数株主損益調整前当期純利益」が「当期純利益」となる。
    # 従来の当期純利益は「親会社株主に帰属する当期純利益」に変更される。
    "IncomeBeforeMinorityInterests": [
        "IncomeBeforeMinorityInterests",
    ],
    # 親会社株主に帰属する当期純利益
    "ProfitLossAttributableToOwnersOfParent": [
        "ProfitLossAttributableToOwnersOfParent",
        "ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults",
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
        "Assets",
        "TotalAssetsSummaryOfBusinessResults",
    ],
    # 流動資産
    "CurrentAssets": [
        "CurrentAssets",
    ],
    # 現金及び預金
    "CashAndDeposits": [
        "CashAndDeposits",
        "CashAndCashEquivalents",
        "CashAndCashEquivalentsSummaryOfBusinessResults",
    ],
    # 売上債権
    "NotesAndAccountsReceivable": [
        "NotesAndAccountsReceivableTrade",
        "NotesAndAccountsReceivableTradeNet",
        "NotesAndAccountsReceivableAndOtherTrade",
        "NotesReceivableAccountsReceivableTradeAndOtherCA",
    ],
    # （受取手形）
    "NotesReceivable": [
        "NotesReceivableTrade",
        "NotesReceivableTradeNet",
    ],
    # （売掛金）
    "AccountsReceivable": [
        "AccountsReceivableTrade",
        "AccountsReceivableTradeNet",
    ],
    # （売買目的有価証券）
    "ShortTermInvestmentSecurities": [
        "ShortTermInvestmentSecurities",
        "TradingSecuritiesCA",
    ],
    # 棚卸資産
    "Inventories": [
        "Inventories",
    ],
    # （商品及び製品）
    "MerchandiseAndFinishedGoods": [
        "MerchandiseAndFinishedGoodsSemiFinishedGoods",
        "MerchandiseAndFinishedGoodsIncludingSemiFinishedGoods",
        "MerchandiseAndFinishedGoods",
    ],
    # （商品）
    "Merchandise": [
        "Merchandise",
        "MerchandiseEtcCA",
    ],
    # （製品）
    "FinishedGoods": [
        "FinishedGoods",
        "FinishedGoodsCA",
        "FinishedGoodsAndPurchasedGoodsCA",  # 製品及び外注品
        "FinishedGoodsAndWorkInProcessCA",  # 製品及び仕掛品
        "FinishedGoodsAndSemiFinishedGoodsCA",  # 製品及び半製品
        "FinishedGoodsIncludingSemiFinishedGoods",  # 製品（半製品を含む）
    ],
    # （半製品）
    "SemiFinishedGoods": [
        "SemiFinishedGoods",
        "SemiFinishedGoodsAndWorkInProcessCA",  # 半製品及び仕掛品
    ],
    # （仕掛品）
    "WorkInProcess": [
        "WorkInProcess",
        "WorkInProcessCA",  # 未成制作費
        "WorkInProcessCAAssets",  # 未成制作費
    ],
    # （原材料及び貯蔵品）
    "RawMaterialsAndSupplies": [
        "RawMaterialsAndSupplies",
        "RawMaterialsAndSuppliesCA",
        "RawMaterialsAndSuppliesCNS",
    ],
    # （原材料）
    "RawMaterials": [
        "RawMaterials",
        "RawMaterialsCA",
        "RawMaterialsCAGAS",
        "RawMaterialsUsedInShopsCA",  # 店舗食材
    ],
    # （貯蔵品）
    "Supplies": [
        "Supplies",
    ],
    # 固定資産
    "NonCurrentAssets": [
        "NoncurrentAssets",
    ],
    # ----------
    # 負債
    # ----------
    # 負債
    "Liabilities": [
        "Liabilities",
    ],
    # 流動負債
    "CurrentLiabilities": [
        "CurrentLiabilities",
    ],
    # 仕入債務
    "NotesAndAccountsPayable": [
        "NotesAndAccountsPayableTrade",
        "NotesAndAccountsPayableAndOtherTrade",
        "NotesPayableAccountsPayableTradeAndOtherCL",
    ],
    # （支払手形）
    "NotesPayable": [
        "NotesPayableTrade",
    ],
    # （買掛金）
    "AccountsPayable": [
        "AccountsPayableTrade",
    ],
    # 固定負債
    "NonCurrentLiabilities": [
        "NoncurrentLiabilities",
    ],
    # ----------
    # 純資産
    # ----------
    # 純資産
    "NetAssets": [
        "NetAssets",
        "NetAssetsSummaryOfBusinessResults",
    ],
    # 資本金
    "ShareCapital": [
        "CapitalStock",
        "CapitalStockSummaryOfBusinessResults",
    ],
    # 資本剰余金
    "CapitalSurplus": [
        "CapitalSurplus",
    ],
    # 利益剰余金
    "RetainedEarnings": [
        "RetainedEarnings",
    ],
    # 自己株式
    "TreasuryShares": [
        "TreasuryStock",
    ],
    # 親会社の所有者に帰属する持分合計
    "EquityAttributableToOwnersOfParent": [
        "ShareholdersEquity",
    ],
    # 非支配株主持分
    "NonControllingInterests": [
        "NonControllingInterests",
    ],
    # --------------------
    # CF
    # --------------------
    # 営業キャッシュフロー
    "OperatingCashFlow": [
        "NetCashProvidedByUsedInOperatingActivities",
        "NetCashProvidedByUsedInOperatingActivitiesSummaryOfBusinessResults",
    ],
    # 投資キャッシュフロー
    "InvestingCashFlow": [
        "NetCashProvidedByUsedInInvestmentActivities",
        "NetCashProvidedByUsedInInvestingActivitiesSummaryOfBusinessResults",
    ],
    # 財務キャッシュフロー
    "FinancingCashFlow": [
        "NetCashProvidedByUsedInFinancingActivities",
        "NetCashProvidedByUsedInFinancingActivitiesSummaryOfBusinessResults",
    ],
    # --------------------
    # 指標
    # --------------------
    # 1株当たり純資産
    "BPS": [
        "NetAssetsPerShareSummaryOfBusinessResults",
    ],
    # 1株当たり当期純利益
    "EPS": [
        "BasicEarningsPerShare",
        "BasicEarningsPerShareSummaryOfBusinessResults",
        "BasicEarningsLossPerShareSummaryOfBusinessResults",
    ],
    # 自己資本比率
    "EquityToAssetRatio": [
        "EquityToAssetRatioSummaryOfBusinessResults",
    ],
    # 自己資本利益率
    "ROE": [
        "RateOfReturnOnEquitySummaryOfBusinessResults",
    ],
    # 株価収益率
    "PER": [
        "PriceEarningsRatioSummaryOfBusinessResults",
    ],
    # 1株当たり配当（_NonConsolidatedMember）
    "DividendPaidPerShare": [
        "DividendPaidPerShareSummaryOfBusinessResults",
        "DividendPaidPerShareCommonStockSummaryOfBusinessResults",
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
        "NumberOfEmployees",
    ],
}
