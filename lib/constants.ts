import { Metadata } from "next";
import { Report } from "@prisma/client";
import type { ChartView } from "@/lib/types.ts";

export const SITE_NAME = "株サーチ";
export const DIVIDER = " - ";
export const PROD_URL = "https://kabu-search.com";

export const Z_INDEX = {
  header: 100,
  overlay: 100,
};

export const TITLES = {
  index: SITE_NAME,
  charts: "業績推移グラフ",
  ranking: "銘柄ランキング",
  screening: "スクリーニング",
  contact: "お問い合わせ",
  notFound: "このページは存在しません",
};

export const DESCRIPTIONS = {
  index:
    "上場企業の決算を多角的に分析し、株式投資に役立つデータを表やグラフで分かりやすく表示します。決算推移や経営分析グラフ、スクリーニングなどの機能を備え、効率的なファンダメンタルズ分析を可能にします。",
  charts:
    "売上・利益をわかりやすいグラフで一覧表示します。決算期ごとの業績推移が一目でわかり、経営状態の分析に役立ちます。増収増益の銘柄を絞り込む機能も備え、効率的な銘柄選びをサポートします。",
  ranking:
    "銘柄ランキングを表示します。売上高、利益、利益率、従業員一人当たりの売上高・利益、成長率、ROE・ROA、配当の項目で並べ替えができ、企業間の比較を効率的にサポートします。",
  screening:
    "上場企業の銘柄を様々な指標でスクリーニングできます。売上、利益、利益率、成長性、収益性、安全性、回転性、配当など、細かな条件が設定可能で、効率的な銘柄選びをサポートします。",
  stocks: {
    charts:
      "業績の推移をグラフで表示します。売上・利益、利益率、ROE・ROA、成長率、安全性、回転性などの財務分析によって経営状況を把握することができます。",
    indicators:
      "決算を分析して投資に役立つデータを表示します。利益率、収益性、成長率、安全性、回転性、配当などの様々な指標によるファンダメンタルズ分析が可能です。",
    performances:
      "決算を表形式で時系列に表示します。決算期ごとの勘定科目の増減を確認することで、経営状況を把握することができます。",
    documents: `スマホ画面にも対応。${SITE_NAME}では上場企業の財務諸表を過去の分を含めて表示することができます。`,
  },
};

export const SHARED_METADATA: Metadata = {
  openGraph: {
    type: "website",
    images: [
      {
        url: `${PROD_URL}/icon.png?a578c8e23f04a26d`,
        type: "image/png",
        width: 512,
        height: 512,
      },
    ],
    locale: "ja_JP",
    siteName: SITE_NAME,
  },
};

export const NAV_TITLES = {
  charts: "業績推移グラフ",
  indicators: "業績",
  performances: "決算推移",
  documents: "決算書",
};

export const STATEMENTS = {
  pl: "損益計算書",
  bs: "貸借対照表",
  cf: "キャッシュフロー計算書",
};

export const ORDINANCE_CODES = {
  disclosureOfCompanyDetails: "010",
  disclosureOfSpecifiedSecuritiesDetails: "030",
};

export const FORM_CODES = {
  annualReport: "030000",
  annualReportDomesticInvestmentSecurities: "07B000",
};

export const PARAM_KEYS = {
  search: {
    query: "query",
  },
  charts: {
    market: "market",
    industry: "industry",
    sort: "sort",
    increased: "increased",
    not_increased: "not_increased",
    page: "page",
  },
  ranking: {
    market: "market",
    industry: "industry",
    sort: "sort",
  },
  screening: {
    indicators: "indicators",
    divisions: "divisions",
    industries: "industries",
  },
};

export const PARAM_DELIMITER = "*";

export const ITEMS_PER_PAGE = {
  charts: 12,
  ranking: 20,
};

export const NOT_APPLICABLE_SYMBOL = "N/A";

export const CHARACTER_LIMITS = {
  searchQuery: {
    min: 1,
    max: 30,
  },
  contact: {
    subject: {
      min: 0,
      max: 100,
    },
    text: {
      min: 10,
      max: 10000,
    },
  },
};

export const ERROR_MESSAGES = {
  contact: {
    email: {
      empty: "メールアドレスを入力してください",
      invalid: "メールアドレスの形式が正しくありません",
    },
    subject: {
      min: `件名は${CHARACTER_LIMITS.contact.subject.min}文字以上で入力してください`,
      max: `件名は${CHARACTER_LIMITS.contact.subject.max}文字以内で入力してください`,
    },
    text: {
      empty: "本文を入力してください",
      min: `本文は${CHARACTER_LIMITS.contact.text.min}文字以上で入力してください`,
      max: `本文は${CHARACTER_LIMITS.contact.text.max}文字以内で入力してください`,
    },
  },
};

export const LOCALHOST = "http://localhost:3000";

export const STORAGE_DIR = "/var/www/.storage";

