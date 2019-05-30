import React from 'react';
import Qs from "query-string"
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import {loadXMLDoc, convertXMLDoc, runQuery} from './utils'
import {basicStructureItemInfoQuery, basicStructureAllItemsInfoQuery, getStructureType, partsInfoQuery,workGroupExpressionQuery} from './Queries'
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
    this.retrieveCollectionInfo = this.retrieveCollectionInfo.bind(this)
    this.makeRequests = this.makeRequests.bind(this)
    this.handleItemFilter = this.handleItemFilter.bind(this)
    this.handlePartsFilter = this.handlePartsFilter.bind(this)
    this.state = {
      blockFocus: null,
      itemFocus: "",
      resourceid: "",
      items: {},
      parts: {},
      itemFilter: "",
      partsFilter: ""
    }
  }
  handleItemFilter(e){
    const item = e.target.value
    this.setState({itemFilter: item})

  }
  handlePartsFilter(e){
    const part = e.target.value
    this.setState({partsFilter: part})
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

  arrangeParts(partsPromise){
    const _this = this
    partsPromise.then((d) => {
      console.log('d', d)
        const bindings = d.data.results.bindings
        let partsObject = {}
        bindings.forEach((b) => {
          const pId = b.part.value
          partsObject[pId] = {
            partTitle: b.partTitle.value,
            partType: b.partType.value,
            partQuestionTitle: b.partQuestionTitle ? b.partQuestionTitle.value : null,
            partLevel: b.partLevel ? b.partLevel.value : "unknown",
        }
      });
      _this.setState(
        {
          parts: partsObject
        }
      )
    });
  }
  arrangeItems(itemsPromise){
    const _this = this
    itemsPromise.then((d) => {
      console.log("d", d)
      const bindings = d.data.results.bindings
      let itemsObject = {}
      bindings.forEach((b) => {
        const itemId = b.item.value
        itemsObject[itemId] = {
          title: b.itemTitle.value,
          item: b.item.value,
          itemQuestionTitle: b.itemQuestionTitle ? b.itemQuestionTitle.value : null,
          itemAuthor: b.itemAuthor ? b.itemAuthor.value : null,
          itemAuthorTitle: b.itemAuthorTitle ? b.itemAuthorTitle.value : null,
          next: b.next ? b.next.value : null,
          previous: b.previous ? b.previous.value : null,
          cm: b.cm ? b.cm.value : null,
          cmTitle: b.cmTitle ? b.cmTitle.value : null,
          ct: b.ct ? b.ct.value : null,
          topLevel: b.topLevel ? b.topLevel.value : null
        }
      });
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
  retrieveWorkGroupInfo(resourceid){
    const _this = this;
    const expressionsInfo = runQuery(workGroupExpressionQuery(resourceid))
    const partsInfo = runQuery(partsInfoQuery(resourceid))
    this.arrangeParts(partsInfo)
    this.arrangeItems(expressionsInfo)
  }
  retrieveCollectionInfo(resourceid, structureType, topLevel){
    const _this = this;


    const collectionInfo = runQuery(basicStructureAllItemsInfoQuery(topLevel))
    const partsInfo = runQuery(partsInfoQuery(resourceid))
    //add parts to state
    this.arrangeParts(partsInfo)
    /// add items to state
    this.arrangeItems(collectionInfo)


  }
  makeRequests(newResourceId){
    const structureTypePromise = runQuery(getStructureType(newResourceId))
    structureTypePromise.then((t) => {
      console.log("t", t)
      const type = t.data.results.bindings[0].type.value
      const structureType = t.data.results.bindings[0].structureType ? t.data.results.bindings[0].structureType.value : null
      const level = t.data.results.bindings[0].level ? t.data.results.bindings[0].level.value : null
      const topLevel = t.data.results.bindings[0].topLevel ? t.data.results.bindings[0].topLevel.value : newResourceId

      // get all expressions for this workGroup
      if (type === "http://scta.info/resource/workGroup"){
          this.retrieveWorkGroupInfo(newResourceId, structureType, topLevel)
          this.setState({itemFocus: ""})
      }
      // get all items for this collection
      else if (structureType === "http://scta.info/resource/structureCollection"){
          this.retrieveCollectionInfo(newResourceId, structureType, topLevel)
          this.setState({itemFocus: ""})
      }
      else if (structureType === "http://scta.info/resource/structureItem" ){
        // if structureType is item but state.items is empty
        // re-initate top level items request
        if (!this.state.items[newResourceId]){
          //this.retrieveInfo(newResourceId)
          this.retrieveCollectionInfo(newResourceId, structureType, topLevel)

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
    this.refs.itemFilter.value = ""
    this.refs.partsFilter.value = ""
    this.setState({resourceid: newResourceId, itemFilter: "", partsFilter: ""})
    console.log("refs", this.refs)

    this.makeRequests(newResourceId)
  }
  render(){
    const resourceid = Qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).resourceid;
    const displayText = () => {
      return(
        <div>
          <Container className={this.state.blockFocus ? "lbp-text skinnyText" : "lbp-text fullText"} id="text">
          </Container>
          <TextNavBar next={this.state.items[this.state.itemFocus] && this.state.items[this.state.itemFocus].next} previous={this.state.items[this.state.itemFocus] && this.state.items[this.state.itemFocus].previous} topLevel={this.state.items[this.state.itemFocus] && this.state.items[this.state.itemFocus].topLevel}/>
          {this.state.focus && <SideWindow key={"side" + this.state.blockFocus} handleClose={this.handleClose} resourceid={this.state.blockFocus} />}
          {this.state.focus && <BottomWindow key={"bottom" + this.state.blockFocus} handleClose={this.handleClose} resourceid={this.state.blockFocus}/>}
        </div>
      )
    }
    const displayQuestions = () => {
      const questions = []
      Object.keys(this.state.items).forEach((key) => {
        const filterCheck = this.state.items[key].title + " " + this.state.items[key].itemAuthorTitle
        if (filterCheck.toLowerCase().includes(this.state.itemFilter)){
        questions.push(
          <p>{this.state.items[key].itemAuthor && <Link to={"/text?resourceid=" + this.state.items[key].itemAuthor}>{this.state.items[key].itemAuthorTitle}</Link>} | <Link to={"/text?resourceid=" + this.state.items[key].item}>{this.state.items[key].title}: {this.state.items[key].itemQuestionTitle}</Link></p>
        )}
      });
      return (
        <div>
        <h1>Items</h1>
        <FormControl ref="itemFilter" id="item-filter" onChange={this.handleItemFilter}/>
        {questions}
        </div>
      )
    }
    const displayParts = () => {
        const questions = []
        Object.keys(this.state.parts).forEach((key) => {

          //check against top level expression as parts; if parts are top level expression; don't display parts
          if (!(this.state.parts[key].partType === "http://scta.info/resource/expression" && this.state.parts[key].partLevel === "1")){
            //check against filter
            if (this.state.parts[key].partTitle.includes(this.state.partsFilter)){
            questions.push(
              <p><Link to={"/text?resourceid=" + key}>{this.state.parts[key].partTitle}: {this.state.parts[key].partQuestionTitle}</Link></p>
              )
            }
          }
        });
        if (questions.length > 0){
          return (
            <div>
            <h1>Parts</h1>
            <FormControl id="parts-filter" onChange={this.handlePartsFilter}/>
            {questions};
            </div>
          )
        }
      }

    return (
      this.state.itemFocus ? displayText() : <div>{displayParts()}{displayQuestions()}</div>
    );
  }
}

export default Text;
