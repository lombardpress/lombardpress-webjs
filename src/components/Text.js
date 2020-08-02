
import React from 'react';
import Spinner from './Spinner';
import $ from 'jquery';
import {convertXMLDoc, scrollToParagraph, loadHtmlResultDocFromExist} from './utils'
import ReactTooltip from 'react-tooltip';


class Text extends React.Component {
  constructor(props){
    super(props)
    this.retrieveText = this.retrieveText.bind(this)
    this.handleOnClick = this.handleOnClick.bind(this)
    this.handleHide = this.handleHide.bind(this)
    this.state = {
      fetching: false,
      selectionRect: {left: "", top: ""},
      selectedText: "",
      startToken: undefined,
      endToken: undefined 
    }


  }
  retrieveText(doc, topLevel, scrollTo){
    const _this = this;
    
    if (doc){
      //construct file url request ot exist db to get a cors enabled copy of the text (github does not serve files with cors enabled)
      const doc = this.props.doc;
      const topLevel = this.props.topLevel;
      const docFragment = doc.split("/master/")[1]
      const topLevelFragment = topLevel.split("/resource/")[1]
      
      let xmlurl = ""
      if (doc.includes("ipfs")){
        xmlurl = doc
      }
      else{
        xmlurl = "https://exist.scta.info/exist/apps/scta-app/text/" + topLevelFragment + "/" + docFragment;
      }
      const xslurl = "/xslt/main_view.xsl"

      //Begin fetch and conversion
      this.setState({fetching: true})
      //frist try to request html converted by eXist
      const resultDocument = loadHtmlResultDocFromExist(xmlurl)
      resultDocument.then((data) => {
        throw "test exception"
        this.setState({fetching: false})
        //appendage to file
        //and event binding
        //happens inside promise call back
        document.getElementById("text").innerHTML = "";
        document.getElementById("text").innerHTML = data.data;
        // add event binding
        this.setEvents(_this, scrollTo)
      })
      .catch((e) => {
        // if eXist conversion fails, do conversion in browser
        const resultDocument = convertXMLDoc(xmlurl, xslurl)
        resultDocument.then((data) => {
          this.setState({fetching: false})
          document.getElementById("text").innerHTML = "";
          document.getElementById("text").appendChild(data)
          // add event binding
          this.setEvents(_this, scrollTo)
          }).catch((e) => {
            //if browswer conversion fails, log error message
            console.log("something went wrong", e)
            document.getElementById("text").innerHTML = "";
            document.getElementById("text").innerHTML = "<p>Apologies, the document is not able to be loaded at this time</p>";
          })
        })
      }
  }

