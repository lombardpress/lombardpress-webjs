import React from 'react';
import Axios from 'axios'

import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

class SearchQuery extends React.Component {
  constructor(props){
    super(props)
    this.handleQueryUpdate = this.handleQueryUpdate.bind(this)
    this.handleEidUpdate = this.handleEidUpdate.bind(this)
    this.handleRunSearch = this.handleRunSearch.bind(this)
    this.state = {
      query: "",
      eid: "",
    }
  }
  handleQueryUpdate(e){
    e.preventDefault()

    this.setState({query: e.target.value})

  }
  handleEidUpdate(e){
    e.preventDefault()
    this.setState({eid: e.target.value})

  }
  handleRunSearch(e){
    e.preventDefault()
    this.props.handleRunSearch(this.state.query, this.state.eid)
  }
  componentDidMount(){
    this.props.eid && this.setState({eid: this.props.eid})
  }
  componentWillReceiveProps(nextProps){
    nextProps.eid && this.setState({eid: nextProps.eid})
  }
  render(){
    return (
      <div>
       <Form onSubmit={this.handleRunSearch}>
        <FormControl type="text" id="query" placeholder="query" className="mr-sm-2" onChange={this.handleQueryUpdate} />
        {!this.props.eid &&<FormControl type="text" id="eid" placeholder="eid" className="mr-sm-2" onChange={this.handleEidUpdate} />}
        <Button type="submit" variant="outline-success">Search</Button>
      </Form>

      </div>
    )
  }
}

export default SearchQuery;
