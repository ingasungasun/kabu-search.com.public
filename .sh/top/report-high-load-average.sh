#!/bin/bash

loadavg=$(cat /proc/loadavg | cut -d ' ' -f 1)
threshold=1.00
file_path='/var/www/.storage/logs/top.log'
divider='==============================================================================='

if [ $(echo "$loadavg >= $threshold" | bc) -eq 1 ]; then
    echo "$divider" >> $file_path
    echo " datetime: $(date +'%Y-%m-%d %H:%M:%S')" >> $file_path
    echo "$divider" >> $file_path
    top -b -n 1 -o %CPU  >> $file_path
    echo '' >> $file_path
fi
