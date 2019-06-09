import React from 'react';
import Axios from 'axios'
import Qs from "query-string"
import Search from "./Search"
import SearchQuery from "./SearchQuery"

class SearchWrapper extends React.Component {
  constructor(props){
    super(props)
    this.handleRunSearch = this.handleRunSearch.bind(this)
    this.state = {
      query: "",
      eid: "",
    }
  }
  handleRunSearch(query, eid){
    this.setState({query: query, eid: eid})
  }
  componentDidMount(){

  }
  componentWillReceiveProps(){

  }
  render(){
    return (
      <div className={this.props.hidden ? "hidden" : "showing"}>
        <h1>Search</h1>
        <SearchQuery handleRunSearch={this.handleRunSearch} eid={this.props.info && this.props.info.topLevel.split("/resource/")[1]}/>
        {this.state.query && <Search query={this.state.query} eid={this.state.eid}/>}
      </div>
    )
  }
}

export default SearchWrapper;
