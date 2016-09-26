#!/bin/sh

# Requires maven to be on the classpath
# Skips test phase

mvn -T 1C install -pl dhis-web-portal -am -offline -DskipTests=true
mvn -T 1C install -pl dhis-web-portal -am -offline -DskipTests=true -f dhis-web/pom.xml -U


