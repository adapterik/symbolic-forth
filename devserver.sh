#!/bin/env bash

# docker run --rm --name forth-server -v ${PWD}/source:/usr/share/nginx/html:ro -p 3000:80 -d nginx

docker run --rm -t -v ${PWD}/source:/var/www/localhost/htdocs -p 3000:80 sebp/lighttpd
