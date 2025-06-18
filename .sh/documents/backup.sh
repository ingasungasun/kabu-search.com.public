#!/bin/bash

period=7
storage_dir="/var/www/.storage"
backup_dir="/var/www/.storage/backup"

file_name="documents.$(date +%Y-%m-%d).tar.gz"
old_file_name="documents.$(date --date "$period days ago" +%Y-%m-%d).tar.gz"

cd $storage_dir
tar cfz $file_name documents/
mv $file_name $backup_dir

cd $backup_dir
if [ -f $old_file_name ]; then
  rm $old_file_name
fi
