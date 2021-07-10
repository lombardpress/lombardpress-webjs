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

function nodeFilterCheck(node){
  
  const check = node.parentElement.className
  // skip text nodes if their parent has the following classes
  if (check.includes("paragraphnumber") 
  || check.includes("lbp-line-number")
  || check.includes("appnote") 
  || check.includes("paragraphnumber")
  || check.includes("footnote")
  || check.includes("lbp-reg")
  || check.includes("lbp-folionumber")
  || check.includes("js-show-folio-image") // removes folio number
  ){
    return NodeFilter.FILTER_REJECT
  }
  else if (!node.nodeValue){
    return NodeFilter.FILTER_REJECT
  }
  else{
    return NodeFilter.FILTER_ACCEPT;
  }
  
}

export function toRange(root, start, end) {
  // The `filter` and `expandEntityReferences` arguments are mandatory in IE
  // although optional according to the spec.
  //console.log("root", root)
  const nodeIter = root.ownerDocument.createNodeIterator(
    root,
    NodeFilter.SHOW_TEXT,
    nodeFilterCheck, // filter
    true // expandEntityReferences
  );

  let startContainer;
  let startOffset;
  let startWordOffset
  let endContainer;
  let endOffset;
  let endWordOffset;
  let breaks = 0;

 // let textLength = 0;
  let wordLength = 0;
  let node;

  
  while ((node = nodeIter.nextNode()) && (!startContainer || !endContainer)) {
    // keep running total of break words and then use this to adjust word count 
    // in comparison to word count with broken words; then adjust;
    // NOTE: requires xslt to add data-break='no' to line break span
    if (node.previousSibling){
      if (node.previousSibling.getAttribute){
        if (node.previousSibling && node.previousSibling.getAttribute("data-break") === "no"){
          breaks += 1
        }
      }
    }
    const nodeText = node.nodeValue;
    // get array of words in node
    const nodeTextArray = cleanText(nodeText).split(" ").filter(n=>n)
    // use clean text to remove punctuation and unwanted white space, then filter to get rid of blank array items, then count
    const newWordLength = nodeTextArray.length
    
    // if start word is greater than length of word count in preceding nodes, but less than or equal 
    // to word count of of preceding plus this node, then selection starts somewhere within this node
    // select node, then find precise word and character position start
    if (
      !startContainer &&
      start + breaks >= wordLength &&
      start + breaks <= wordLength + newWordLength
    ) {
      startContainer = node;
      startWordOffset = (start + breaks) - wordLength;
      
      // get the occurrence instance within the node (needed in case there are two more instances of the same word in the node)
      const instanceNumber = getInstanceNumber(nodeTextArray, startWordOffset - 1)
      // calculate character offset of word within containing node
      startOffset = getStringBeforeWord(node.nodeValue, nodeTextArray[startWordOffset - 1], instanceNumber, true)
    }
    // similar to above only for final position
    if (
      !endContainer &&
      end + breaks >= wordLength &&
      end + breaks <= wordLength + newWordLength
    ) {
      endContainer = node;
      endWordOffset = (end + breaks) - wordLength;
      // get the occurrence instance within the node (needed in case there are two more instances of the same word in the node)
      const instanceNumber = getInstanceNumber(nodeTextArray, endWordOffset - 1)
      // calculate character offset of word within containing node
      endOffset = getStringBeforeWord(node.nodeValue, nodeTextArray[endWordOffset - 1], instanceNumber, false)
    }

    //textLength += nodeText.length;
    wordLength += newWordLength
    
    
  }

  const range = root.ownerDocument.createRange();
  //conditional here to if container exists before calling it.
  //usual reason a end container doesn't exist is the end number in the request does not exist in the paragraph 
  // for example, asking for end word 40 when there are only 39 words in the paragraph
  startContainer ? range.setStart(startContainer, startOffset) : console.log("no container or invalid end offset")
  endContainer ? range.setEnd(endContainer, endOffset) : console.log("no container invalid end offset")

  return range;
}

