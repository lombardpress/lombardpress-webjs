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
      const authorShortId = resourceid.split("/resource/")[1]
      //change due to fuseki 4.3.1 update 
      //const author = d.data["@graph"].filter((i) => i["@id"] === "sctar:peter-plaoulresourceid)[0]
      const author = d.data["@graph"].filter((i) => i["@id"] === "sctar:" + authorShortId)[0]
      //const authorExpressions = d.data["@graph"].filter((i) => {i["@id"] === author.hasTopLevelExpression})
      const authorTitle = author["title"]
      let authorArticles = null
      if(Array.isArray(author.authorArticle)){
        authorArticles =  author.authorArticle.map((a) => {
          return {
            id: a.replace("sctar:", "http://scta.info/resource/"),
            //change due to fuseki 4.3.1 update 
            //title: d.data["@graph"].filter((i) => i["@id"] === a)[0]["http://purl.org/dc/elements/1.1/title"]
            title: d.data["@graph"].filter((i) => i["@id"] === a)[0]["title"]
          }
        })
      }
      else if (author.authorArticle){
        //change due to fuseki 4.3.1 update 
        //authorArticles = [{id: author.authorArticle, title: d.data["@graph"].filter((i) => i["@id"] === author.authorArticle)[0]["http://purl.org/dc/elements/1.1/title"]}]
        authorArticles = [{id: author.authorArticle.replace("sctar:", "http://scta.info/resource/"), title: d.data["@graph"].filter((i) => i["@id"] === author.authorArticle)[0]["http://purl.org/dc/elements/1.1/title"]}]
      }
      let textArticles = null
      if(Array.isArray(author.textArticle)){
          textArticles =  author.textArticle.map((a) => {
          return {
            id: a.replace("sctar:", "http://scta.info/resource/"),
            //change due to fuseki 4.3.1 update
            //title: d.data["@graph"].filter((i) => i["@id"] === a)[0]["http://purl.org/dc/elements/1.1/title"]
            title: d.data["@graph"].filter((i) => i["@id"] === a)[0]["title"]
          }
        })
      }
      else if (author.textArticle){
        //change due to fuseki 4.3.1 update
        //textArticles = [{id: author.textArticle, title: d.data["@graph"].filter((i) => i["@id"] === author.textArticle)[0]["http://purl.org/dc/elements/1.1/title"]}]
        textArticles = [{id: author.textArticle.replace("sctar:", "http://scta.info/resource/"), title: d.data["@graph"].filter((i) => i["@id"] === author.textArticle)[0]["title"]}]
      }

      let expressions = null
      if(Array.isArray(author.hasTopLevelExpression)){
        expressions =  author.hasTopLevelExpression.map((a) => {
          return {
            id: a.replace("sctar:", "http://scta.info/resource/"),
            //change due to fuseki 4.3.1 update
            //title: d.data["@graph"].filter((i) => i["@id"] === a)[0]["http://purl.org/dc/elements/1.1/title"]
            title: d.data["@graph"].filter((i) => i["@id"] === a)[0]["title"]
          }
        })
      }
      else if (author.hasTopLevelExpression){
        //change due to fuseki 4.3.1 update
        //expressions = [{id: author.hasTopLevelExpression, title: d.data["@graph"].filter((i) => i["@id"] === author.hasTopLevelExpression)[0]["http://purl.org/dc/elements/1.1/title"]}]
        expressions = [{id: author.hasTopLevelExpression.replace("sctar:", "http://scta.info/resource/"), title: d.data["@graph"].filter((i) => i["@id"] === author.hasTopLevelExpression)[0]["title"]}]
      }
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
