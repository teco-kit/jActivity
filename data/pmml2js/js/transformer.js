"use strict;"

function ajaxRequestPromise(method, url, responseType) {
  return $.ajax({
      method: method,
      url: url,
      dataType: responseType
    })
    .done(function(msg) {
      $(this).add
    });
}

function initiateExecutableModel(modelUrl, transformSheetUrl, evaluateableFunction) {
  xmlreq = ajaxRequestPromise("GET", modelUrl, "xml");
  xslreq = ajaxRequestPromise("GET", transformSheetUrl, "xml");

  var executableModel;
  
  return $.when(xmlreq, xslreq).done(function(xmlreq, xslreq) {
    // the first element of the response is a document object
    xmldocument = xmlreq[0];
    xsldocument = xslreq[0];
    // Handle both XHR objects
    generated_code = transform(xmldocument, xsldocument).code;
    executableModel = eval(generated_code);
    
    evaluateableFunction(executableModel);

  });

  return executableModel;
}

function transform(xmldocument, xsldocument) {
  // IE specific code - not tested
  if (window.ActiveXObject) {
    ex = xmldocument.transformNode(xsldocument);
    return ex;
  } else if (documentImplementationAvailable()) {
    xsltProcessor = new XSLTProcessor();
    y = xsltProcessor;
    xsltProcessor.importStylesheet(xsldocument);
    resultDocument = xsltProcessor.transformToFragment(xmldocument, document);
    return {code: resultDocument.textContent};
  }
}

function documentImplementationAvailable() {
  return document.implementation && document.implementation.createDocument;
}