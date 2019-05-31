import Axios from 'axios'
import {sparqlEndpoint} from './config';

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
