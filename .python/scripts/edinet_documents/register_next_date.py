#!/usr/bin/env python

import datetime
import sys
import traceback

import mysql.connector

from lib.constants import MYSQL_CONFIG
from lib.functions import create_logger, register_edinet_documents

logger = create_logger(__name__)

try:
    with mysql.connector.connect(**MYSQL_CONFIG) as cnx, cnx.cursor() as cursor:
        cursor.execute(
            "SELECT file_date FROM edinet_metadata ORDER BY file_date DESC LIMIT 1"
        )
        record = cursor.fetchone()

    if record is None:
        sys.exit()

    date = record[0]
    next_date = date + datetime.timedelta(days=1)
    today = datetime.date.today()

    if next_date >= today:
        sys.exit("The next date is not before today. It don't have to register.")

    next_date_str = next_date.strftime("%Y-%m-%d")
    register_edinet_documents(next_date_str)

except mysql.connector.Error:
    logger.error(traceback.format_exc())

except Exception:
    logger.warning(traceback.format_exc())