// function to remove spaces from selected html text
export function cleanText(selectedText){
  selectedText = selectedText.replace(/^[ ]+|[ ]+$/g,''); // remove leading and trailing white space
    // remove all punctuation with escape slashes; escape slashes don't seem needed as the line below with slashes seems to work.
    // this line with extra slashes produces lint errors
    // selectedText = selectedText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()"]/g,"") //remove all punctuation
  selectedText = selectedText.replace(/[.,/#!$%^&*;:{}=\-_`~()"]/g,"") //remove all punctuation
  
  selectedText = selectedText.replace(/\s+/gi, ' ' ) // condences 1 or more space to single space
  return selectedText
}

/**
 * @description returns identical instance number of a certain item in array,
 * e.g. if we have array [1, 2, 3, 4, 5, 1, 2, 3] 
 * and we ask for the instanceNumber of index position 5, 
 * the function will return 2, as this is the second instance of the number 1 in this array
 * @param {array} wordArray 
 * @param {number} wordPosition 
 */
function getInstanceNumber(wordArray, wordPosition){
  let number = 0
  // using <= to include self in count
  for (let i=0; i <= wordPosition; i++){
    if (wordArray[i] === wordArray[wordPosition]){
      number++
    }
  }
  return number
}
/**
 * @description get strings before nth instance of a word
 * @param {string} text - string to be search
 * @param {string} word - word to be matched
 * @param {number} instanceNumber - number instance of word to be matched
 * modified from https://stackoverflow.com/questions/14480345/how-to-get-the-nth-occurrence-in-a-string
 */
function getStringBeforeWord(text, word, instanceNumber, first) {
  const splitText = text.split(word, instanceNumber).join(word);  
  if (first){
    const characterOffset = splitText.length
    return characterOffset
  }
  else{
    const characterOffset = splitText.length + word.length
    return characterOffset

  }
}
/**
 * @description creates a range
 * @param {*} root 
 * @param {*} startContainer 
 * @param {number} startOffset start character relative to containing node
 * @param {*} endContainer 
 * @param {number} endOffset - end character length relative to containing node
 */

export function createRange(root, startContainer, startOffset, endContainer, endOffset){
  const range = root.ownerDocument.createRange();
  range.setStart(startContainer, startOffset);
  range.setEnd(endContainer, endOffset);
  return range;
}
/**
 * @description takes a range object and computes the Word Count after filtering elements nodes not to be counted
 * @param {Range} rng - must take a Range object
 */
export function getRangeWordCount(rng){
  var cnt = rng.cloneContents();
  $(cnt).find(".lbp-line-number, .paragraphnumber, br, .lbp-folionumber, .appnote, .footnote, .lbp-reg").remove();
  const selectionText = cleanText(cnt.textContent)
  const length = selectionText.split(" ").filter(n=>n).length
  return length;
}

 
/**
 * @description gets the containing paragraph node for a node somewhere within the paragraph node
 * @param {node} node 
 */
export function getContainingP(node) {
  while (node) {
    if (node.nodeType === 1 && node.tagName.toLowerCase() === "p") {
        return node;
    }
    node = node.parentElement;
  }
}

/**
 * @description retrieves plain text and counts line breaks based on input
 */
export function getLineNumber(url, selectedText, selectedElementTargetId){
  //https://github.com/scta-texts/plaoulcommentary/edit/master/lectio1/lectio1.xml#L117
  //https://raw.githubusercontent.com/scta-texts/plaoulcommentary/master/lectio1/lectio1.xml
  //https://raw.githubusercontent.com/scta-texts/plaoulcommentarymaster/lectio1/lectio1.xml
  const newRawUrl = url.replace("https://github.com", "https://raw.githubusercontent.com").replace("/raw/", '/')
  const file = Axios.get(newRawUrl)
  const data = file.then((d) => {
    const findElement = "xml:id=\"" + selectedElementTargetId + "\""
    const splitText = d.data.split(findElement);
    const beforeText = splitText[0]
    const splitBeforeText = beforeText.split('\n');
    const newLineCount = splitBeforeText.length
    
    const afterText = splitText[1]
    const regexp = new RegExp(`\\W${selectedText}\\W`, 'gi')
    const elementBeforeText = afterText.split(regexp)[0] // this is flawed, first instance of the same text will be used
    const splitElementBeforeText = elementBeforeText.split('\n');
    const newElementLineCount = splitElementBeforeText.length
    return newLineCount + newElementLineCount - 1
  })
  return data
}

export function goToGitHubEdit(url, selectedText, selectedElementTargetId){
  console.log(url, selectedText, selectedElementTargetId)
  const data = getLineNumber(url, selectedText, selectedElementTargetId)
  //https://github.com/scta-texts/plaoulcommentary/raw/master/lectio1/lectio1.xml
  data.then((d) => {
    const editUrl = url.replace("raw", "edit") + "#L" + d
    window.open(editUrl,"gitHubEditWindow",'height=750,width=750');
    //window.open(editUrl, "_blank"); 

  })
  
  //window.location = 
  
}