#!/usr/bin/env python

import datetime
import traceback

import edinet
import mysql.connector
from dateutil.relativedelta import relativedelta

from lib.functions import create_logger, delete_edinet_documents_older_than

logger = create_logger(__name__)

try:
    date = datetime.date.today() - relativedelta(years=edinet.DOCUMENT_AVAILABLE_YEARS)
    date_str = date.strftime("%Y-%m-%d")
    delete_edinet_documents_older_than(date_str)

except mysql.connector.Error:
    logger.error(traceback.format_exc())

except Exception:
    logger.warning(traceback.format_exc())
