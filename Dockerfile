FROM openresty/openresty:alpine

MAINTAINER John Zhuang <sunbei914914@msn.com>

ENV YWH_SERVICE_URL http://47.99.32.117
COPY dist /usr/share/nginx/html
# COPY WW_verify_nO692fpHLvdQ7wpK.txt /usr/share/nginx/html
COPY nginx.conf /usr/local/openresty/nginx/conf/nginx.conf

EXPOSE 80


