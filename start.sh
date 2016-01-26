#
# Until Docker implements a solution to wait for other containers this will have to do
#
clear

docker-compose up -d mysql
docker-compose up -d gulp
docker-compose up -d opencpu
docker-compose up -d apache
sleep 10s
docker-compose up -d node
exit 0
