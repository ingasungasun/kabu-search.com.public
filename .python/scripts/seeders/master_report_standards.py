#!/usr/bin/env python

import traceback

import mysql.connector

from lib.constants import MYSQL_CONFIG
from lib.functions import create_logger

logger = create_logger(__name__)

values = [
    ("JGAAP",),
    ("USGAAP",),
    ("IFRS",),
]

try:
    with mysql.connector.connect(**MYSQL_CONFIG) as cnx, cnx.cursor() as cursor:
        cursor.executemany(
            """
            INSERT INTO master_report_standards
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
