#!/usr/bin/env python

import env  # type: ignore

PROD_URL = "https://kabu-search.com"
STORAGE_DIR = "/var/www/.storage"
LOG_FILE_PATH = f"{STORAGE_DIR}/logs/python.log"

MYSQL_CONFIG = {
    "host": env.MYSQL_HOST,
    "database": env.MYSQL_DATABASE,
    "user": env.MYSQL_USER,
    "password": env.MYSQL_PASSWORD,
}

TSE_EQUITY_LIST_URL = "https://www.jpx.co.jp/markets/statistics-equities/misc/tvdivq0000001vg2-att/data_j.xls"
FSE_EQUITY_LIST_URL = "https://www.fse.or.jp/listed/single.php"
SSE_EQUITY_LIST_URL = "https://www.sse.or.jp/listing/list"
SSE_COMPANY_URL = "https://www.sse.or.jp/listing/company{ticker}"
NSE_HTML_PATH = f"{STORAGE_DIR}/files/nse.html"
