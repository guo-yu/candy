# DOCKER-VERSION 1.0.0

FROM ubuntu:14.04

# install nodejs and npm
RUN apt-get update
RUN apt-get install -y nodejs-legacy
RUN apt-get install -y npm
RUN apt-get install -y git
RUN apt-get install -y gcc-4.8

# add src code to this image
RUN mkdir /var/www
ADD . /var/www

# install deps
# install npm if it do not exist in local deps
RUN cd /var/www; npm install
RUN cd /var/www; npm install npm

# expose 3000 port to its master
EXPOSE 3000
CMD ["nodejs", "/var/www/app.js"]