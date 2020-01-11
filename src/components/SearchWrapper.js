import React from 'react';
import Search from "./Search"
import SearchQuery from "./SearchQuery"
import Container from 'react-bootstrap/Container';

class SearchWrapper extends React.Component {
  constructor(props){
    super(props)
    this.handleRunSearch = this.handleRunSearch.bind(this)
    this.state = {
      query: "",
      eid: "",
      authorFocusId: ""
    }
  }
  handleRunSearch(query, eid, authorFocusId){
    this.setState({query: query, eid: eid, authorFocusId: authorFocusId})
  }

  componentDidMount(){

  }
  UNSAFE_componentWillReceiveProps(){

  }
  render(){
    return (
      <Container className={this.props.hidden ? "hidden" : "showing"}>
        <h1>Search</h1>
        <SearchQuery handleRunSearch={this.handleRunSearch} eid={this.props.topLevel ? this.props.topLevel.split("/resource/")[1] : null} authorId={this.props.authorId}/>
        {this.state.query && <Search query={this.state.query} eid={this.state.eid} authorFocusId={this.state.authorFocusId}/>}
      </Container>
    )
  }
}

export default SearchWrapper;
