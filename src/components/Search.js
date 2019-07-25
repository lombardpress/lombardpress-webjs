import React from 'react';
import Axios from 'axios';
import Spinner from './Spinner';
import {Link} from 'react-router-dom';

class Search extends React.Component {
  constructor(props){
    super(props)
    this.retrieveExpressionResults = this.retrieveExpressionResults.bind(this)
    this.retrieveAuthorResults = this.retrieveAuthorResults.bind(this)
    this.state = {
      searchResults: [],
      count: "",
      fetching: false
    }
  }
  retrieveExpressionResults(query, expressionid){
    const _this = this
    this.setState({fetching: true})
    Axios.get("http://exist.scta.info/exist/apps/scta-app/jsonsearch/json-search-text-by-expressionid.xq?query=" + query + "&expressionid=" + expressionid)
      .then((d) => {
            _this.setState({searchResults: d.data.results, count: d.data.count, fetching: false})
          })
  }
  retrieveAuthorResults(query, authorid){
    const _this = this
    this.setState({fetching: true})
    const authorShortId = authorid.split("/resource/")[1]
    Axios.get("http://exist.scta.info/exist/apps/scta-app/jsonsearch/json-search-text-by-authorid.xq?query=" + query + "&authorid=" + authorShortId)
      .then((d) => {
            _this.setState({searchResults: d.data.results, count: d.data.count, fetching: false})
          })
  }
  componentDidMount(){
    // const query = Qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).query
    // const eid = Qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).eid
    const query = this.props.query
    const eid =  this.props.eid
    const authorFocusId =  this.props.authorFocusId
    if (eid){
      this.retrieveExpressionResults(query, eid)
    }
    else if (authorFocusId){
      this.retrieveAuthorResults(query, authorFocusId)
    }
    else{
      this.retrieveExpressionResults(query, "all")

    }
  }
  componentWillReceiveProps(nextProps){
    if ((nextProps.query !== this.props.query) || (nextProps.eid !== this.props.eid) || (nextProps.authorFocusId !== this.props.authorFocusId)){
      const query = nextProps.query
      const eid =  nextProps.eid
      const authorFocusId =  nextProps.authorFocusId
      if (eid){
        this.retrieveExpressionResults(query, eid)
      }
      else if (authorFocusId){
        this.retrieveAuthorResults(query, authorFocusId)
      }
    }
  }
  render(){
    const displayResults = () => {
      if (!this.state.searchResults){
        return (<div>
          <p>No results found</p>
        </div>)
      }
      else if (this.state.searchResults.length > 1){
        const results = this.state.searchResults.map((r, i) => {
          return (
            <div key={i}>
            <p><Link to={"/text?resourceid=http://scta.info/resource/" + r.pid}>{r.pid}</Link></p>
            <p dangerouslySetInnerHTML={{ __html: r.text}}/>
            </div>
          )

        })
      return results
    }
    else if (this.state.searchResults){
      return (
        <div key={this.state.searchResults.pid}>
        <p><Link to={"/text?resourceid=http://scta.info/resource/" + this.state.searchResults.pid}>{this.state.searchResults.pid}</Link></p>
        <p dangerouslySetInnerHTML={{ __html: this.state.searchResults.text}}/>
        </div>
      )
    }
    else{
      return (
        <div><p>No results</p></div>
      )
    }
  }
  return (
    <div>
    {
      this.state.fetching ?
      <Spinner/> :
      displayResults()
    }
    </div>


  );
  }
}

export default Search;
