import Axios from 'axios'
import {sparqlEndpoint} from './config';
import $ from 'jquery';

export function loadXMLDoc(filename)
  {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", filename, false);
    try {xhttp.responseType = "msxml-document"} catch(err) {} // Helping IE11
    xhttp.send("");
    return xhttp.responseXML;
  }

export function convertXMLDoc(xmlurl, xslurl){
  const xml = loadXMLDoc(xmlurl)
  const xsl = loadXMLDoc(xslurl)
  const xsltProcessor = new XSLTProcessor();
  xsltProcessor.importStylesheet(xsl);
  const resultDocument = xsltProcessor.transformToFragment(xml, document);
  return resultDocument;
}

export function runQuery(query){
  //const sparqlEndpoint = "https://sparql-docker.scta.info/ds/query"
  //const sparqlEndpoint = sparqlEndpoint
  const queryPromise = Axios.get(sparqlEndpoint, { params: { "query": query, "output": "json" } })
  return queryPromise
}

//handles scroll to paragraph procedure
export function scrollToParagraph(hash, highlight){
    const element = $("#" + hash);

    // TODO: highlighting is NOT working
    if (highlight){
      element.css({backgroundColor: "yellow"});
      element.animate({backgroundColor: "none"}, 5000);
    }
  	if (element.length > 0) {
  	    $('html, body')
              .stop()
              .animate({
                  scrollTop: element.offset().top - 100
              }, 1000);
     }

  }
