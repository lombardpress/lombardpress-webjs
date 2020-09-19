import React, {useEffect, useState} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {runQuery} from './utils'
import {questionTitleQuery} from '../queries/questionTitleQuery'
import Spinner from './Spinner';
import Container from 'react-bootstrap/Container';
import Search3Parameters from './Search3Parameters';
import {retrieveAuthorResults, retrieveExpressionResults, retrieveWorkGroupResults, displayTextResults, displayQuestionResults} from './searchUtils'

const Search3 = (props) => {
  const [searchParameters, setSearchParameters] = useState({})
  const [results, setResults] = useState([])
  const [questionResults, setQuestionResults] = useState([])
  
  useEffect(() => {
    if (searchParameters.searchType === "questionTitles"){
      displayQuestionResults(filterQuestionResults(questionResults, searchParameters.resultsFilter), searchParameters)
    }
    else if (searchParameters.searchType === "text"){
      displayTextResults(filterResults(results, searchParameters.resultsFilter))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParameters.resultsFilter])
  
  
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
        setQuestionResults([])
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
        else if (searchParameters.searchWorkGroup){
          const textResults = retrieveWorkGroupResults(searchParameters.searchTerm, searchParameters.searchWorkGroup)
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
        setQuestionResults("fetching")
        setResults([])
        questionResults.then((d) => {
          setQuestionResults(d.data.results.bindings)
        })
      }
    }
  }
  const displayResults = (results) => {
    if (results === "fetching" || questionResults === "fetching"){ 
      return <Spinner/>
    }
    else if (searchParameters.searchType === "questionTitles"){
      return displayQuestionResults(filterQuestionResults(questionResults, searchParameters.resultsFilter), searchParameters)
    }
    else if (searchParameters.searchType === "text"){
      
      return displayTextResults(filterResults(results, searchParameters.resultsFilter))
    }
  }
  const filterResults = (results, resultsFilter) => {
    let newResults = [] 
    if (!results || results.length === 0){
      newResults = [] 
    }
    else if (results.length > 1){
      results.forEach((r) => {
        const combinedString = [r.previous.toLowerCase(), r.hit.toLowerCase(), r.next.toLowerCase()].join(" ")
        if (combinedString.includes(resultsFilter.toLowerCase())){
          newResults.push(r)
        }
      })
    }
    else if (results){
      const r = results;
      const combinedString = [r.previous.toLowerCase(), r.hit.toLowerCase(), r.next.toLowerCase()].join(" ")
      newResults = combinedString.includes(resultsFilter.toLowerCase()) ? results : "";
    }
    return newResults
  }
  // similar filter to above; but modified to handle question title data structure
  const filterQuestionResults = (results, resultsFilter) => {
    let newResults = [] 
    if (!results || results.length === 0){
      newResults = [] 
    }
    else if (results.length > 0){
      results.forEach((r) => {
        if (r.qtitle && r.qtitle.value.toLowerCase().includes(resultsFilter.toLowerCase())){
          newResults.push(r)
        }
      })
    }
    return newResults
  }

  return(
    <Container className={props.hidden ? "hidden" : "showing"}>
      <Form onSubmit={handleRunSearch}>
        <Search3Parameters
          handleSetSearchParameters={handleSetSearchParameters}
          searchAuthor={props.searchAuthor}
          searchEid={props.searchEid}
          searchEType={props.searchEType}
          searchWorkGroup={props.searchWorkGroup}
          showAdvancedParameters={props.showAdvancedParameters}
          showLabels={props.showLabels}
          searchType={props.searchType}
          searchTerm={props.searchTerm}
          >
            {props.showSubmit && <Button onClick={handleRunSearch} className="btn-sm" style={{marginRight: "5px"}}>Submit</Button>}
            </Search3Parameters>
          
      
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
