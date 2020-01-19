import React, {useState} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {runQuery} from './utils'
import {questionTitleQuery} from '../queries/questionTitleQuery'
import Spinner from './Spinner';
import Container from 'react-bootstrap/Container';
import Search3Parameters from './Search3Parameters';
import {retrieveAuthorResults, retrieveExpressionResults, displayTextResults, displayQuestionResults} from './searchUtils'

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
      if (searchParameters.searchType === "text"){
        setResults("fetching")
        if (searchParameters.searchEid){
          const textResults = retrieveExpressionResults(searchParameters.searchTerm, searchParameters.searchEid)
          textResults.then((d) => {
            setResults(d.data.results)
          })
        }
        else if (searchParameters.searchAuthor){
          const textResults = retrieveAuthorResults(searchParameters.searchTerm, searchParameters.searchAuthor)
          textResults.then((d) => {
            setResults(d.data.results)
          })
        }
        else{
          const textResults = retrieveExpressionResults(searchParameters.searchTerm, "all")
          textResults.then((d) => {
            setResults(d.data.results)
          })
        }


      }
      else{
        const questionResults = runQuery(questionTitleQuery(searchParameters))
        setResults("fetching")
        questionResults.then((d) => {
          setResults(d.data.results.bindings)
        })
      }
    }
  }
  const displayResults = (results) => {
    if (results === "fetching"){
      return <Spinner/>
    }
    else if (searchParameters.searchType === "questionTitles"){
      return displayQuestionResults(results, searchParameters)
    }
    else if (searchParameters.searchType === "text"){
      return displayTextResults(results)
    }
  }
  return(
    <Container className={props.hidden ? "hidden" : "showing"}>
      <Form onSubmit={handleRunSearch}>
        <Search3Parameters
          handleSetSearchParameters={handleSetSearchParameters}
          searchAuthor={props.searchAuthor}
          searchEid={props.searchEid}
          searchWorkGroup={props.searchWorkGroup}
          showAdvancedParameters={props.showAdvancedParameters}
          showLabels={props.showLabels}
          searchType={props.searchType}
          />
          <br/>
      {props.showSubmit && <Button onClick={handleRunSearch}>Submit</Button>}
    </Form>
    {displayResults(results)}
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
