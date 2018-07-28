FROM openresty/openresty:alpine

ENV YWH_SERVICE_URL http://47.99.32.117
COPY dist /usr/share/nginx/html
COPY WW_verify_nO692fpHLvdQ7wpK.txt /usr/share/nginx/html

COPY nginx.conf /usr/local/openresty/nginx/conf/nginx.conf

#ADD ./docker-run.sh /usr/share/nginx/

EXPOSE 80

#CMD ["sh", "/usr/share/nginx/docker-run.sh"]
