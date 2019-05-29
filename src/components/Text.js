import React from 'react';
import Qs from "query-string"
import Container from 'react-bootstrap/Container';
import {loadXMLDoc, convertXMLDoc, runQuery} from './utils'
import {basicStructureItemInfoQuery} from './Queries'
import Axios from 'axios'

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
    this.retrieveInfo = this.retrieveInfo.bind(this)
    this.state = {
      focus: null,
      manifestations: [],
      inbox: "",
      next: "",
      previous: "",
      resourceid: "",
      info: null
    }
  }
  handleOnClick(){

  }
  handleClose(){
    this.setState({focus: ""})
  }
  retrieveText(resourceid){
    const _this = this;
    const urlFragment = resourceid.split("/resource/")[1]
    const xmlurl = "http://exist.scta.info/exist/apps/scta-app/document/" + urlFragment + "/critical/transcription"
    const xslurl = "http://localhost:3000/xslt/main_view.xsl"
    const resultDocument = convertXMLDoc(xmlurl, xslurl)
    // append resultDoc to div in DOM
    document.getElementById("text").innerHTML = "";
    document.getElementById("text").appendChild(resultDocument);
    $('.para_wrap').click(function() {
      const id = $(this).attr('id').split("pwrap_")[1]

      _this.setState({focus: id})

    });
  }
  retrieveInfo(resourceid){
    const _this = this;
    const itemInfo = runQuery(basicStructureItemInfoQuery(resourceid))
    itemInfo.then((d) => {

      const bindings = d.data.results.bindings
      _this.setState(
        {
          next: bindings[0].next ? bindings[0].next.value : null,
          previous: bindings[0].previous ? bindings[0].previous.value : null,
        }
      )
    }).
    catch((err) => {
      console.log(err)
    })
  }
  componentDidUpdate(){


  }
  componentDidMount(){
    const _this = this;
    const newResourceId = Qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).resourceid
    this.setState({resourceid: newResourceId})
    this.retrieveInfo(newResourceId)
    this.retrieveText(newResourceId)
  }
  componentWillReceiveProps(nextProps) {
    const newResourceId = Qs.parse(nextProps.location.search, { ignoreQueryPrefix: true }).resourceid
    this.setState({resourceid: newResourceId})
    this.retrieveInfo(newResourceId)
    this.retrieveText(newResourceId)
  }
  render(){
    const resourceid = Qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).resourceid;
    return (
      <div>
        <Container className={this.state.focus ? "lbp-text skinnyText" : "lbp-text fullText"} id="text">
        </Container>
        <TextNavBar next={this.state.next} previous={this.state.previous}/>
        {this.state.focus && <SideWindow key={"side" + this.state.focus} handleClose={this.handleClose} resourceid={this.state.focus} />}
        {this.state.focus && <BottomWindow key={"bottom" + this.state.focus} handleClose={this.handleClose} resourceid={this.state.focus}/>}
      </div>
    );
  }
}

export default Text;
