# Image with opencpu and rstudio-server
FROM opencpu/base

# File Author / Maintainer
MAINTAINER  David Greiner <greiner@teco.edu>

RUN apt-get update
RUN apt-get -y install libxml2-dev
RUN apt-get -y install libmysqlclient-dev
RUN /usr/bin/R -e 'install.packages(c("devtools", "RMySQL", "foreach", "plyr", "pmml", "XML", "rpart", "randomForest", "e1071"), repo = "https://cran.rstudio.com")'
RUN /bin/echo -e 'library(devtools)\ninstall_github("teco-kit/jActivity2PMML")' > /tmp/install.R
RUN Rscript /tmp/install.R 
