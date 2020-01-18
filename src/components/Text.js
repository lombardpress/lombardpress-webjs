import React from 'react';

import $ from 'jquery';

import {convertXMLDoc, scrollToParagraph} from './utils'

class Text extends React.Component {
  constructor(props){
    super(props)
    this.retrieveText = this.retrieveText.bind(this)


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

      //conversion done in promise in utils.js file
      const resultDocument = convertXMLDoc(xmlurl, xslurl)
      resultDocument.then((data) => {
        //appendage to file
        //and event binding
        //happens inside promise call back
        document.getElementById("text").innerHTML = "";
        document.getElementById("text").appendChild(data);

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
             const link = $(this).parent().children('.appnote, .footnote')
             const target = $(link).attr('href')
             const text = $(target).html()
             const targetText = $(this).parent().children(".note-display").attr('data-target-id')
             /// toggles highlight for select text segemnts
             if (targetText){
               $("#" + targetText).toggleClass("highlight")
               $("span[data-corresp=" + targetText + "]").toggleClass("highlight")
             }

             //adds footnote text to noteDisplay Div and toggles hidden class
             const noteDisplay = $(this).parent().children(".note-display")
             noteDisplay.toggleClass("hidden")
             noteDisplay.html(text)
           });

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
            const targetParagraph = $(this).attr('data-target-paragraph')

            // set the desired text preview focus to the target of the reference
            _this.props.handleTextPreviewFocusChange(target)
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
        })
        .catch((e) => {
          console.log("something went wrong", e)
          document.getElementById("text").innerHTML = "";
          document.getElementById("text").innerHTML = "<p>Apologies, the document is not able to be loaded at this time</p>";
        })
      }
  }

  componentDidUpdate(prevProps, prevState){

    //check to see if doc has changed
    if (prevProps.doc !== this.props.doc){
      this.retrieveText(this.props.doc, this.props.topLevel, this.props.scrollTo)
    }
    // if doc has already been appended, still scroll to target block
    else{
      if (this.props.scrollTo !== prevProps.scrollTo){
        scrollToParagraph(this.props.scrollTo, true)
      }
    }


    //this.retrieveText(this.props.doc, this.props.topLevel, this.props.scrollTo)
  }

  componentDidMount(){
    this.retrieveText(this.props.doc, this.props.topLevel, this.props.scrollTo)
  }
  UNSAFE_componentWillReceiveProps(newProps){

  }
  render(){

    return (
      <div>
        <div id="text"></div>
      </div>
    );
  }
}

export default Text;
