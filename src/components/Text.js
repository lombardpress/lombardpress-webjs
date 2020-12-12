
import React from 'react';
import Spinner from './Spinner';
import $ from 'jquery';
import {convertXMLDoc, scrollToParagraph, loadHtmlResultDocFromExist, toRange, cleanText, getContainingP, getRangeWordCount, createRange, goToGitHubEdit} from './utils'
import ReactTooltip from 'react-tooltip';
import Nav from 'react-bootstrap/Nav';
import {FaComments, FaEdit, FaInfo, FaBook, FaSearch} from 'react-icons/fa';

class Text extends React.Component {
  constructor(props){
    super(props)
    this.retrieveText = this.retrieveText.bind(this)
    this.handleShowToolTip = this.handleShowToolTip.bind(this)
    this.handleHideToolTip = this.handleHideToolTip.bind(this)
    this.handleHideFootnoteToolTip = this.handleHideFootnoteToolTip.bind(this)
    this.handleShowFootnoteToolTip = this.handleShowFootnoteToolTip.bind(this)
    this.handleOnToolTipClick = this.handleOnToolTipClick.bind(this)
    this.state = {
      fetching: false,
      // state.selectionRange is puposevively different than props.selection Range
      // it governs selection state of component without yet changing focus selection State of the entire app
      selectionRange: "", 
      selectionCoords: "",
      dictionary: ""
    }
  }
  retrieveText(doc, topLevel, scrollTo, selectionRange){
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
        //uncomment "throw" to force use of local xslt
        //throw "test exception" 
        this.setState({fetching: false})
        //appendage to file
        //and event binding
        //happens inside promise call back
        document.getElementById("text").innerHTML = "";
        document.getElementById("text").innerHTML = data.data;
        // add event binding
        this.setEvents(_this, scrollTo, selectionRange)
      })
      .catch((e) => {
        // if eXist conversion fails, do conversion in browser
        const resultDocument = convertXMLDoc(xmlurl, xslurl)
        resultDocument.then((data) => {
          this.setState({fetching: false})
          document.getElementById("text").innerHTML = "";
          document.getElementById("text").appendChild(data)
          // add event binding
          this.setEvents(_this, scrollTo, selectionRange)
          }).catch((e) => {
            //if browswer conversion fails, log error message
            console.log("something went wrong", e)
            document.getElementById("text").innerHTML = "";
            document.getElementById("text").innerHTML = "<p>Apologies, the document is not able to be loaded at this time</p>";
          })
        })
      }
  }

  setEvents(_this, scrollTo, selectionRange){

    $('.paragraphnumber').click(function(e) {
      e.preventDefault();
      const id = $(this).parent("p").attr('id')
      _this.props.setFocus(id)
      _this.props.openWindow("window1")
    });
    if (scrollTo){
     scrollToParagraph(scrollTo, true)
   }
   if(selectionRange){
    _this.markWithElement(selectionRange)
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
        const footnoteOffset = this.getBoundingClientRect()
        _this.setState({footnoteText: text, footnoteOffset: footnoteOffset})
        _this.handleShowFootnoteToolTip()
        const targetText = $(this).parent().children(".note-display").attr('data-target-id')
        $(".highlight").removeClass("highlight")
        $("#" + targetText).addClass("highlight")
        $("span[data-corresp=" + targetText + "]").addClass("highlight")
          
      
      });

      $(document).on("click", '.js-show-info', function(e) {
         e.preventDefault();
         const id = $(this).attr('data-pid')
         _this.props.setFocus(id)
         _this.props.openWindow("window1")
       });
       // this seems like a repetition of line 88
       if (scrollTo){
        scrollToParagraph(scrollTo, true)
      }

      $(document).on("click", '.show-line-witness', function(e) {

        e.preventDefault();
        const surfaceid = $(this).attr('data-surfaceid');
        const ln = $(this).attr('data-ln');
        

        //const paragraphid = $(this).closest('.plaoulparagraph').attr("id");
        //_this.props.setFocus(paragraphid)

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



     
      function mark(e) {
        // hide tooltip
        _this.handleHideToolTip();
        //get selection object
        var sel = document.getSelection();
        // condition to test against invalid getRangeAt index
        if (window.getSelection().rangeCount >= 1){
          var rng = sel && sel.getRangeAt(0);
          const pAncestor = getContainingP(rng.commonAncestorContainer)
          //if selection is in a text paragraph
          //TODO: improve this so that selections within .appnote or .footnote get excluded
          if (pAncestor && pAncestor.className.includes("plaoulparagraph")){
            const selectedElementTargetId = pAncestor.id;
            var cnt = rng.cloneContents();
            $(cnt).find(".lbp-line-number, .paragraphnumber, br, .lbp-folionumber, .appnote, .footnote, .lbp-reg").remove();
            // if selection is greater than 0 
            if (cnt.textContent.length > 0){
              //get ancestor p text
              const pClone = $(pAncestor).clone()
              pClone.find(".lbp-line-number, .paragraphnumber, br, .lbp-folionumber, .appnote, .footnote, .lbp-reg").remove();
              
              
              const selectionText = cleanText(cnt.textContent)
              
              
              // Get preceding word token length in order to identify start word position of selected range.
                // NOTE: this replaces  
                //let precedingTextArray = pText.split(cleanText(selectionText))[0].split(" ").filter(n=>n); 
                // the above split approach was finding previous instances of the select word and giving false results.
              let startOffset;
              let startContainer;
              if (rng.startOffset === 0){
                startOffset = rng.startOffset;
                startContainer = rng.startContainer;
              }
              else{
                startOffset = rng.startOffset - 1;
                startContainer = rng.startContainer;

              }
              const precedingRange = createRange(pAncestor, pAncestor, 0, startContainer, startOffset)
              const precedingTextLength = getRangeWordCount(precedingRange);
              const startToken = precedingTextLength + 1
              const endToken = precedingTextLength + (selectionText.split(" ").filter(n=>n).length) 
              const wordRange = {start: startToken, end: endToken}
              
              const oRect = rng.getBoundingClientRect();
              const selectionRange = {
                text: selectionText,
                wordRange, 
                selectedElementTargetId, 
              }

              _this.handleShowToolTip(selectionRange, oRect);
            }
          }
        }
      }
      document.addEventListener('keyup', mark); // ctrl+keyup
      document.addEventListener('mouseup', mark);// ctrl+mouseup
    }
  /**
  * 
  * @param {object} selectionRange    
  */
  markWithElement(selectionRange){
    // remove existing mark elements
    this.markElementRemove()
    //only attempt to set mark if container can be found
    const container = document.getElementById(selectionRange.selectedElementTargetId);
    // NOTE: this conditional is a backup test, 
    //required properties should already be check in didUpdate method
    if (container && selectionRange.wordRange){
      const range = toRange(container, selectionRange.wordRange.start, selectionRange.wordRange.end)
      const cnt = range.extractContents();
      const node = document.createElement('mark');
      node.style.backgroundColor = "#BBCEBE";
      node.appendChild(cnt);
      range.insertNode(node);
      //get selection text from clone
      const clone = $(node).clone();
      $(clone).find(".lbp-line-number, .paragraphnumber, br, .lbp-folionumber, .appnote, .footnote, .lbp-reg").remove();
      selectionRange.text = cleanText($(clone).text());
      this.props.handleUpdateSelectionRange(selectionRange)
    }
  }
  /**
   * @description finds any exiting mark element and removes it
   */
  markElementRemove(){
    $('mark').contents().unwrap();
  }
  handleOnToolTipClick(windowLoad, window = "window1"){
    const selectionRange = this.state.selectionRange
    // send selectionRange up to App State
    this.markWithElement(selectionRange);
    const s = selectionRange;
    this.props.setFocus(s.selectedElementTargetId + "@" + s.wordRange.start + "-" + s.wordRange.end)
    // open display window
    this.props.openWindow(window, windowLoad)
  }
  handleHideToolTip(){
    ReactTooltip.hide(this.fooRef)
  }
  handleHideFootnoteToolTip(){
    ReactTooltip.hide(this.foonoteRef)
  }
  /**
   * @description show tool tip relative to selected text
   * @param {{
      text: string,
      wordRange: object, 
      selectedElementTargetId: string,
    }} selectionRange - object contain needed if about selectedRange
   * @param {object} - coords object resulting from from current selection
   */
  handleShowToolTip(selectionRange, selectionCoords){
    this.setState({selectionRange: selectionRange, selectionCoords: selectionCoords})
    ReactTooltip.show(this.fooRef)
  }
  handleShowFootnoteToolTip(){
    ReactTooltip.show(this.foonoteRef)
  }
  componentDidMount(){
    // NOTE: ScrollToNew helps ensure that scrollTo id is SCTA ShortID, 
    // since TextWrapper is (at present) sometimes sending the shortid and sometimes the full url id
    // TODO: when TextWrapper is refactored and consistently sending the same ID type. this should be removed
    const scrollToNew = this.props.scrollTo && this.props.scrollTo.includes("/resource/") ? this.props.scrollTo.split("/resource/")[1] : this.props.scrollTo
    this.retrieveText(this.props.doc, this.props.topLevel, scrollToNew, this.props.selectionRange)
  }

  componentDidUpdate(prevProps, prevState){

    //check to see if doc has changed
    if (prevProps.doc !== this.props.doc){
      // NOTE: ScrollToNew helps ensure that scrollTo id is SCTA ShortID, 
      // since TextWrapper is (at present) sometimes sending the shortid and sometimes the full url id
      // TODO: when TextWrapper is refactored and consistently sending the same ID type. this should be removed
      const scrollToNew = this.props.scrollTo && this.props.scrollTo.includes("/resource/") ? this.props.scrollTo.split("/resource/")[1] : this.props.scrollTo
      this.retrieveText(this.props.doc, this.props.topLevel, scrollToNew, this.props.selectionRange)
    }
    // if doc has already been appended, still scroll to target block
    else{
      if (this.props.scrollTo !== prevProps.scrollTo){
        // NOTE: ScrollToNew helps ensure that scrollTo id is SCTA ShortID, 
        // since TextWrapper is (at present) sometimes sending the shortid and sometimes the full url id
        // TODO: when TextWrapper is refactored and consistently sending the same ID type. this should be removed
        const scrollToNew = this.props.scrollTo && this.props.scrollTo.includes("/resource/") ? this.props.scrollTo.split("/resource/")[1] : this.props.scrollTo
        scrollToParagraph(scrollToNew, true)
        
        // set mark if object is present with required properties
        if (this.props.selectionRange.selectedElementTargetId && this.props.selectionRange.wordRange){
          this.markWithElement(this.props.selectionRange)
        }
        else{
          this.markElementRemove()
        }
      }
      // TODO/Note: this seems to be firing even when it seems like the prevProps.doc !== this.props.doc
      // perhaps props are not changing/updating at the same time. So the doc prop has already changed
      // then the range changes and tries to mark element, but the retrieve text asynch request has not finished 
      // and so the marking container element cannot be found. 
      // NOTE: error solved by preventing attempt to mark if container cannot be found. 
      // but it doesn't seem great that this is firing at undesired times.
      else if (this.props.selectionRange.wordRange !== prevProps.selectionRange.wordRange && this.props.selectionRange.selectedElementTargetId){
        this.markWithElement(this.props.selectionRange)
      }
      //final check if selection range required properties are removed then remove existing mark
      else if (!this.props.selectionRange.selectedElementTargetId && !this.props.selectionRange.wordRange) {
        this.markElementRemove()
      }
    }
    
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
        
        {this.state.selectionRange && <p ref={ref => this.fooRef = ref} data-tip='tooltip' data-for="selection" style={{position: "fixed", top: this.state.selectionCoords.top + 10, left: this.state.selectionCoords.left}}></p>}
        {this.state.footnoteText && <p ref={ref => this.foonoteRef = ref} data-tip='tooltip' data-for="footnote" style={{position: "fixed", top: this.state.footnoteOffset.top + 10, left: this.state.footnoteOffset.left}}></p>}
        <ReactTooltip clickable={true} place="top" id="selection">
            {this.state.selectionRange &&
            <Nav>
              <Nav.Link title={this.state.selectionRange.wordRange.start + "-" +this.state.selectionRange.wordRange.end} onClick={() => {this.handleOnToolTipClick("citation")}}><FaInfo/></Nav.Link>
              <Nav.Link onClick={() => {this.handleOnToolTipClick("comments")}}><FaComments/></Nav.Link>
              {(this.state.selectionRange.text && this.state.selectionRange.text.split(" ").length === 1) && 
              <Nav.Link onClick={() => {goToGitHubEdit(this.props.doc, this.state.selectionRange.text, this.state.selectionRange.selectedElementTargetId)}}><FaEdit/></Nav.Link>
              }
              <Nav.Link onClick={() => {this.handleOnToolTipClick("search")}}><FaSearch/></Nav.Link>
              {(this.state.selectionRange.text && this.state.selectionRange.text.split(" ").length === 1) && 
              <Nav.Link title="look up word" onClick={()=>this.handleOnToolTipClick("dictionary", "window2")}><FaBook/></Nav.Link>
              }
              
            </Nav>
            }
        </ReactTooltip>
        <ReactTooltip id="footnote" clickable={true} place="top">
        
          <p dangerouslySetInnerHTML={{ __html: this.state.footnoteText}}></p>
        </ReactTooltip>
        <div id="text" style={{display: displayText}}></div>
      </div>

    );
  }
}

export default Text;
