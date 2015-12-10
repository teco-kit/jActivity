FROM mysql/mysql-server
MAINTAINER  David Greiner <david@ultitech.de>

ADD jactivity2.sql /docker-entrypoint-initdb.d/jactivity2.sql

#ADD run_db init_db jactivity2.sql /tmp/

#RUN /tmp/init_db

#ENTRYPOINT "/tmp/run_db"

EXPOSE 3306
