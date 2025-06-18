#!/usr/bin/env python

import datetime
import re
import sys
import traceback

import mysql.connector

from lib.functions import create_logger, register_edinet_documents

logger = create_logger(__name__)

try:
    if len(sys.argv) < 2:
        sys.exit("Input an argument.")

    specified_date_str = sys.argv[1]

    if not re.match(r"^\d{4}-\d{2}-\d{2}$", specified_date_str):
        sys.exit("Input an argument in 'YYYY-MM-DD' format.")

    specified_date = datetime.date.fromisoformat(specified_date_str)
    today = datetime.date.today()

    if specified_date >= today:
        sys.exit("The specified date is not before today. It don't have to register.")

    register_edinet_documents(specified_date_str)

except mysql.connector.Error:
    logger.error(traceback.format_exc())

except Exception:
    logger.warning(traceback.format_exc())