  setEvents(_this, scrollTo){

    $('.paragraphnumber').click(function(e) {
      e.preventDefault();
      const id = $(this).parent("p").attr('id')
      _this.props.setFocus(id)
      _this.props.openWindow("window1")
    });
    if (scrollTo){
     scrollToParagraph(scrollTo, true)
   }

   $('.js-show-folio-image').click(function(e) {
     e.preventDefault();
     const surfaceid = $(this).attr('data-surfaceid');
     const paragraphid = $(this).closest('.plaoulparagraph').attr("id");

     _this.props.setFocus(paragraphid)
     _this.props.handleSurfaceFocusChange("http://scta.info/resource/" + surfaceid)
     _this.props.openWindow("window2", "surface2")
   });

   $('.lbp-line-number').click(function(e) {
     e.preventDefault();
     const surfaceid = $(this).attr('data-surfaceid');
     const ln = $(this).attr('data-ln');
     const paragraphid = $(this).closest('.plaoulparagraph').attr("id");

     _this.props.setFocus(paragraphid)
     _this.props.handleSurfaceFocusChange("http://scta.info/resource/" + surfaceid)
     _this.props.handleLineFocusChange("http://scta.info/resource/" + surfaceid + "/" + ln)
     _this.props.openWindow("window2", "surface2")
   });

   $('.appnote, .footnote').click(function(e) {
        e.preventDefault();
        $(this).attr("data-tip", "hello world")
        const link = $(this).parent().children('.appnote, .footnote')
        const target = $(link).attr('href')
        const text = $(target).html()
        const targetText = $(this).parent().children(".note-display").attr('data-target-id')
        
        //capture note display element
        const noteDisplay = $(this).parent().children(".note-display")

        // TODO: the below highlighting procedures seems to work
        // but it could be improved in coordination with the improvement of highlighting and fading paragraph/div 
        // see utils.js for the companion highlighting toggle functions

        /// NOTE: below is an explanation of the conditional
        // toggles highlight for select text segments
        // conditional checks if note display is already showing
        // if not showing, it removes hidden class and highlights target element (quote or ref)
        if (targetText && noteDisplay.attr("class").includes("hidden")){
          noteDisplay.removeClass("hidden")
          $("#" + targetText).addClass("highlight")
          $("span[data-corresp=" + targetText + "]").addClass("highlight")
          $("#" + targetText).removeClass("highlightNone")
          $("span[data-corresp=" + targetText + "]").removeClass("highlightNone")
        }
        // if note display is showing, it removes the display and unhighlights the target elements (quote or ref)
        else{
          noteDisplay.addClass("hidden")
          $("#" + targetText).removeClass("highlight")
          $("span[data-corresp=" + targetText + "]").removeClass("highlight")
          $("#" + targetText).removeClass("highlightNone")
          $("span[data-corresp=" + targetText + "]").removeClass("highlightNone")
        }

        //adds footnote text to noteDisplay Div and toggles hidden class
        
        
        noteDisplay.html(text)
      });

      $(document).on("click", '.js-show-info', function(e) {
         e.preventDefault();
         const id = $(this).attr('data-pid')
         _this.props.setFocus(id)
         _this.props.openWindow("window1")
       });
       if (scrollTo){
        scrollToParagraph(scrollTo, true)
      }

      $(document).on("click", '.show-line-witness', function(e) {

        e.preventDefault();
        const surfaceid = $(this).attr('data-surfaceid');
        const ln = $(this).attr('data-ln');
        console.log("sid", surfaceid)


        const paragraphid = $(this).closest('.plaoulparagraph').attr("id");
        _this.props.setFocus(paragraphid)

        _this.props.handleSurfaceFocusChange("http://scta.info/resource/" + surfaceid)
        _this.props.handleLineFocusChange("http://scta.info/resource/" + surfaceid + "/" + ln)
        _this.props.openWindow("window2", "surface2")
      });

      $(document).on("click", '.js-show-reference-paragraph', function(e){
       e.preventDefault();
       const target = $(this).attr('data-url')
       const targetParagraph = $(this).attr('data-target-resource')
       const start = $(this).attr('data-start')
       const end = $(this).attr('data-end')

       // set the desired text preview focus to the target of the reference
       _this.props.handleTextPreviewFocusChange(target, start, end)
       //opening bottomw window 2 to textPreview
       _this.props.openWindow("window2", "textPreview")

   // NOTE: Order seems to make a difference here (at least in the production version)
   // calling this.props.setFocus before handleTextPreviewFocusChange and openWindow
   // was causing a reload that prevented desired functionality (but not on local version, only on production/deployed version)
   // TODO: investigate further, because even thought the re-arranged order seems to be working
   // the problem is likely to do with async timing (i.e. on job finish before another)
   //which could vary in different enviornments

       //setting paragraph focus for paragraph containing target footnote
       _this.props.setFocus(targetParagraph)
     })

//      $(document).on("mouseup", '.plaoulparagraph', function(e){
//         e.preventDefault();
//         console.log("firing")
//         if (!document.all) document.captureEvents(Event.MOUSEUP);
//         const t = (document.all) ? document.selection.createRange().text : document.getSelection();
//         let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
// width=600,height=300,left=100,top=100`;
//         if (t != ''){
//           window.open('https://logeion.uchicago.edu/' + t, 'dict', params)
//         }
//      })

      // function to ancestor paragraph of selection
      function getContainingP(node) {
        while (node) {
            if (node.nodeType == 1 && node.tagName.toLowerCase() == "p") {
              console.log("node", node)
                return node;
            }
            node = node.parentElement;
        }
      }
      function mark(e) {
        // hide tooltip
        _this.handleHide();
        //get selection object
        var sel = document.getSelection();
        var rng = sel && sel.getRangeAt(0);
        const pAncestor = getContainingP(rng.commonAncestorContainer)
        //if selection is in a text paragraph
        if (pAncestor && pAncestor.className.includes("plaoulparagraph")){
          var cnt = rng.cloneContents();
          $(cnt).children(".lbp-line-number, .paragraphnumber, br, .lbp-folionumber, .appnote, .footnote, .lbp-reg").remove();
          console.log(cnt)
          // if selection is greater than 0 
          if (cnt.textContent.length > 0){
            //get ancestor p text
            const pClone = $(pAncestor).clone()
            pClone.children(".lbp-line-number, .paragraphnumber, br, .lbp-folionumber, .appnote, .footnote, .lbp-reg").remove();
            const pText = _this.cleanText($(pClone).text())
            const selectionText = _this.cleanText(cnt.textContent)
            let precedingTextArray = pText.split(selectionText)[0].split(" "); 
            //slice to remove first item which is paragraph number; filter to remove blank items scattered throughout
            precedingTextArray = precedingTextArray.slice(1).filter(n=>n)
            const precedingTextLength = precedingTextArray.length
            const startToken = precedingTextLength + 1
            // filter to remove blank items in array
            const endToken = precedingTextLength + (selectionText.split(" ").filter(n=>n).length) 
            
            const oRect = rng.getBoundingClientRect();
            _this.handleOnClick(selectionText, oRect, startToken, endToken);
          }
        }
      }
      document.addEventListener('keyup', mark); // ctrl+keyup
      document.addEventListener('mouseup', mark);// ctrl+mouseup
    }

