import React, {useState, useEffect, useReducer} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {runQuery} from './utils'
import {questionTitleQuery} from '../queries/questionTitleQuery'
import Spinner from './Spinner';
import {Link} from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Search3Parameters from './Search3Parameters'

const Search3 = (props) => {
  const [searchParameters, setSearchParameters] = useState({})
  const [results, setResults] = useState([])


  const handleSetSearchParameters = (parameters) => {
    setSearchParameters(parameters)
  }
  const handleRunSearch = (e) => {
    e.preventDefault()
    if (!searchParameters.searchTerm){
      setResults([])
    }
    else{
      const questionResults = runQuery(questionTitleQuery(searchParameters))
      setResults("fetching")
      questionResults.then((d) => {
        setResults(d.data.results.bindings)
      })
    }
  }
  return(
    <Container>
      <Form onSubmit={handleRunSearch}>
        <Search3Parameters
          handleSetSearchParameters={handleSetSearchParameters}
          searchAuthor={props.searchAuthor}
          searchEid={props.searchEid}
          searchWorkGroup={props.searchWorkGroup}
          showAdvancedParameters={props.showAdvancedParameters}
          showLabels={props.showLabels}
          />
          <br/>
      {props.showSubmit && <Button onClick={handleRunSearch}>Submit</Button>}
    </Form>
    {results === "fetching"
    ? <Spinner/>
    : results.map((r, i) => (
      <div key={r.resource.value + "-" + i}>
        <p><Link to={"/text?resourceid=" + r.author.value}>{r.authorTitle.value}</Link>: <Link to={"/text?resourceid=" + r.resource.value}>{r.longTitle.value}</Link></p>
        <p>{r.qtitle.value.toLowerCase().replace(searchParameters.searchTerm.toLowerCase(), searchParameters.searchTerm.toUpperCase())}</p>
      </div>
    ))
    }
    </Container>

  )
}

Search3.defaultProps = {
  showLabels: true,
  showAdvancedParameters: true,
  searchAuthor: "",
  searchEid: "",
  showSubmit: true
};

export {Search3 as default}
