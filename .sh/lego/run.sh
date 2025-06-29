#!/bin/bash

path="/var/www"
email="lego@kabu-search.com"


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
run
