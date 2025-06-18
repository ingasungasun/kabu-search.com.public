ARG IMAGE
FROM ${IMAGE}

RUN pip install --upgrade pip

WORKDIR /tmp
COPY ./.sh/python/pip-install.sh ./
RUN chmod 755 pip-install.sh
RUN ./pip-install.sh
