#!/usr/bin/env python

import datetime
import traceback

import mysql.connector

from lib.functions import create_logger, register_edinet_documents

logger = create_logger(__name__)

try:
    yesterday = datetime.date.today() - datetime.timedelta(days=1)
    yesterday_str = yesterday.strftime("%Y-%m-%d")
    register_edinet_documents(yesterday_str)

except mysql.connector.Error:
    logger.error(traceback.format_exc())

except Exception:
    logger.warning(traceback.format_exc())
