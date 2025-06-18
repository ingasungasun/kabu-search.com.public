#!/usr/bin/env python

import os
import shutil
import traceback

import mysql.connector

from lib.constants import MYSQL_CONFIG, STORAGE_DIR
from lib.functions import create_logger

logger = create_logger(__name__)

DOCUMENTS_DIR = f"{STORAGE_DIR}/documents"
tickers_in_db = set()
tickers_in_storage = set()

"""
データベースに存在しない銘柄の決算書がストレージに残っていたら削除する。
"""
try:
    with mysql.connector.connect(**MYSQL_CONFIG) as cnx, cnx.cursor() as cursor:
        cursor.execute("SELECT ticker FROM stocks")
        records = cursor.fetchall()

        for record in records:
            ticker = record[0]
            tickers_in_db.add(ticker)

    for subdir_name in os.listdir(DOCUMENTS_DIR):
        subdir_path = f"{DOCUMENTS_DIR}/{subdir_name}"

        if os.path.isdir(subdir_path):
            for ticker in os.listdir(subdir_path):
                tickers_in_storage.add(ticker)

    missing_tickers = tickers_in_storage - tickers_in_db

    for ticker in missing_tickers:
        dir_path = f"{DOCUMENTS_DIR}/{ticker[0:2]}/{ticker}"
        shutil.rmtree(dir_path)

except mysql.connector.Error:
    logger.error(traceback.format_exc())

except Exception:
    logger.warning(traceback.format_exc())
