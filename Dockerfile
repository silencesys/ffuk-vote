FROM node:14-slim

# Update OS packages and install required ones.
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y --no-install-recommends \
      ca-certificates \
      curl \
      zip \
      unzip \
      libaio1 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* \
    && rm /var/log/lastlog /var/log/faillog

# Download oracle packages and install OCI8
RUN curl -o instantclient-basic-linux.x64-19.6.0.0.0dbru.zip https://download.oracle.com/otn_software/linux/instantclient/19600/instantclient-basic-linux.x64-19.6.0.0.0dbru.zip \
    && unzip instantclient-basic-linux.x64-19.6.0.0.0dbru.zip -d /usr/lib/oracle/ \
    && rm instantclient-basic-linux.x64-19.6.0.0.0dbru.zip \
    && curl -o instantclient-sdk-linux.x64-19.6.0.0.0dbru.zip https://download.oracle.com/otn_software/linux/instantclient/19600/instantclient-sdk-linux.x64-19.6.0.0.0dbru.zip \
    && unzip instantclient-sdk-linux.x64-19.6.0.0.0dbru.zip -d /usr/lib/oracle/ \
    && rm instantclient-sdk-linux.x64-19.6.0.0.0dbru.zip \
    && echo /usr/lib/oracle/instantclient_19_6 > /etc/ld.so.conf.d/oracle-instantclient.conf \
    && ldconfig

ENV LD_LIBRARY_PATH /usr/lib/oracle/instantclient_19_6

WORKDIR /app
COPY ./ /app

RUN npm ci --only=production

CMD [ "npm", "run", "start" ]