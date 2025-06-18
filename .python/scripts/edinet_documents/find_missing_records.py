#!/usr/bin/env python

import traceback

import mysql.connector

from lib.constants import MYSQL_CONFIG
from lib.functions import create_logger

logger = create_logger(__name__)

try:
    with mysql.connector.connect(**MYSQL_CONFIG) as cnx, cnx.cursor() as cursor:
        cursor.execute(
            """
            SELECT tb1.file_date
            FROM edinet_metadata AS tb1
            LEFT JOIN
                (
                    SELECT meta.file_date, COUNT(doc.id) AS count
                    FROM edinet_metadata AS meta
                    LEFT JOIN edinet_documents AS doc
                    ON meta.file_date = doc.file_date
                    GROUP BY meta.file_date
                ) AS tb2
            ON tb1.file_date = tb2.file_date
            WHERE tb1.count != tb2.count
            """
        )
        records = cursor.fetchall()

    if len(records) > 0:
        message = (
            "The following date(s) do not match counts"
            " between the 'edinet_metadata' table and the 'edinet_documents' table."
        )

        for record in records:
            message += "\n"
            message += record[0].strftime("%Y-%m-%d")

        logger.info(message)

except mysql.connector.Error:
    logger.error(traceback.format_exc())

except Exception:
    logger.warning(traceback.format_exc())
