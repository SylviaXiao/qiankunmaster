FROM nginx:stable-alpine
VOLUME /tmp
#将当前文件夹的dist文件复制到容器的/usr/share/nginx/html目录
ADD ./dist/ /usr/share/nginx/html/
#COPY ./dist/* /usr/share/nginx/html/
#COPY ./dist/static /usr/share/nginx/html/static
COPY default.conf /etc/nginx/conf.d/
#声明运行时容器暴露的端口（容器提供的服务端口）
EXPOSE 4445
#CMD:指定容器启动时要运行的命令
CMD ["nginx", "-g", "daemon off;"]