export const TEXT_BLOCKS = [
  {
    isConsolidated: true,
    statement: "bs",
    fileNames: [
      "ConsolidatedStatementOfFinancialPositionIFRSTextBlock",
      "ConsolidatedBalanceSheetTextBlock",
      "ConsolidatedBalanceSheetUSGAAPTextBlock",
    ],
  },
  {
    isConsolidated: true,
    statement: "pl",
    fileNames: [
      "ConsolidatedStatementOfIncomeIFRSTextBlock",
      "ConsolidatedStatementOfProfitOrLossIFRSTextBlock",
      "ConsolidatedStatementOfComprehensiveIncomeSingleStatementIFRSTextBlock",

      "ConsolidatedStatementOfIncomeTextBlock",
      "ConsolidatedStatementOfComprehensiveIncomeSingleStatementTextBlock",

      "ConsolidatedStatementOfIncomeUSGAAPTextBlock",
      "ConsolidatedStatementOfComprehensiveIncomeSingleStatementUSGAAPTextBlock",
    ],
  },
  {
    isConsolidated: true,
    statement: "cf",
    fileNames: [
      "ConsolidatedStatementOfCashFlowsIFRSTextBlock",
      "ConsolidatedStatementOfCashFlowsTextBlock",
      "ConsolidatedStatementOfCashFlowsUSGAAPTextBlock",
    ],
  },
  {
    isConsolidated: false,
    statement: "bs",
    fileNames: [
      "StatementOfFinancialPositionIFRSTextBlock",
      "BalanceSheetTextBlock",
    ],
  },
  {
    isConsolidated: false,
    statement: "pl",
    fileNames: [
      "StatementOfProfitOrLossIFRSTextBlock",
      "StatementOfIncomeTextBlock",
    ],
  },
  {
    isConsolidated: false,
    statement: "cf",
    fileNames: [
      "StatementOfCashFlowsIFRSTextBlock",
      "StatementOfCashFlowsTextBlock",
    ],
  },
];

export enum Unit {
  Yen = "円",
  ThousandYen = "千円",
  MillionYen = "百万円",
  BillionYen = "十億円",
  Ratio = "倍",
  Percentage = "%",
  Times = "回",
  Day = "日",
  Share = "株",
  Person = "人",
}

export const INDICATORS = {
  // 損益計算書
  net_sales: "売上高",
  cost_of_sales: "売上原価",
  gross_profit: "売上総利益",
  sga: "販管費",
  operating_income: "営業利益",
  non_operating_income: "営業外収益",
  non_operating_expenses: "営業外費用",
  ordinary_income: "経常利益",
  extraordinary_income: "特別利益",
  extraordinary_loss: "特別損失",
  profit_loss_before_tax: "税引前利益",
  income_tax: "法人税等",
  profit_loss: "当期純利益",
  income_before_minority_interests: "少数株主損益調整前当期純利益",
  profit_loss_attributable_to_owners_of_parent:
    "親会社株主に帰属する当期純利益",
  profit_loss_attributable_to_non_controlling_interests:
    "非支配株主に帰属する当期純利益",
  actual_profit_loss: "当期純利益",
  net_sales_growth_rate: "売上高成長率",
  profit_loss_growth_rate: "純利益成長率",
  // 貸借対照表
  assets: "資産",
  current_assets: "流動資産",
  cash_and_deposits: "現金及び預金",
  notes_and_accounts_receivable: "売上債権",
  inventories: "棚卸資産",
  non_current_assets: "固定資産",
  liabilities: "負債",
  current_liabilities: "流動負債",
  notes_and_accounts_payable: "仕入債務",
  non_current_liabilities: "固定負債",
  net_assets: "純資産",
  share_capital: "資本金",
  capital_surplus: "資本剰余金",
  retained_earnings: "利益剰余金",
  treasury_shares: "自己株式",
  equity_attributable_to_owners_of_parent: "親会社持分",
  non_controlling_interests: "非支配株主持分",
  // キャッシュフロー計算書
  operating_cash_flow: "営業CF",
  investing_cash_flow: "投資CF",
  financing_cash_flow: "財務CF",
  free_cash_flow: "フリーCF",
  // 割安性
  per: "PER",
  pbr: "PBR",
  eps: "EPS",
  bps: "BPS",
  // 収益性
  roe: "ROE",
  roa: "ROA",
  gross_profit_margin: "売上総利益率",
  operating_income_margin: "営業利益率",
  ordinary_income_margin: "経常利益率",
  profit_loss_margin: "当期純利益率",
  net_sales_per_employee: "1人当たり売上高",
  profit_loss_per_employee: "1人当たり純利益",
  // 安全性
  current_ratio: "流動比率",
  quick_ratio: "当座比率",
  cash_ratio: "現金比率",
  fixed_ratio: "固定比率",
  fixed_long_term_conformity_ratio: "固定長期適合率",
  equity_to_asset_ratio: "自己資本比率",
  // 回転性
  total_asset_turnover: "総資産回転率",
  receivables_turnover: "売上債権回転期間",
  payables_turnover: "仕入債務回転期間",
  inventories_turnover: "棚卸資産回転期間",
  // 配当
  dividend_paid_per_share: "1株当たり配当",
  payout_ratio: "配当性向",
  dividend_on_equity: "株主資本配当率",
  dividend_yield: "配当利回り",
  // その他
  issued_shares: "発行済み株式数",
  number_of_employees: "従業員数",
};