  componentDidUpdate(prevProps, prevState){

    //check to see if doc has changed
    if (prevProps.doc !== this.props.doc){
      // NOTE: ScrollToNew helps ensure that scrollTo id is SCTA ShortID, 
      //since TextWrapper is (at present) sometimes sending the shortid and sometimes the full url id
      // TODO: when TextWrapper is refactored and consistently sending the same ID type. this should be removed
      const scrollToNew = this.props.scrollTo && this.props.scrollTo.includes("/resource/") ? this.props.scrollTo.split("/resource/")[1] : this.props.scrollTo
      this.retrieveText(this.props.doc, this.props.topLevel, scrollToNew)
    }
    // if doc has already been appended, still scroll to target block
    else{
      if (this.props.scrollTo !== prevProps.scrollTo){
        // NOTE: ScrollToNew helps ensure that scrollTo id is SCTA ShortID, 
        //since TextWrapper is (at present) sometimes sending the shortid and sometimes the full url id
        // TODO: when TextWrapper is refactored and consistently sending the same ID type. this should be removed
        const scrollToNew = this.props.scrollTo && this.props.scrollTo.includes("/resource/") ? this.props.scrollTo.split("/resource/")[1] : this.props.scrollTo
        scrollToParagraph(scrollToNew, true)
      }
    }
  }
  handleHide(){
    ReactTooltip.hide(this.fooRef)
  }
  // function to remove spaces from selected html text
  cleanText(selectedText){
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
  handleOnClick(selectedText, oRect, startToken, endToken){
    this.setState(
      {
        selectionRect: oRect, 
        selectedText: selectedText,
        startToken: startToken, 
        endToken, endToken
      }
      )
    ReactTooltip.show(this.fooRef)
  }
  componentDidMount(){
    // NOTE: ScrollToNew helps ensure that scrollTo id is SCTA ShortID, 
    //since TextWrapper is (at present) sometimes sending the shortid and sometimes the full url id
    // TODO: when TextWrapper is refactored and consistently sending the same ID type. this should be removed
    const scrollToNew = this.props.scrollTo && this.props.scrollTo.includes("/resource/") ? this.props.scrollTo.split("/resource/")[1] : this.props.scrollTo
    this.retrieveText(this.props.doc, this.props.topLevel, scrollToNew)
  }
  
  render(){
    const displayText = this.state.fetching ? "none" : "block"

    return (
      <div>
        {
          this.state.fetching
          &&
          <div style={{position: "fixed", top: "50%", left: "50%"}}>
          <Spinner/>
          </div>
        }
        
        <p ref={ref => this.fooRef = ref} data-tip='tooltip' style={{position: "fixed", top: this.state.selectionRect.top + 10, left: this.state.selectionRect.left}}></p>
        <ReactTooltip clickable={true} place="top">
          <div style={{overflow: "scroll", "maxWidth": "300px"}}>
            {/* <p >Info</p> */}
            {(this.state.selectedText.split(" ").length === 1) && <p><iframe src={"https://logeion.uchicago.edu/" + this.state.selectedText }></iframe></p>}
            <p>
              Comment on: 
              <input type="text" placeholder="leave comment"></input>
              <br/>
              and/or edit:
              <input type="text" value={this.state.selectedText}></input>
              <br/>
              <i>{this.state.selectedText}</i> ({this.state.startToken}-{this.state.endToken})
            </p>
            
          </div>
        </ReactTooltip>
        <div id="text" style={{display: displayText}}></div>
      </div>

    );
  }
}

export default Text;
