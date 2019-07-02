import React from 'react';
import Qs from "query-string"
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Table from 'react-bootstrap/Table';

import {runQuery} from './utils'
import {getAuthorInformation} from './Queries'
import {Link} from 'react-router-dom';
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
    const _this = this
    itemsPromise.then((d) => {
      console.log("data", d)
      const author = d.data["@graph"].filter((i) => i["@id"] === resourceid)[0]
      console.log("author", author)
      //const authorExpressions = d.data["@graph"].filter((i) => {i["@id"] === author.hasTopLevelExpression})
      const authorTitle = author["http://purl.org/dc/elements/1.1/title"]
      let authorArticles = null
      if(Array.isArray(author.authorArticle)){
        authorArticles =  author.authorArticle.map((a) => {
          return {
            id: a,
            title: d.data["@graph"].filter((i) => i["@id"] === a)[0]["http://purl.org/dc/elements/1.1/title"]
          }
        })
      }
      else{
        authorArticles = [{id: author.autherArticle, title: d.data["@graph"].filter((i) => i["@id"] === author.autherArticle)[0]["http://purl.org/dc/elements/1.1/title"]}]
      }
      let textArticles = null
      if(Array.isArray(author.textArticle)){
          textArticles =  author.textArticle.map((a) => {
          return {
            id: a,
            title: d.data["@graph"].filter((i) => i["@id"] === a)[0]["http://purl.org/dc/elements/1.1/title"]
          }
        })
      }
      else{
        textArticles = [{id: author.textArticle, title: d.data["@graph"].filter((i) => i["@id"] === author.textArticle)[0]["http://purl.org/dc/elements/1.1/title"]}]
      }

      let expressions = null
      if(Array.isArray(author.hasTopLevelExpression)){
        expressions =  author.hasTopLevelExpression.map((a) => {
          return {
            id: a,
            title: d.data["@graph"].filter((i) => i["@id"] === a)[0]["http://purl.org/dc/elements/1.1/title"]
          }
        })
      }
      else{
        expressions = [{id: author.hasTopLevelExpression, title: d.data["@graph"].filter((i) => i["@id"] === author.hasTopLevelExpression)[0]["http://purl.org/dc/elements/1.1/title"]}]
      }
      console.log("articles", authorArticles)
      console.log("textArticles", textArticles)
      console.log("expressions", expressions)

      this.setState({authorArticles: authorArticles, textArticles: textArticles, expressions: expressions, authorTitle: authorTitle })
    }).
    catch((err) => {
      console.log(err)
    })
  }
  retrieveAuthorCollectionInfo(resourceid){
    const authorCollectionInfo = runQuery(getAuthorInformation(resourceid))
    /// add items to state
    this.arrangeItems(authorCollectionInfo, resourceid)
  }
  componentDidUpdate(prevProps, prevState){

  }
  componentDidMount(){
    this.mount = true
    this.retrieveAuthorCollectionInfo(this.props.resourceid)

  }

  componentWillReceiveProps(nextProps) {
    this.refs.itemFilter ? this.refs.itemFilter.value = "" :
    this.retrieveAuthorCollectionInfo(nextProps.resourceid)
  }
  componentWillUnmount(){
    this.mount = false
  }
  render(){
    //const resourceid = Qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).resourceid;

    const displayItems = (list) => {
      const items = list.map((i) => {
        return (

          <Item item={i}/>

        )
      });
      return items
    }






    return (
      <div className="collectionBody">
      <h1>{this.state.authorTitle}</h1>
      <br/>
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
      </div>
    );
  }
}

export default AuthorCollection;
