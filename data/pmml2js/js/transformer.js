/** 
Inspired by http://www.w3schools.com/xsl/xsl_client.asp 
**/
function ajaxRequest(method, url, responseType) {
  if (window.ActiveXObject) {
    if(responseType == "msxml-document")
      responseType = "Msxml2.XMLHTTP"
    xhttp = new ActiveXObject(responseType);
  } else {
    xhttp = new XMLHttpRequest();
  }
  xhttp.open(method, url, false);
  try {
    xhttp.responseType = "msxml-document"
  } catch (err) {} // IE11 catch
  xhttp.send("");
  return xhttp.responseXML;
}

function transform(xml, xsl) {
  // IE specific code
  if (window.ActiveXObject /*|| xhttp.responseType == "msxml-document"*/) {
    ex = xml.transformNode(xsl);
    return ex;
  }
  // code for Chrome, Firefox, Opera, etc.
  else if (documentImplementationAvailable()) {
    xsltProcessor = new XSLTProcessor();
    xsltProcessor.importStylesheet(xsl);
    resultDocument = xsltProcessor.transformToFragment(xml, document);
    return resultDocument;
  }
}

function documentImplementationAvailable(){
  return document.implementation && document.implementation.createDocument;
}