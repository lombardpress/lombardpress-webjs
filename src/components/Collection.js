import React from 'react';
import Qs from "query-string"
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Table from 'react-bootstrap/Table';

import {loadXMLDoc, convertXMLDoc, runQuery, scrollToParagraph} from './utils'
import {getRelatedExpressions, basicInfoQuery, basicStructureItemInfoQuery, basicStructureAllItemsInfoQuery, getStructureType, partsInfoQuery,workGroupExpressionQuery} from './Queries'
import {Link} from 'react-router-dom';

import $ from 'jquery';

import Window from "./Window"

import TextNavBar from "./TextNavBar"
import Item from "./Item"

//import Lbp from "lbp.js/lib"


class Collection extends React.Component {
  constructor(props){
    super(props)
    //this.handleClose = this.handleClose.bind(this)
    //this.handleBlockFocusChange = this.handleBlockFocusChange.bind(this)
    //this.handleSurfaceFocusChange = this.handleSurfaceFocusChange.bind(this)
    //this.handleTabChange = this.handleTabChange.bind(this)
    //this.handleSwitchWindow = this.handleSwitchWindow.bind(this)
    //this.retrieveText = this.retrieveText.bind(this)
    this.retrieveCollectionInfo = this.retrieveCollectionInfo.bind(this)
    this.makeRequests = this.makeRequests.bind(this)
    this.handleItemFilter = this.handleItemFilter.bind(this)
    this.handlePartsFilter = this.handlePartsFilter.bind(this)
    this.itemFilter = React.createRef();
    this.partsFilter = React.createRef();
    this.mount = false
    this.state = {
      items: {},
      parts: {},
      itemFilter: "",
      partsFilter: "",
      surfaceFocus: ""
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

  handleSurfaceFocusChange(surfaceid){
    this.setState({surfaceFocus: surfaceid})
  }
  arrangeParts(partsPromise){
    const _this = this
    partsPromise.then((d) => {
        const bindings = d.data.results.bindings
        let partsObject = {}
        bindings.forEach((b) => {
          const pId = b.part.value
          partsObject[pId] = {
            id: b.part.value,
            title: b.partTitle.value,
            type: b.partType.value,
            questionTitle: b.partQuestionTitle ? b.partQuestionTitle.value : null,
            level: b.partLevel ? b.partLevel.value : "unknown",
        }
      });
      if (this.mount){
        _this.setState(
          {
            parts: partsObject
          }
        )
      }
    });
  }
  arrangeItems(itemsPromise){
    const _this = this
    itemsPromise.then((d) => {
      const bindings = d.data.results.bindings
      let itemsObject = {}
      bindings.forEach((b) => {
        const itemId = b.item.value
        itemsObject[itemId] = {
          title: b.itemTitle.value,
          id: b.item.value,
          type: b.itemType.value,
          questionTitle: b.itemQuestionTitle ? b.itemQuestionTitle.value : null,
          author: b.itemAuthor ? b.itemAuthor.value : null,
          authorTitle: b.itemAuthorTitle ? b.itemAuthorTitle.value : null,
          next: b.next ? b.next.value : null,
          previous: b.previous ? b.previous.value : null,
          cm: b.cm ? b.cm.value : null,
          cmTitle: b.cmTitle ? b.cmTitle.value : null,
          ct: b.ct ? b.ct.value : null,
          topLevel: b.topLevel ? b.topLevel.value : null,
          doc: b.doc ? b.doc.value : null
        }
      });
      if (this.mount){
        _this.setState(
          {
            items: itemsObject
          }
        )
      }
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
  makeRequests(newResourceId, structureType, topLevel, type){

    //
    //   // get all expressions for this workGroup
      if (type === "http://scta.info/resource/workGroup"){
          this.retrieveWorkGroupInfo(newResourceId, structureType, topLevel)
          //this.setState({itemFocus: ""})
      }
      // get all items for this collection
      else if (structureType === "http://scta.info/resource/structureCollection"){
          this.retrieveCollectionInfo(newResourceId, structureType, topLevel)
          //this.setState({itemFocus: ""})
      }

  }
  componentDidUpdate(prevProps, prevState){

  }
  componentDidMount(){
    this.mount = true
    const _this = this;
    this.setState({resourceid: this.props.resourceid})
    this.makeRequests(this.props.resourceid, this.props.structureType, this.props.topLevel, this.props.type)

  }

  componentWillReceiveProps(nextProps) {

    this.refs.itemFilter ? this.refs.itemFilter.value = "" :
    this.refs.partsFilter ? this.refs.partsFilter.value = "" :

    this.setState({resourceid: nextProps.resourceid, itemFilter: "", partsFilter: "", blockFocus: ""})
    this.makeRequests(nextProps.resourceid, nextProps.structureType, nextProps.topLevel, nextProps.type)
  }
  componentWillUnmount(){
    this.mount = false
  }
  render(){
    //const resourceid = Qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).resourceid;

    const displayQuestions = () => {
      const questions = []
      Object.keys(this.state.items).forEach((key) => {
        const filterCheck = this.state.items[key].title + " " + this.state.items[key].authorTitle
        if (filterCheck.toLowerCase().includes(this.state.itemFilter.toLowerCase())){
        questions.push(
          <Item item={this.state.items[key]}/>
        )}
      });
      return (
        <Container>

        <h1>Items</h1>
        <FormControl ref={this.itemFilter} id="item-filter" placeholder="type to filter" onChange={this.handleItemFilter}/>
        <br/>
        <Table striped bordered hover size="sm">
        <tbody>
        {questions}
        </tbody>
        </Table>
        </Container>
      )
    }
    const displayParts = () => {
        const questions = []
        Object.keys(this.state.parts).forEach((key) => {
          //check against filter
            if (this.state.parts[key].title.toLowerCase().includes(this.state.partsFilter.toLowerCase())){
            questions.push(
              <Item item={this.state.parts[key]}/>
              )
            }

        });
        //check against top level expression as parts; if parts are top level expression; don't display parts
        const testPart = this.state.parts[Object.keys(this.state.parts)[0]]
        if (testPart){
          if (!(testPart.type === "http://scta.info/resource/expression" && testPart.level === "1")){
            return (
              <Container>
              <h1>Parts</h1>
              <FormControl ref={this.partsFilter} id="parts-filter" placeholder="type to filter" onChange={this.handlePartsFilter}/>
              <br/>
              <Table striped bordered hover size="sm">
              <tbody>
              {questions}
              </tbody>
              </Table>
              </Container>
            )
          }
        }
      }

    return (
      <div>{displayParts()}{displayQuestions()}</div>
    );
  }
}

export default Collection;
