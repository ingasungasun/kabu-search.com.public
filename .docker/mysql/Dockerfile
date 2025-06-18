ARG IMAGE
FROM ${IMAGE}

WORKDIR /etc/mysql/conf.d
COPY ./.etc/mysql/conf.d/mysqld.cnf ./
COPY ./.secrets/mysql/mysqldump_password.cnf ./
RUN chmod 644 mysqld.cnf mysqldump_password.cnf
