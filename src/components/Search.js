import React from 'react';
import Axios from 'axios'
import Qs from "query-string"
import {Link} from 'react-router-dom';

class Search extends React.Component {
  constructor(props){
    super(props)
    this.retrieveResults = this.retrieveResults.bind(this)
    this.state = {
      searchResults: [],
      count: ""
    }
  }
  retrieveResults(query, expressionid){
    const _this = this
    Axios.get("http://exist.scta.info/exist/apps/scta-app/jsonsearch/json-search-text-by-expressionid.xq?query=" + query + "&expressionid=" + expressionid).
          then((d) => {
            _this.setState({searchResults: d.data.results, count: d.data.count})
          })
  }
  componentDidMount(){
    const query = Qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).query
    const eid = Qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).eid
    console.log(query, eid)
    this.retrieveResults(query, eid)
  }
  componentWillReceiveProps(){
    const query = Qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).query
    const eid = Qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).eid
    this.retrieveResults(query, eid)
  }
  render(){
    const displayResults = () => {
      const results = this.state.searchResults.map((r) => {
        return (
          <div>
          <p><Link to={"/text?resourceid=http://scta.info/resource/" + r.id}>{r.id}</Link></p>
          <p dangerouslySetInnerHTML={{ __html: r.text}}/>
          </div>
        )

      })
      return results
    }
  return (
    <div>
    {displayResults()}
    </div>


  );
  }
}

export default Search;
