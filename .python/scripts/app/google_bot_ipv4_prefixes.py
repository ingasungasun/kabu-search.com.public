#!/usr/bin/env python

import json

import requests

URL = "https://www.gstatic.com/ipranges/goog.json"
res = requests.get(URL)
data = json.loads(res.text)

for prefix in data["prefixes"]:
    if "ipv4Prefix" in prefix:
        ip = prefix["ipv4Prefix"]
        count = 18 - len(ip)
        print(f"  {ip}{" " * count}1;")
