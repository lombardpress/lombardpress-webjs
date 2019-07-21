import React from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import {runQuery} from './utils'
import {getSearchExpressionList, getSearchAuthorList} from './Queries'


class SearchQuery extends React.Component {
  constructor(props){
    super(props)
    this.handleQueryUpdate = this.handleQueryUpdate.bind(this)
    this.handleEidUpdate = this.handleEidUpdate.bind(this)
    this.handleRunSearch = this.handleRunSearch.bind(this)
    this.getAvailableExpressions = this.getAvailableExpressions.bind(this)
    this.handleAuthorUpdate = this.handleAuthorUpdate.bind(this)
    this.handleToggleFilterOptions = this.handleToggleFilterOptions.bind(this)
    this.state = {
      query: "",
      eid: "",
      eidFull: "",
      authorFocusId: "",
      availableExpressions: [],
      availableAuthors: [],
      showFilterOptions: false
    }
  }
  handleQueryUpdate(e){
    e.preventDefault()

    this.setState({query: e.target.value})

  }
  getAvailableExpressions(filter){
    //filter should be object
    const searchExpressionList = runQuery(getSearchExpressionList(filter))
    searchExpressionList.then((d) => {
      const availableExpressions = d.data.results.bindings.map((b) => {
        return {
          expression: b.expressionid.value,
          expressionTitle: b.expressionTitle.value,
          author: b.author.value,
          authorTitle: b.authorTitle.value,
        }
      })
      this.setState(() => {
        return{
          availableExpressions: availableExpressions
        }
      })
    })
  }
  getAvailableAuthors(){
    const searchAuthorList = runQuery(getSearchAuthorList({}))
    searchAuthorList.then((d) => {
      const availableAuthors = d.data.results.bindings.map((b) => {
        return {
          author: b.author.value,
          authorTitle: b.authorTitle.value,
        }
      })
      //searchAuthorList.filter((value,index,self) => self.indexOf(value.authro === index.author))
      this.setState(() => {
        return{
          availableAuthors: availableAuthors
        }
      })
    })
  }
  handleEidUpdate(e){
    e.preventDefault()
    this.setState({eid: e.target.value.split("/resource/")[1], eidFull: e.target.value})
  }
  handleAuthorUpdate(e){
    e.preventDefault()
    this.setState({authorFocusId: e.target.value, eid: '', eidFull: ''})
  }
  handleToggleFilterOptions(){
    this.setState((prevState) => {
      return {
        showFilterOptions: !prevState.showFilterOptions
      }
    })
  }
  handleRunSearch(e){
    e.preventDefault()
    this.props.handleRunSearch(this.state.query, this.state.eid, this.state.authorFocusId)
  }
  componentDidUpdate(prevProps, prevState){
    if (prevState.authorFocusId !== this.state.authorFocusId){
      this.getAvailableExpressions({authorId: this.state.authorFocusId})

    }
  }
  componentDidMount(){
    this.getAvailableExpressions({})
    this.getAvailableAuthors()
    this.props.eid && this.setState({eid: this.props.eid, eidFull: "http://scta.info/resource/" + this.props.eid, authorFocusId: this.props.authorId})
  }
  componentWillReceiveProps(nextProps){
    nextProps.eid && this.setState({eid: nextProps.eid})
  }
  render(){
    const displayAvailableExpressions = () => {
      if (this.state.availableExpressions.length > 0){
        const availableExpressions = this.state.availableExpressions.map((e, i) => {
          return <option key={e.expression + "-", i} value={e.expression}>{e.authorTitle}: {e.expressionTitle}</option>
        })
        return availableExpressions
      }
      else{
        return null
      }
    }
    const displayAvailableAuthors = () => {
      if (this.state.availableAuthors.length > 0){
        const availableAuthors = this.state.availableAuthors.map((e, i) => {
          return <option key={e.author + "-", i} value={e.author}>{e.authorTitle}</option>
        })
        return availableAuthors
      }
      else{
        return null
      }
    }
    return (
      <div>
       <Form onSubmit={this.handleRunSearch}>
       <Form.Group>
          <Form.Label>Enter Search Text</Form.Label>
          <Form.Control type="text" id="query" placeholder="query" className="mr-sm-2" onChange={this.handleQueryUpdate} />
        </Form.Group>

        {this.state.showFilterOptions &&
          <div>
          <Form.Group>
          <Form.Label>Filter by Author</Form.Label>
          <Form.Control as="select" onChange={this.handleAuthorUpdate} value={this.state.authorFocusId}>
            <option key="all-authors" value="">All</option>
            {displayAvailableAuthors()}
          </Form.Control>
          </Form.Group>
          <Form.Group>
          <Form.Label>Filter by Title</Form.Label>
          <Form.Control as="select" onChange={this.handleEidUpdate} value={this.state.eidFull}>
            <option key="all-expressions" value="">All</option>
            {displayAvailableExpressions()}
          </Form.Control>
          </Form.Group>
          </div>
        }

        {
          //!this.props.eid && <FormControl type="text" id="eid" placeholder="eid" className="mr-sm-2" onChange={this.handleEidUpdate} />
        }
        <Button onClick={this.handleToggleFilterOptions}>{this.state.showFilterOptions ? "Hide" : "Show"} Filter Options</Button>
        <br/>
        <br/>
        <Button type="submit" variant="outline-success">Search</Button>

      </Form>

      </div>
    )
  }
}

export default SearchQuery;
