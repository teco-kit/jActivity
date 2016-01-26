# Image with opencpu and rstudio-server
FROM opencpu/rstudio

# File Author / Maintainer
MAINTAINER  David Greiner <greiner@teco.edu>

RUN /bin/echo -e "install.packages('opencpu')\nlibrary(devtools)\ninstall_github('teco-kit/jActivity2PMML')" > /tmp/packages.R \
    && Rscript /tmp/packages.R
