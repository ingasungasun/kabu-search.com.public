#!/bin/bash

path="/var/www"
email="lego@kabu-search.com"
days=30

docker container run \
--rm \
-v $path:$path goacme/lego \
--accept-tos \
--domains="kabu-search.com" \
--domains="db.kabu-search.com" \
--domains="mail.kabu-search.com" \
--domains="jenkins.kabu-search.com" \
--email=$email \
--path=$path/.secrets/lego \
--http \
--http.webroot=$path \
renew \
--days $days

current_timestamp=$(date '+%s')
crt_timestamp=$(date '+%s' -r "/var/www/.secrets/lego/certificates/kabu-search.com.crt")

if [ $(($current_timestamp - $crt_timestamp)) -lt 86400 ]; then
  docker container exec nginx nginx -s reload
  systemctl restart postfix dovecot
fi
