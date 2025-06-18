#!/usr/bin/env python

import traceback

import mysql.connector

from lib.functions import create_logger, missing_dates_in_edinet_metadata

logger = create_logger(__name__)

try:
    missing_dates = missing_dates_in_edinet_metadata()

    if len(missing_dates) > 0:
        message = "The following date(s) do not exist in the 'edinet_metadata' table."

        for date_str in missing_dates:
            message += f"\n{date_str}"

        logger.info(message)

except mysql.connector.Error:
    logger.error(traceback.format_exc())

except Exception:
    logger.warning(traceback.format_exc())
