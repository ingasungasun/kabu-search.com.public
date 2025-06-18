#!/usr/bin/env python

import traceback

import mysql.connector

from lib.constants import MYSQL_CONFIG
from lib.functions import create_logger

logger = create_logger(__name__)

values = [
    ("水産・農林業",),
    ("鉱業",),
    ("建設業",),
    ("食料品",),
    ("繊維製品",),
    ("パルプ・紙",),
    ("化学",),
    ("医薬品",),
    ("石油・石炭製品",),
    ("ゴム製品",),
    ("ガラス・土石製品",),
    ("鉄鋼",),
    ("非鉄金属",),
    ("金属製品",),
    ("機械",),
    ("電気機器",),
    ("輸送用機器",),
    ("精密機器",),
    ("その他製品",),
    ("電気・ガス業",),
    ("陸運業",),
    ("海運業",),
    ("空運業",),
    ("倉庫・運輸関連",),  # 東証では「倉庫・運輸関連業」と表記される
    ("情報・通信業",),
    ("卸売業",),
    ("小売業",),
    ("銀行業",),
    ("証券、商品先物取引業",),
    ("保険業",),
    ("その他金融業",),
    ("不動産業",),
    ("サービス業",),
    ("",),
]

try:
    with mysql.connector.connect(**MYSQL_CONFIG) as cnx, cnx.cursor() as cursor:
        cursor.executemany(
            """
            INSERT INTO master_stock_industries
                (
                    name
                )
            VALUES
                (%s)
            ON DUPLICATE KEY UPDATE
                name=VALUES(name)
            """,
            values,
        )
        cnx.commit()

except mysql.connector.Error:
    logger.error(traceback.format_exc())

except Exception:
    logger.warning(traceback.format_exc())
