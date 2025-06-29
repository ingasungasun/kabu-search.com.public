#!/bin/bash

echo "set \$is_under_maintenance 0;" > /var/www/.etc/nginx/conf.d/10-maintenance.conf
docker container restart nginx
