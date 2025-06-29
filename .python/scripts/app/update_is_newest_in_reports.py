#!/usr/bin/env python

import traceback

import mysql.connector

from lib.constants import MYSQL_CONFIG

try:
    with mysql.connector.connect(**MYSQL_CONFIG) as cnx, cnx.cursor() as cursor:
        cursor.execute(
            """
            SELECT MAX(id)
            FROM reports
            GROUP BY ticker
            """
        )
        records = cursor.fetchall()
        newest_ids = [str(record[0]) for record in records]
        comma_separated_ids = ",".join(newest_ids)

        cursor.execute(
            f"""
            UPDATE reports
            SET is_newest = CASE WHEN id IN ({comma_separated_ids}) THEN 1 ELSE 0 END
            """
        )
        cnx.commit()

except Exception:
    print(traceback.format_exc())
