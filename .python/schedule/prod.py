#!/usr/bin/env python

import os  # noqa: F401
import time

import schedule


def exec(command: str):
    os.system(command)


# app
schedule.every().sunday.at("02:20").do(exec, "app/find_incomplete_documents.py")
schedule.every().day.at("02:21").do(exec, "app/generate_sitemap.py")

# edinet_documents
schedule.every().day.at("03:30").do(exec, "edinet_documents/delete_expired_records.py")
schedule.every().day.at("03:31").do(exec, "edinet_documents/find_missing_records.py")
schedule.every().day.at("03:32").do(exec, "edinet_documents/register_yesterday.py")

# edinet_metadata
schedule.every().day.at("04:40").do(exec, "edinet_metadata/find_missing_dates.py")

# reports
schedule.every().minute.at(":30").do(exec, "reports/register_records.py")

# stocks
schedule.every().day.at("05:50").do(exec, "stocks/delete_unnecessary_documents.py")
schedule.every().day.at("05:51").do(exec, "stocks/register_records_from_fse.py")
schedule.every().day.at("05:52").do(exec, "stocks/register_records_from_nse.py")
schedule.every().day.at("05:53").do(exec, "stocks/register_records_from_sse.py")
schedule.every().day.at("05:54").do(exec, "stocks/register_records_from_tse.py")
schedule.every().day.at("05:55").do(exec, "stocks/update_records_from_edinet.py")
schedule.every().day.at("05:56").do(exec, "stocks/update_website.py")

while True:
    schedule.run_pending()
    time.sleep(1)