export const DIVISIONS = [
  "東証プライム",
  "東証スタンダード",
  "東証グロース",
  "名証",
  "札証",
  "福証",
];

export const INDUSTRIES = [
  "水産・農林業",
  "鉱業",
  "建設業",
  "食料品",
  "繊維製品",
  "パルプ・紙",
  "化学",
  "医薬品",
  "石油・石炭製品",
  "ゴム製品",
  "ガラス・土石製品",
  "鉄鋼",
  "非鉄金属",
  "金属製品",
  "機械",
  "電気機器",
  "輸送用機器",
  "精密機器",
  "その他製品",
  "電気・ガス業",
  "陸運業",
  "海運業",
  "空運業",
  "倉庫・運輸関連",
  "情報・通信業",
  "卸売業",
  "小売業",
  "銀行業",
  "証券、商品先物取引業",
  "保険業",
  "その他金融業",
  "不動産業",
  "サービス業",
];

export const SORTS_IN_CHARTS: (keyof Report)[] = [
  "period_end",
  "ticker",
  "net_sales",
  "operating_income",
  "actual_profit_loss",
];

export const SORTS_IN_RANKING: (keyof Report)[] = [
  "net_sales",
  "operating_income",
  "actual_profit_loss",
  "operating_income_margin",
  "profit_loss_margin",
  "net_sales_per_employee",
  "profit_loss_per_employee",
  "net_sales_growth_rate",
  "profit_loss_growth_rate",
  "roe",
  "roa",
  "payout_ratio",
  "dividend_on_equity",
  "dividend_yield",
];

export const CHART_VIEWS: {
  net_sales: ChartView;
  net_sales_per_employee: ChartView;
  assets: ChartView;
  liabilities: ChartView;
  net_assets: ChartView;
  cash_flow: ChartView;
  profit_margin: ChartView;
  return: ChartView;
  growth_rate: ChartView;
  price_ratio: ChartView;
  short_term_safety: ChartView;
  long_term_safety: ChartView;
  turnover: ChartView;
  dividend: ChartView;
  number_of_employees: ChartView;
} = {
  net_sales: {
    label: "売上・利益",
    keys: ["net_sales", "operating_income", "actual_profit_loss"],
    type: "bar",
  },
  net_sales_per_employee: {
    label: "1人当たり売上・利益",
    keys: ["net_sales_per_employee", "profit_loss_per_employee"],
    type: "bar",
  },
  assets: {
    label: "資産",
    keys: [
      "assets",
      "current_assets",
      "cash_and_deposits",
      "notes_and_accounts_receivable",
    ],
    type: "bar",
  },
  liabilities: {
    label: "負債",
    keys: ["liabilities", "current_liabilities", "notes_and_accounts_payable"],
    type: "bar",
  },
  net_assets: {
    label: "純資産",
    keys: ["equity_attributable_to_owners_of_parent", "retained_earnings"],
    type: "bar",
  },
  cash_flow: {
    label: "キャッシュフロー",
    keys: [
      "operating_cash_flow",
      "investing_cash_flow",
      "financing_cash_flow",
      "free_cash_flow",
    ],
    type: "bar",
  },
  profit_margin: {
    label: "利益率",
    keys: [
      "gross_profit_margin",
      "operating_income_margin",
      "profit_loss_margin",
    ],
    type: "line",
  },
  return: {
    label: "ROE・ROA",
    keys: ["roe", "roa"],
    type: "line",
  },
  growth_rate: {
    label: "成長率",
    keys: ["net_sales_growth_rate", "profit_loss_growth_rate"],
    type: "line",
  },
  price_ratio: {
    label: "割安性",
    keys: ["per", "pbr"],
    type: "line",
  },
  short_term_safety: {
    label: "短期安全性",
    keys: ["current_ratio", "quick_ratio", "cash_ratio"],
    type: "line",
  },
  long_term_safety: {
    label: "長期安全性",
    keys: ["equity_to_asset_ratio", "fixed_ratio"],
    type: "line",
  },
  turnover: {
    label: "回転性",
    keys: ["receivables_turnover", "payables_turnover", "inventories_turnover"],
    type: "line",
  },
  dividend: {
    label: "配当",
    keys: ["dividend_on_equity", "dividend_yield"],
    type: "line",
  },
  number_of_employees: {
    label: "従業員数",
    keys: ["number_of_employees"],
    type: "line",
  },
};
