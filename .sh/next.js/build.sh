#!/bin/bash

echo "set \$is_under_maintenance 1;" > /var/www/.etc/nginx/conf.d/10-maintenance.conf
docker container restart nginx

docker container stop app
docker container start builder
docker container exec builder npm run build
docker container stop builder
docker container start app

echo "set \$is_under_maintenance 0;" > /var/www/.etc/nginx/conf.d/10-maintenance.conf
docker container restart nginx
