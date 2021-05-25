import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {runQuery} from './utils'
import {basicStructureAllItemsInfoQuery, partsInfoQuery,workGroupExpressionQuery} from './Queries'
import TextOutlineWrapper from "./TextOutlineWrapper"
//import Lbp from "lbp.js/lib"


class Collection extends React.Component {
  constructor(props){
    super(props)
    this.retrieveCollectionInfo = this.retrieveCollectionInfo.bind(this)
    this.makeRequests = this.makeRequests.bind(this)
    this.handleFilter = this.handleFilter.bind(this)
    this.filter = React.createRef();
    this.mount = false
    this.state = {
      title: "",
      description: "",
      items: {},
      parts: {},
      filter: ""
    }

  }
  handleFilter(e){
    const item = e.target.value
    this.setState({filter: item})

  }
  arrangeParts(partsPromise){
    const _this = this
    partsPromise.then((d) => {
        const bindings = d.data.results.bindings
        const title = bindings[0].title.value
        const description = bindings[0].description.value
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
            title,
            description,
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
    })
    .catch((err) => {
      console.log(err)
    })
  }

  retrieveWorkGroupInfo(resourceid){
    const expressionsInfo = runQuery(workGroupExpressionQuery(resourceid))
    const partsInfo = runQuery(partsInfoQuery(resourceid))
    this.arrangeParts(partsInfo)
    this.arrangeItems(expressionsInfo)
  }
  retrieveCollectionInfo(resourceid, structureType, topLevel){
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
  
  componentDidMount(){
    this.mount = true
    this.setState({resourceid: this.props.resourceid})
    this.makeRequests(this.props.resourceid, this.props.structureType, this.props.topLevel, this.props.type)

  }

  // UNSAFE_componentWillReceiveProps(nextProps) {

  //   // conditional prevents new information requestion if resource id has not changed
  //   if (nextProps.resourceid !== this.props.resourceid){
  //     this.setState({resourceid: nextProps.resourceid, filter: ""})
  //     // this conditional resets form value if ref is present
  //     // if (this.filter){
  //     //   this.filter.current.value = ""
  //     // }
  //     this.makeRequests(nextProps.resourceid, nextProps.structureType, nextProps.topLevel, nextProps.type)
  //   }
  // }
  componentDidUpdate(prevProps) {

    // conditional prevents new information requestion if resource id has not changed
    if (this.props.resourceid !== prevProps.resourceid){
      this.setState({resourceid: this.props.resourceid, filter: ""})
      // this conditional resets form value if ref is present
      // if (this.filter){
      //   this.filter.current.value = ""
      // }
      this.makeRequests(this.props.resourceid, this.props.structureType, this.props.topLevel, this.props.type)
    }
  }
  componentWillUnmount(){
    this.mount = false
  }
  render(){
    return (
      <Container className="collectionBody">
      {this.state.title && <h1>{this.state.title}</h1>}
      {this.state.title && <p style={{"textAlign": "center"}}>{this.state.description}</p>}
      {
        //<p style={{"textAlign": "center"}}><Link to={"/text?resourceid=http://scta.info/resource/scta"}>Back to Top Level</Link></p>
      }

      <Row>
        <Col xs={9}>
          <Container>

              <TextOutlineWrapper
                focusResourceid={this.state.resourceid}
                resourceid={this.state.resourceid}
                title={this.state.title}
                hidden={false}
                mtFocus={""}
                collectionLink={true}
                showAuthor={true}
                showParentLink={true}
                />
                {
              /* <Container className="collectionFilter">
              <FormControl ref={this.filter} id="filter" placeholder="type to filter by title" onChange={this.handleFilter}/>
            </Container>
            {displayParts()}
            {displayQuestions()}
            */
          }
          </Container>
        </Col>
        {/* <Col>
          <Container>
          <Search3 searchWorkGroup={this.props.resourceid}
          showSubmit={true}
          showAdvancedParameters={true}
          showLabels={false}/>
          </Container>
        </Col> */}
      </Row>
      </Container>

    );
  }
}

export default Collection;
