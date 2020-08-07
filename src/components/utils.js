import Axios from 'axios'
import {sparqlEndpoint} from './config';
import $ from 'jquery';

export function loadXMLDoc(url){
  //See https://github.com/martin-honnen/martin-honnen.github.io/blob/master/xslt/arcor-archive/2016/test2016081501.html
  return new Promise(function(resolve) {
    var req = new XMLHttpRequest();
    req.open("GET", url);
    if (typeof XSLTProcessor === 'undefined') {
     try {
       req.responseType = 'msxml-document';
     }
     catch (e) {
       console.log('error', e)
     }
    }
    req.onload = function() {
     resolve(this.responseXML)
    }
    req.send();
  });
}

export function convertXMLDoc(xmlurl, xslurl){
  //See https://github.com/martin-honnen/martin-honnen.github.io/blob/master/xslt/arcor-archive/2016/test2016081501.html
  return new Promise(function(resolve, reject){
    Promise.all([loadXMLDoc(xmlurl), loadXMLDoc(xslurl)]).then(function(data) {
      const xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(data[1]);
      if (data[0]){
        const resultDocument = xsltProcessor.transformToFragment(data[0], document);
        resolve(resultDocument)
      }
      else{
        const reason = new Error('xml document could not be retrieved');
        reject(reason); // reject
      }
    })
  })
}

export function loadHtmlResultDocFromExist(url){
  return Axios.get("https://exist.scta.info/exist/apps/scta-app/xslt-conversion.xq?xmlurl=" + url)
}

export function nsResolver(prefix) {
    if(prefix === "tei") {
      return 'http://www.tei-c.org/ns/1.0'
    }
}

export function copyToClipboard(string){
  var dummy = document.createElement("textarea");
  document.body.appendChild(dummy);
  dummy.value = string;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
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

    // TODO: refactor. this could be a lot simpler
    if (highlight){
      element.addClass("highlightNone");
      $(".paragraphnumber").removeClass("highlight2")
      $(".plaoulparagraph").removeClass("highlightNone")
      $(".lbp-quote").removeClass("highlightNone")
      $(".lbp-quote").removeClass("highlight")
      $(".lbp-ref").removeClass("highlightNone")
      $(".lbp-ref").removeClass("highlight")
      $(".plaoulparagraph").removeClass("highlight")
      element.children(".paragraphnumber").addClass("highlight2")
      element.addClass( "highlight");
      
      // TODO: Refactor
      // conditional to ensure fire of next conditional ONLY IF element[0] is found
      // prevents error with include method below when element does not exist
      if (element[0]){
        // condition set to prevent fade if element is quote or ref 
        if (!element[0].className.includes('lbp-quote') && !element[0].className.includes('lbp-ref')){
          setTimeout(function(){
            $(".lbp-ref").removeClass("highlight")
            $(".lbp-quote").removeClass("highlight")
            $(".plaoulparagraph").removeClass("highlight")
            element.addClass("highlightNone");
          }, 2000);
        }
      }

    }
  	if (element.length > 0) {
  	    $('html, body')
              .stop()
              .animate({
                  scrollTop: element.offset().top - 100
              }, 1000);
     }

  }

  // adopted from https://github.com/hypothesis/client/blob/master/src/annotator/anchoring/text-position.js
  /**
 * Convert `start` and `end` character offset positions within the `textContent`
 * of a `root` element into a `Range`.
 *
 * Throws if the `start` or `end` offsets are outside of the range `[0,
 * root.textContent.length]`.
 *
 * @param {HTMLElement} root
 * @param {number} start - Character offset within `root.textContent`
 * @param {number} end - Character offset within `root.textContent`
 * @return {Range} Range spanning text from `start` to `end`
 */
export function toRange(root, start, end) {
  // The `filter` and `expandEntityReferences` arguments are mandatory in IE
  // although optional according to the spec.
  console.log("root", root)
  const nodeIter = root.ownerDocument.createNodeIterator(
    root,
    NodeFilter.SHOW_TEXT,
    null, // filter
    false // expandEntityReferences
  );

  let startContainer;
  let startOffset;
  let endContainer;
  let endOffset;

  let textLength = 0;

  let node;

  // TODO: modify this so that start container and character start are found based on word token position
  while ((node = nodeIter.nextNode()) && (!startContainer || !endContainer)) {
    const nodeText = node.nodeValue;
    if (
      !startContainer &&
      start >= textLength &&
      start <= textLength + nodeText.length
    ) {
      startContainer = node;
      startOffset = start - textLength;
    }

    if (
      !endContainer &&
      end >= textLength &&
      end <= textLength + nodeText.length
    ) {
      endContainer = node;
      endOffset = end - textLength;
    }

    textLength += nodeText.length;
  }

  if (!startContainer) {
    throw new Error('invalid start offset');
  }
  if (!endContainer) {
    throw new Error('invalid end offset');
  }

  const range = root.ownerDocument.createRange();
  range.setStart(startContainer, startOffset);
  range.setEnd(endContainer, endOffset);

  return range;
}

// function to remove spaces from selected html text
// less necessary now that jquery $(element).children('selectors').remove() can remove many unwanted spans
export function cleanText(selectedText){
  selectedText = selectedText.replace(/\*/gi, '' ) // remove app note links
  selectedText = selectedText.replace(/\[[a-z][a-z]\]/gi, '' ) // remove footnotes
  selectedText = selectedText.replace(/\w*[0-9]+[rvab]+/gi, '' ) // remove folio markers
  selectedText = selectedText.replace(/\s+/gi, ' ' )
  selectedText = selectedText.replace(/\s,\s/gi, ', ' )
  
  selectedText = selectedText.replace(/\s"\./gi, '". ' )
  selectedText = selectedText.replace(/\s:\s/gi, ': ' )
  selectedText = selectedText.replace(/\s\.\s/gi, '. ' )
  selectedText = selectedText.replace(/\s"\s/gi, '" ' )
  selectedText = selectedText.replace(/"\s\."/gi, '." ' )
  selectedText = selectedText.replace(/\s+/gi, ' ' )
  return selectedText
}