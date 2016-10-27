# Base OS
FROM tomcat:8.5.4-jre8

RUN rm -rf /usr/local/tomcat/webapps/ROOT

COPY ./hibernate.properties /opt/dhis2/config/hibernate.properties
COPY ./dhis-2/dhis-web/dhis-web-portal/target/dhis.war /usr/local/tomcat/webapps/ROOT.war

COPY ./dhis.nginx.conf /opt/dhis2/config/dhis.nginx.conf

RUN apt-get update && apt-get install -y nginx

RUN rm /etc/nginx/sites-enabled/default \
    && ln -sf /opt/dhis2/config/dhis.nginx.conf /etc/nginx/sites-enabled

RUN echo "export JAVA_OPTS=$JAVA_OPTS\nexport DHIS2_HOME='/opt/dhis2/config'" >> /usr/local/tomcat/bin/setenv.sh
COPY ./wait-for-it.sh ./wait-for-it.sh
