import React from 'react';
import Qs from "query-string"
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Table from 'react-bootstrap/Table';

import {loadXMLDoc, convertXMLDoc, runQuery, scrollToParagraph} from './utils'
import {basicInfoQuery, basicStructureItemInfoQuery, basicStructureAllItemsInfoQuery, getStructureType, partsInfoQuery,workGroupExpressionQuery} from './Queries'
import {Link} from 'react-router-dom';

import $ from 'jquery';

import Window from "./Window"

import TextNavBar from "./TextNavBar"
import Item from "./Item"

//import Lbp from "lbp.js/lib"


class Text extends React.Component {
  constructor(props){
    super(props)
    this.handleClose = this.handleClose.bind(this)
    this.handleBlockFocusChange = this.handleBlockFocusChange.bind(this)
    this.handleSurfaceFocusChange = this.handleSurfaceFocusChange.bind(this)
    this.handleTabChange = this.handleTabChange.bind(this)
    this.handleSwitchWindow = this.handleSwitchWindow.bind(this)
    this.retrieveText = this.retrieveText.bind(this)
    this.retrieveCollectionInfo = this.retrieveCollectionInfo.bind(this)
    this.makeRequests = this.makeRequests.bind(this)
    this.handleItemFilter = this.handleItemFilter.bind(this)
    this.handlePartsFilter = this.handlePartsFilter.bind(this)
    this.itemFilter = React.createRef();
    this.partsFilter = React.createRef();
    this.state = {
      blockFocus: null,
      itemFocus: "",
      resourceid: "",
      items: {},
      info: {},
      parts: {},
      itemFilter: "",
      partsFilter: "",
      surfaceFocus: "",
      windows: {
        window1: {
          windowId: "window1",
          open: false,
          windowLoad: "info",
          position: "sideWindow"
        },
        window2: {
          windowId: "window2",
          open: false,
          windowLoad: "info",
          position: "bottomWindow"
        }
      }
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
  handleClose(windowId){
    this.setState((prevState) => {
      const windows = prevState.windows
      windows[windowId].open = !windows[windowId].open
      return {windows: windows}

    })
    //scroll is supposed to re-align text scroll to focused paragraph after side bar close.
    //but it is not quite working
    scrollToParagraph(this.state.blockFocus, true)

  }
  handleSwitchWindow(windowId, windowType){
    this.setState((prevState) => {
      const windows = prevState.windows
      if (windows[windowId].position === "sideWindow"){
        windows[windowId].position = "bottomWindow"
        // these conditionals control whether an already existing window will be closed when the other is moved
        // while commented they allow window1 and window2 to stack on top of each other

        // if (windowId === "window1"){
        //   windows["window2"].open = false
        // }
        // else if ((windowId === "window2")){
        //   windows["window1"].open = false
        // }
      }
      else if (windows[windowId].position === "bottomWindow"){
        windows[windowId].position = "sideWindow"
        // these conditionals control whether an already existing window will be closed when the other is moved
        // while commented they allow window1 and window2 to stack on top of each other

        // if (windowId === "window1"){
        //   windows["window2"].open = false
        // }
        // else if ((windowId === "window2")){
        //   windows["window1"].open = false
        // }
      }
      return {windows: windows}

    })
  }
  handleTabChange(windowLoad, windowId){

    this.setState((prevState) => {
      const windows = prevState.windows
      windows[windowId].windowLoad = windowLoad
      return {windows: windows}

    })

  }
  //changes block focus; todo/note: could also work for structureDivions
  handleBlockFocusChange(resourceid){
    // check to make sure we're using shortId
    const id = resourceid.includes("http") ? resourceid.split("/resource/")[1] : resourceid
    this.setState({blockFocus: id})

    // set block info to state.info
    const fullid = "http://scta.info/resource/" + id
    const info = runQuery(basicInfoQuery(fullid))
    this.arrangeTextInfo(info, fullid)

    scrollToParagraph(id, true)
  }




  handleSurfaceFocusChange(surfaceid){
    this.setState({surfaceFocus: surfaceid})
  }

  retrieveText(){
    const _this = this;
    if (this.state.items[this.state.itemFocus]){

      //construct file url request ot exist db to get a cors enabled copy of the text (github does not serve files with cors enabled)
      const doc = this.state.items[this.state.itemFocus].doc;
      const topLevel = this.state.items[this.state.itemFocus].topLevel;
      const docFragment = doc.split("/master/")[1]
      const topLevelFragment = topLevel.split("/resource/")[1]

      const xmlurl = "http://exist.scta.info/exist/apps/scta-app/text/" + topLevelFragment + "/" + docFragment;
      const xslurl = "http://localhost:3000/xslt/main_view.xsl"
      const resultDocument = convertXMLDoc(xmlurl, xslurl)
      // append resultDoc to div in DOM
      document.getElementById("text").innerHTML = "";
      document.getElementById("text").appendChild(resultDocument);
      if (this.state.blockFocus){
        scrollToParagraph(this.state.blockFocus, true)
      }
    }

    // bind events to dom
    // only seems to be working when they are here; not yet sure why

    $('.lbp-paragraphmenu').click(function(e) {
      e.preventDefault();
      const id = $(this).attr('data-id')

      //_this.setState({blockFocus: id})
      _this.setState((prevState) => {
        const windows = prevState.windows
        windows.window1.open = true
        return {
          windows: windows,
          blockFocus: id
        }

      })
      // set block info to state.info
      const fullid = "http://scta.info/resource/" + id
      const info = runQuery(basicInfoQuery(fullid))
      _this.arrangeTextInfo(info, fullid)
      // scroll to paragraph
      scrollToParagraph(id, true)

    });
    $('.js-show-folio-image').click(function(e) {
      e.preventDefault();
      const id = $(this).attr('data-surfaceid')
      //_this.setState({surfaceFocus: "http://scta.info/resource/" + id})
      _this.setState((prevState) => {
        const windows = prevState.windows
        windows.window2.open = true
        windows.window2.windowLoad = "surface2"
        return {
          windows: windows,
          surfaceFocus: "http://scta.info/resource/" + id
        }

      })
    });
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
  arrangeTextInfo(info, resourceid){
      info.then((d) => {
        console.log("d", d)
        const bindings = d.data.results.bindings[0]
        console.log("bindings", bindings)

        const manifestations = d.data.results.bindings.map((b) => {
          console.log(b)
          return {
            manifestation: b.manifestation.value,
            manifestationTitle: b.manifestationTitle.value,
            transcription: b.manifestationCTranscription.value
          }
        })

        this.setState({
          info: {
            resourceid: resourceid,
            title: bindings.title.value,
            structureType: bindings.structureType.value,
            inbox: bindings.inbox.value,
            next: bindings.next ? bindings.next.value : "",
            previous: bindings.previous ? bindings.previous.value : "",
            cdoc: bindings.cdoc.value,
            cxml: bindings.cxml.value,
            topLevel: bindings.topLevelExpression.value,
            cmanifestation: bindings.cmanifestation.value,
            ctranscription: bindings.ctranscription.value,
            manifestations: manifestations
          }
        });
      });
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
    // add info to state for structure items, divisions, and blocks
    if (structureType != "http://scta.info/resource/structureCollection"){
      const id = resourceid.includes("http") ? resourceid : "http://scta.info/resource/" + resourceid
      const info = runQuery(basicInfoQuery(id))
      this.arrangeTextInfo(info, id)
    }


  }
  makeRequests(newResourceId){
    const structureTypePromise = runQuery(getStructureType(newResourceId))
    structureTypePromise.then((t) => {
      const type = t.data.results.bindings[0].type.value
      const structureType = t.data.results.bindings[0].structureType ? t.data.results.bindings[0].structureType.value : null
      const level = t.data.results.bindings[0].level ? t.data.results.bindings[0].level.value : null
      const topLevel = t.data.results.bindings[0].topLevel ? t.data.results.bindings[0].topLevel.value : newResourceId
      const itemParent = t.data.results.bindings[0].itemParent ? t.data.results.bindings[0].itemParent.value : null

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
      else if (structureType === "http://scta.info/resource/structureBlock" || structureType === "http://scta.info/resource/structureDivision" ){
        // if structureType is item but state.items is empty
        // re-initate top level items request
        console.log("item parent", itemParent)
        if (!this.state.items[itemParent]){
          //this.retrieveInfo(newResourceId)
          this.retrieveCollectionInfo(itemParent, structureType, topLevel)

        }
        this.setState({itemFocus: itemParent, blockFocus: newResourceId.split("/resource/")[1]})

      }
    });
  }
  componentDidUpdate(prevProps, prevState){
    // this is necessary because item transcription is getting recieved from "items query"
    // and if it is no yet there, it can't find the document/file url
    // so we not only have to check if the itemid changes, but also when the "items array update"
    if ((prevState.items != this.state.items) || (prevState.itemFocus != this.state.itemFocus)){
      this.retrieveText()
    }

  }
  componentDidMount(){
    const _this = this;
    const newResourceId = Qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).resourceid
    this.setState({resourceid: newResourceId})
    this.makeRequests(newResourceId)

  }

  componentWillReceiveProps(nextProps) {
    const newResourceId = Qs.parse(nextProps.location.search, { ignoreQueryPrefix: true }).resourceid
    this.refs.itemFilter ? this.refs.itemFilter.value = "" :
    this.refs.partsFilter ? this.refs.partsFilter.value = "" :

    this.setState({resourceid: newResourceId, itemFilter: "", partsFilter: "", blockFocus: ""})
    this.makeRequests(newResourceId)
  }
  render(){
    const resourceid = Qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).resourceid;
    const displayText = () => {
      let aSideWindowOpen = false;
      if (this.state.windows.window1.open && this.state.windows.window1.position === "sideWindow"){
        aSideWindowOpen = true
      }
      else if (this.state.windows.window2.open && this.state.windows.window2.position === "sideWindow"){
        aSideWindowOpen = true
      }

      return(
        <div>
          <Container className={aSideWindowOpen ? "lbp-text skinnyText" : "lbp-text fullText"}>
          <div id="text"></div>
          </Container>
          <TextNavBar
          next={this.state.items[this.state.itemFocus] && this.state.items[this.state.itemFocus].next}
          previous={this.state.items[this.state.itemFocus] && this.state.items[this.state.itemFocus].previous}
          topLevel={this.state.items[this.state.itemFocus] && this.state.items[this.state.itemFocus].topLevel}
          handleClose={this.handleClose}
          />
          {this.state.windows.window1.open &&
            <Window windowLoad={this.state.windows.window1.windowLoad}
            key={"window1"}
            handleClose={this.handleClose}
            handleTabChange={this.handleTabChange}
            handleBlockFocusChange={this.handleBlockFocusChange}
            handleSurfaceFocusChange={this.handleSurfaceFocusChange}
            handleSwitchWindow={this.handleSwitchWindow}
            resourceid={this.state.blockFocus}
            windowType={this.state.windows.window1.position}
            windowId={this.state.windows.window1.windowId}
            windowLoad={this.state.windows.window1.windowLoad}
            surfaceid={this.state.surfaceFocus}
            topLevel={this.state.items[this.state.itemFocus] && this.state.items[this.state.itemFocus].topLevel}
            info={this.state.info}


            />
          }
          {this.state.windows.window2.open &&
            <Window windowLoad={this.state.windows.window2.windowLoad}
            key={"window2"}
            handleClose={this.handleClose}
            handleTabChange={this.handleTabChange}
            handleBlockFocusChange={this.handleBlockFocusChange}
            handleSurfaceFocusChange={this.handleSurfaceFocusChange}
            handleSwitchWindow={this.handleSwitchWindow}
            resourceid={this.state.blockFocus ? this.state.blockFocus : this.state.itemFocus}
            windowType={this.state.windows.window2.position}
            windowId={this.state.windows.window2.windowId}
            windowLoad={this.state.windows.window2.windowLoad}
            surfaceid={this.state.surfaceFocus}
            topLevel={this.state.items[this.state.itemFocus] && this.state.items[this.state.itemFocus].topLevel}
            info={this.state.info}

            />}

        </div>
      )
    }
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
      this.state.itemFocus ? displayText() : <div>{displayParts()}{displayQuestions()}</div>
    );
  }
}

export default Text;
