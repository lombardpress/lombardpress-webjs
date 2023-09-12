import React from 'react';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import {runQuery} from './utils'
import {getAuthorInformation} from './Queries'
import Item from "./Item"

//import Lbp from "lbp.js/lib"


class AuthorCollection extends React.Component {
  constructor(props){
    super(props)

    this.retrieveAuthorCollectionInfo = this.retrieveAuthorCollectionInfo.bind(this)
    this.handleItemFilter = this.handleItemFilter.bind(this)
    this.itemFilter = React.createRef();

    this.mount = false
    this.state = {
      authorTitle: "",
      authorArticles: [],
      textArticles: [],
      expressions: [],
      itemFilter: "",
    }

  }
  handleItemFilter(e){
    const item = e.target.value
    this.setState({itemFilter: item})

  }
  arrangeItems(itemsPromise, resourceid){
    itemsPromise.then((d) => {
      // author get with conditional fall back due to strange changing behavior in results
      let author = d.data["@graph"].filter((i) => i["@id"] === resourceid.replace("http://scta.info/resource/", "sctar:"))[0]
      if (!author){
        author = d.data["@graph"].filter((i) => i["@id"] === resourceid)[0]
      }
      const authorTitle = author["dc:title"]
      
      let authorArticles = null
      if(Array.isArray(author["sctap:authorArticle"])){
        authorArticles =  author["sctap:authorArticle"].map((a) => {
          return {
            id: a["@id"].replace("sctar:", "http://scta.info/resource/"),
            //change due to fuseki 4.3.1 update 
            //title: d.data["@graph"].filter((i) => i["@id"] === a)[0]["http://purl.org/dc/elements/1.1/title"]
            title: d.data["@graph"].filter((i) => i["@id"] === a["@id"])[0]["dc:title"]
          }
        })
      }
      else if (author["sctap:authorArticle"]){
        authorArticles = [{id: author["sctap:authorArticle"]["@id"].replace("sctar:", "http://scta.info/resource/"), title: d.data["@graph"].filter((i) => i["@id"] === author["sctap:authorArticle"]["@id"])[0]["dc:title"]}]
      }
      let textArticles = null
      if(Array.isArray(author["sctap:textArticle"])){
          textArticles =  author["sctap:textArticle"].map((a) => {
          return {
            id: a["@id"].replace("sctar:", "http://scta.info/resource/"),
            title: d.data["@graph"].filter((i) => i["@id"] === a["@id"])[0]["dc:title"]
          }
        })
      }
      else if (author["sctap:textArticle"]){
        textArticles = [{id: author["sctap:textArticle"]["@id"].replace("sctar:", "http://scta.info/resource/"), title: d.data["@graph"].filter((i) => i["@id"] === author["sctap:textArticle"]["@id"])[0]["dc:title"]}]
      }

      let expressions = null
      if(Array.isArray(author["sctap:hasTopLevelExpression"])){
        expressions =  author["sctap:hasTopLevelExpression"].map((a) => {
          return {
            id: a["@id"].replace("sctar:", "http://scta.info/resource/"),
            title: d.data["@graph"].filter((i) => i["@id"] === a["@id"])[0]["dc:title"]
          }
        })
      }
      else if (author["sctap:hasTopLevelExpression"]){
        expressions = [{id: author["sctap:hasTopLevelExpression"]["@id"].replace("sctar:", "http://scta.info/resource/"), title: d.data["@graph"].filter((i) => i["@id"] === author["sctap:hasTopLevelExpression"]["@id"])[0]["dc:title"]}]
      }
      console.log("expressions", expressions)
      if (this.mount){
        this.setState({authorArticles: authorArticles, textArticles: textArticles, expressions: expressions, authorTitle: authorTitle })
      }
      
    })
    .catch((err) => {
      console.log(err)
    })
  }

  retrieveAuthorCollectionInfo(resourceid){
    const authorCollectionInfo = runQuery(getAuthorInformation(resourceid))
    /// add items to state
    this.arrangeItems(authorCollectionInfo, resourceid)
  }
  componentDidUpdate(prevProps){
    if (this.props.resourceid !== prevProps.resourceid){
      this.refs.itemFilter ? this.refs.itemFilter.value = "" :
      this.retrieveAuthorCollectionInfo(this.props.resourceid)
    }
  }
  componentDidMount(){
    this.mount = true
    this.retrieveAuthorCollectionInfo(this.props.resourceid)

  }
  componentWillUnmount(){
    this.mount = false
  }
  render(){
    //const resourceid = Qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).resourceid;

    const displayItems = (list) => {
      const items = list.map((i) => {
        return (

          <Item key={i.id} item={i}/>

        )
      });
      return items
    }






    return (
      <Container className="collectionBody">
      <h1>{this.state.authorTitle}</h1>
      
        {this.state.expressions &&
        <Container>
        <h1>Expressions</h1>
        <br/>
        <Table striped bordered hover size="sm">
        <tbody>
        {displayItems(this.state.expressions)}
        </tbody>
        </Table>
        </Container>
      }
      {this.state.authorArticles &&
        <Container>
        <h1>Author Related Articles</h1>
        <br/>
        <Table striped bordered hover size="sm">
        <tbody>
        {displayItems(this.state.authorArticles)}
        </tbody>
        </Table>
        </Container>
      }
      {this.state.textArticles &&
        <Container>
        <h1>Text Related Articles</h1>
        <br/>
        <Table striped bordered hover size="sm">
        <tbody>
        {displayItems(this.state.textArticles)}
        </tbody>
        </Table>
        </Container>
      }
      </Container>
    );
  }
}

export default AuthorCollection;
