import React, {useEffect, useState} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {runQuery} from './utils'
import {questionTitleQuery} from '../queries/questionTitleQuery'
import Spinner from './Spinner';
import Container from 'react-bootstrap/Container';
import Search3Parameters from './Search3Parameters';
import {retrieveSearchResults, displayTextResults, displayFigureResults, displayQuestionResults, createIdTitleMap, getValueLongTitlesAndAuthors} from './searchUtils'

const Search3 = (props) => {
  const urlParams = new URLSearchParams(window.location.search);
  const defaultSearchTerm = urlParams?.get("searchTerm") || undefined
  const defaultSearchWorkGroup = !defaultSearchTerm ? undefined : "http://scta.info/resource/scta"

  const [searchParameters, setSearchParameters] = useState({"searchTerm": defaultSearchTerm, "searchWorkGroup": defaultSearchWorkGroup})
  const [results, setResults] = useState([])
  const [questionResults, setQuestionResults] = useState([])
  const [idTitleMap, setIdTitleMap] = useState()
  const [offset, setOffset] = useState(1)
  const [showMore, setShowMore] = useState(true)
  
  // TODO: check this; i don't think it is doing anything
  useEffect(() => {
    if (searchParameters.searchType === "questionTitles"){
      displayQuestionResults(filterQuestionResults(questionResults, searchParameters.resultsFilter), searchParameters)
    }
    if (searchParameters.searchType === "figure"){
      displayQuestionResults(filterQuestionResults(results, searchParameters.resultsFilter), searchParameters.resultsFilter, )
    }
    else if (searchParameters.searchType === "text"){
        displayTextResults(filterResults(results, searchParameters.resultsFilter), idTitleMap)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParameters.resultsFilter])
  // TODO check above; might be deletable 

  useEffect(() => {
    if (results !== "fetching"){
      const idTitleArray = runQuery(getValueLongTitlesAndAuthors(results))
      idTitleArray.then((d) => {
        setIdTitleMap(createIdTitleMap(d.data.results.bindings))
      })
    }
  }, [results])
  
  useEffect(() => {
    if (results !== "fetching"){
      setResults([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParameters.searchType])

  

  useEffect(() => {
    if (searchParameters.searchEid || searchParameters.searchAuthor || searchParameters.searchWorkGroup || searchParameters.searchEType){
      
      const textResults = retrieveSearchResults(searchParameters.searchTerm, 
        searchParameters.searchEid, 
        searchParameters.searchWorkGroup, 
        searchParameters.searchAuthor, 
        searchParameters.searchEType,
        searchParameters.searchType,
        offset)
        setResults("fetching")
        textResults.then((d) => {
          if (d.data.results){
            if (Array.isArray(d.data.results)){
              setResults(d.data.results)     
              const showMore = d.data.results[0].moreResults === "true" ? true : false
              setShowMore(showMore)
            }
            else{
              setResults([d.data.results])     
              const showMore = d.data.results[0].moreResults === "true" ? true : false
              setShowMore(showMore)
            } 
          }
          else{
            setResults([])
          }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset])
  
  const handleSetSearchParameters = (parameters) => {
    setSearchParameters(parameters)
  }

  const handleRunSearch = (e = null) => {
    if (e){
      e.preventDefault()
    }
    setShowMore(true)
    setOffset(1)
    if (!searchParameters.searchTerm){
      setResults([])
    }
    else{
      if (searchParameters.searchType === "text" || searchParameters.searchType === "figure"){
        setResults("fetching")
        setQuestionResults([])
        if (searchParameters.searchEid || searchParameters.searchAuthor || searchParameters.searchWorkGroup || searchParameters.searchEType){
            const textResults = retrieveSearchResults(searchParameters.searchTerm, 
              searchParameters.searchEid, 
              searchParameters.searchWorkGroup, 
              searchParameters.searchAuthor, 
              searchParameters.searchEType,
              searchParameters.searchType,
              offset)
            textResults.then((d) => {
              if (d.data.results){
                if (Array.isArray(d.data.results)){
                  setResults(d.data.results)     
                  const showMore = d.data.results[0].moreResults === "true" ? true : false
                  setShowMore(showMore)
                }
                else{
                  setResults([d.data.results])     
                  const showMore = d.data.results.moreResults === "true" ? true : false
                  setShowMore(showMore)
                }         
              }
              else{
                setResults([])
              }
          })
        }
      }
      else if (searchParameters.searchType === "questionTitles"){
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
    else if (searchParameters.searchType === "figure"){
      return displayFigureResults(results, idTitleMap);
    }
    else if (searchParameters.searchType === "text"){
        return displayTextResults(filterResults(results, searchParameters.resultsFilter), idTitleMap)
    }
  }
  const filterResults = (results, resultsFilter) => {
    let newResults = [] 
    if (!results || results.length === 0){
      newResults = [] 
    }
    else if ((results.length > 0) && results !== "fetching"){
      results.forEach((r) => {
        if (r.previous && r.hit && r.next){
          const combinedString = [ r.previous.toLowerCase(), r.hit.toLowerCase(), r.next.toLowerCase()].join(" ")
          if (combinedString.includes(resultsFilter.toLowerCase())){
            newResults.push(r)
          }
        }
      })
    }
    else if (results){
      const r = results;
      if (r.previous && r.hit && r.next){
        const combinedString = [r.previous.toLowerCase(), r.hit.toLowerCase(), r.next.toLowerCase()].join(" ")
        newResults = combinedString.includes(resultsFilter.toLowerCase()) ? results : "";
      }
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
      <br/>
      <Form onSubmit={handleRunSearch}>
        <Search3Parameters
          handleSetSearchParameters={handleSetSearchParameters}
          searchAuthor={props.searchAuthor}
          searchEid={props.searchEid}
          searchEType={props.searchEType}
          searchWorkGroup={props.searchWorkGroup || defaultSearchWorkGroup}
          showAdvancedParameters={props.showAdvancedParameters}
          showLabels={props.showLabels}
          searchType={props.searchType}
          searchTerm={props.searchTerm || defaultSearchTerm}
          >
            {props.showSubmit && <Button onClick={handleRunSearch} className="btn-sm" style={{marginRight: "5px"}}>Submit</Button>}
            </Search3Parameters>
          
      
    </Form>
    {results &&  results !== "fetching" && results.length > 0 && <p>{(offset !==1) && <span onClick={(() => {setOffset(offset - 30)})}>Show Previous</span>} 
    <span> | </span>
    {/* <span>{"page " + offset + " (results" + results.length + ")"}</span> */}
    {results && results !== "fetching" && showMore === true && <span onClick={(() => {setOffset(offset + 30)})}>Show More</span>}</p>}
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
