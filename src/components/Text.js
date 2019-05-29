import React from 'react';
import Qs from "query-string"
import Container from 'react-bootstrap/Container';
import {loadXMLDoc, convertXMLDoc, runQuery} from './utils'
import {basicStructureItemInfoQuery, basicStructureAllItemsInfoQuery, getStructureType, basicStructureAllItemsInfoFromItemIdQuery} from './Queries'
import Axios from 'axios'
import {Link} from 'react-router-dom';

import $ from 'jquery';

import SideWindow from "./SideWindow"
import BottomWindow from "./BottomWindow"
import TextNavBar from "./TextNavBar"

//import Lbp from "lbp.js/lib"


class Text extends React.Component {
  constructor(props){
    super(props)
    this.handleClose = this.handleClose.bind(this)
    this.retrieveText = this.retrieveText.bind(this)
    // this.retrieveInfo = this.retrieveInfo.bind(this)
    this.retrieveCollectionInfo = this.retrieveCollectionInfo.bind(this)
    this.makeRequests = this.makeRequests.bind(this)
    this.state = {
      blockFocus: null,
      itemFocus: "",
      resourceid: "",
      items: {}
    }
  }
  handleOnClick(){

  }
  handleClose(){
    this.setState({blockFocus: ""})
  }
  retrieveText(){
    const _this = this;
    if (this.state.items[this.state.itemFocus]){
      const ct = this.state.items[this.state.itemFocus].ct;
      console.log(ct)
      const urlFragment = ct.split("/resource/")[1]
      console.log(urlFragment)
      const xmlurl = "http://exist.scta.info/exist/apps/scta-app/document/" + urlFragment
      const xslurl = "http://localhost:3000/xslt/main_view.xsl"
      const resultDocument = convertXMLDoc(xmlurl, xslurl)
      // append resultDoc to div in DOM
      document.getElementById("text").innerHTML = "";
      document.getElementById("text").appendChild(resultDocument);
    }

    // bind events to dom
    $('.para_wrap').click(function() {
      const id = $(this).attr('id').split("pwrap_")[1]

      _this.setState({blockFocus: id})

    });
  }
  // retrieveInfo(resourceid){
  //   const _this = this;
  //   const itemInfo = runQuery(basicStructureItemInfoQuery(resourceid))
  //   itemInfo.then((d) => {
  //
  //     const bindings = d.data.results.bindings
  //     _this.setState(
  //       {
  //         next: bindings[0].next ? bindings[0].next.value : null,
  //         previous: bindings[0].previous ? bindings[0].previous.value : null,
  //       }
  //     )
  //   }).
  //   catch((err) => {
  //     console.log(err)
  //   });
  // }
  retrieveCollectionInfo(resourceid, structureType){
    const _this = this;
    let collectionInfo = []
    if (structureType === "structureCollection"){
      collectionInfo = runQuery(basicStructureAllItemsInfoQuery(resourceid))
    }
    else if (structureType === "structureItem"){
      collectionInfo = runQuery(basicStructureAllItemsInfoFromItemIdQuery(resourceid))
    }

    collectionInfo.then((d) => {
      console.log("ci", d)
      const bindings = d.data.results.bindings
      console.log(bindings)
      let itemsObject = {}
      bindings.forEach((b) => {
        const itemId = b.item.value
        itemsObject[itemId] = {
          title: b.itemTitle.value,
          item: b.item.value,
          itemQuestionTitle: b.itemQuestionTitle ? b.itemQuestionTitle.value : null,
          next: b.next ? b.next.value : null,
          previous: b.previous ? b.previous.value : null,
          cm: b.cm.value,
          cmTitle: b.cmTitle.value,
          ct: b.ct.value,
          topLevel: b.topLevel.value
        }
      });
      console.log("itemsObject", itemsObject)
      _this.setState(
        {
          items: itemsObject
        }
      )
    }).
    catch((err) => {
      console.log(err)
    })

  }
  makeRequests(newResourceId){
    const structureTypePromise = runQuery(getStructureType(newResourceId))
    structureTypePromise.then((t) => {
      const structureType = t.data.results.bindings[0].structureType.value

      // get all items for this collection
      if (structureType === "http://scta.info/resource/structureCollection"){
          this.retrieveCollectionInfo(newResourceId, "structureCollection")
          this.setState({itemFocus: ""})
      }
      else if (structureType === "http://scta.info/resource/structureItem" ){
        // if structureType is item but state.items is empty
        // re-initate top level items request
        if (!this.state.items[newResourceId]){
          //this.retrieveInfo(newResourceId)
          this.retrieveCollectionInfo(newResourceId, "structureItem")

        }
        this.setState({itemFocus: newResourceId})




      }
    });
  }
  componentDidUpdate(){
    // TODO: might want to restrict this update to only when the itemFocus changes;
    // text doesn't need to be retrieved on other updates.
    this.retrieveText()

  }
  componentDidMount(){
    const _this = this;
    const newResourceId = Qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).resourceid
    this.setState({resourceid: newResourceId})
    this.makeRequests(newResourceId)
  }

  componentWillReceiveProps(nextProps) {
    const newResourceId = Qs.parse(nextProps.location.search, { ignoreQueryPrefix: true }).resourceid
    this.setState({resourceid: newResourceId})
    this.makeRequests(newResourceId)
  }
  render(){
    const resourceid = Qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).resourceid;
    const displayText = () => {
      return(
        <div>
          <Container className={this.state.blockFocus ? "lbp-text skinnyText" : "lbp-text fullText"} id="text">
          </Container>
          <TextNavBar next={this.state.items[this.state.itemFocus] && this.state.items[this.state.itemFocus].next} previous={this.state.items[this.state.itemFocus] && this.state.items[this.state.itemFocus].previous} topLevel={this.state.items[this.state.itemFocus].topLevel}/>
          {this.state.focus && <SideWindow key={"side" + this.state.blockFocus} handleClose={this.handleClose} resourceid={this.state.blockFocus} />}
          {this.state.focus && <BottomWindow key={"bottom" + this.state.blockFocus} handleClose={this.handleClose} resourceid={this.state.blockFocus}/>}
        </div>
      )
    }
    const displayQuestions = () => {
      const questions = []
      Object.keys(this.state.items).forEach((key) => {
        questions.push(
          <p><Link to={"/text?resourceid=" + this.state.items[key].item}>{this.state.items[key].title}: {this.state.items[key].itemQuestionTitle}</Link></p>
        )
      });
      return questions;
    }
    return (
      this.state.itemFocus ? displayText() : displayQuestions()
    );
  }
}

export default Text;
