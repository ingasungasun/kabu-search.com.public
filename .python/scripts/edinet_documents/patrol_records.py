#!/usr/bin/env python

import sys
import traceback

import edinet.api
import mysql.connector

from lib.constants import MYSQL_CONFIG
from lib.functions import (
    create_logger,
    delete_edinet_documents,
    register_edinet_documents,
)

logger = create_logger(__name__)

try:
    with mysql.connector.connect(**MYSQL_CONFIG) as cnx, cnx.cursor() as cursor:
        cursor.execute(
            "SELECT file_date FROM edinet_metadata ORDER BY checked_at ASC LIMIT 1"
        )
        record = cursor.fetchone()

    if record is None:
        sys.exit()

    date = record[0]
    date_str = date.strftime("%Y-%m-%d")

    res = edinet.api.request_document_list(date_str, metadata_only=True)
    res.raise_for_status()
    res_json = res.json()
    metadata = res_json["metadata"]

    if metadata["status"] == "200":
        register_edinet_documents(date_str)
    elif metadata["status"] == "404":
        delete_edinet_documents(date_str)
    else:
        raise RuntimeError(metadata["message"])

except mysql.connector.Error:
    logger.error(traceback.format_exc())

except Exception:
    logger.warning(traceback.format_exc())
