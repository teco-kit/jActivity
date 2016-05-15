# Image with opencpu and rstudio-server
FROM opencpu/rstudio

# File Author / Maintainer
MAINTAINER  David Greiner <greiner@teco.edu>

Run apt-get update
RUN apt-get -y install libxml2-dev
RUN apt-get -y install libmysqlclient-dev
RUN /bin/echo -e "options(repos = c(CRAN = 'http://cran.rstudio.com'))\ninstall.packages('devtools')\ninstall.packages('RMySQL')\ninstall.packages('foreach')\ninstall.packages('plyr')\ninstall.packages('pmml')\ninstall.packages('XML')\ninstall.packages('rpart')\ninstall.packages('randomForest')\ninstall.packages('e1071')\nlibrary(devtools)\ninstall_github('teco-kit/jActivity2PMML')" > /tmp/packages.R \
    && Rscript /tmp/packages.R
