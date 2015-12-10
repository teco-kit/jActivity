FROM mysql
MAINTAINER  David Greiner <david@ultitech.de>

ADD run_db init_db mowat.sql /tmp/

RUN /tmp/init_db

ENTRYPOINT "/tmp/run_db"

EXPOSE 3306	
