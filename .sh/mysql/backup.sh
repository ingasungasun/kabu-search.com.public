#!/bin/bash

period=7
backup_dir="/var/www/.storage/backup"
database_name=kabu_search

file_name="db.$(date +%Y-%m-%d).sql"
old_file_name="db.$(date --date "$period days ago" +%Y-%m-%d).sql"

cd $backup_dir
mysqldump -uroot $database_name > $file_name
gzip $file_name

if [ -f "${old_file_name}.gz" ]; then
  rm "${old_file_name}.gz"
fi
