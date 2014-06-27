# DOCKER-VERSION 1.0.0

FROM    ubuntu:14.04

# Install Node.js and npm
RUN     apt-get install -y npm git
ADD     . /src

RUN     cd /src; npm install

EXPOSE  8080
CMD ["PORT=8080","NODE_ENV=production", "node", "/src/app.js"]
