#!/usr/bin/env python

import requests
from env import EDINET_API_KEY

DOCUMENT_LIST_ENDPOINT = "https://api.edinet-fsa.go.jp/api/v2/documents.json"
DOCUMENT_ENDPOINT = "https://api.edinet-fsa.go.jp/api/v2/documents/{doc_id}"


def request_document_list(date: str, metadata_only=False):
    return requests.get(
        DOCUMENT_LIST_ENDPOINT,
        params={
            "date": date,
            "type": "1" if metadata_only else "2",
            "Subscription-Key": EDINET_API_KEY,
        },
    )


def request_document(doc_id: str, type="1"):
    return requests.get(
        DOCUMENT_ENDPOINT.format(doc_id=doc_id),
        params={
            "type": type,
            "Subscription-Key": EDINET_API_KEY,
        },
        stream=True,
    )
