import React, {useState, useEffect, useReducer} from 'react';
import searchExpressionsListReducer from '../reducers/searchExpressionsListReducer'
import * as searchExpressionsListActions from '../actions/searchExpressionsListActions'
import searchAuthorsListReducer from '../reducers/searchAuthorsListReducer'
import * as searchAuthorsListActions from '../actions/searchAuthorsListActions'
import searchWorkGroupsListReducer from '../reducers/searchWorkGroupsListReducer'
import * as searchWorkGroupsListActions from '../actions/searchWorkGroupsListActions'
import searchExpressionTypesListReducer from '../reducers/searchExpressionTypesListReducer'
import * as searchExpressionTypesListActions from '../actions/searchExpressionTypesListActions'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';

const Search3Parameters = (props) => {
  const [searchType, setSearchType] = useState(props.searchType ? props.searchType : "text")
  const [searchTerm, setSearchTerm] = useState(props.searchTerm)
  const [searchAuthor, setSearchAuthor] = useState(props.searchAuthor)
  const [searchEid, setSearchEid] = useState(props.searchEid)
  const [searchEType, setSearchEType] = useState(props.searchEType)
  const [searchWorkGroup, setSearchWorkGroup] = useState(props.searchWorkGroup)

  const [resultsFilter, setResultsFilter] = useState("")

  const [searchExpressionTypesList, searchExpressionTypesListDispatch] = useReducer(searchExpressionTypesListReducer, [])
  const [searchExpressionsList, searchExpressionsListDispatch] = useReducer(searchExpressionsListReducer, [])
  const [searchAuthorsList, searchAuthorsListDispatch] = useReducer(searchAuthorsListReducer, [])
  const [searchWorkGroupsList, searchWorkGroupsListDispatch] = useReducer(searchWorkGroupsListReducer, [])
  const searchParameters = {searchTerm, searchAuthor, searchEid, searchWorkGroup, searchType, searchEType, resultsFilter}

  const [displayAllParameters, setDisplayAllParameters] = useState(false)

  const handleSetSearchParameters = () => {
    props.handleSetSearchParameters(searchParameters)
  }
  const handleSetResultsFilter = (content) => {
    setResultsFilter(content)
  }

  //begin effects to update hooks when props change
  // perhaps this could be combined into a single custom hood
  useEffect(() => {
    setSearchType(props.searchType ? props.searchType : "text")
  }, [props.searchType])
  useEffect(() => {
    setSearchAuthor(props.searchAuthor)
  }, [props.searchAuthor])
  useEffect(() => {
    setSearchEid(props.searchEid)
  }, [props.searchEid])
  useEffect(() => {
    setSearchWorkGroup(props.searchWorkGroup)
  }, [props.searchWorkGroup])
  useEffect(() => {
    setSearchTerm(props.searchTerm)
  }, [props.searchTerm])
  //end effects to update hooks when props change
  //begin other effects
  useEffect(handleSetSearchParameters, [searchTerm, searchAuthor, searchEid, searchWorkGroup, searchType, searchEType, resultsFilter])
  useEffect(() => {
    searchExpressionsListDispatch(searchExpressionsListActions.fetchExpressionsList(searchParameters, searchExpressionsListDispatch))
    searchAuthorsListDispatch(searchAuthorsListActions.fetchAuthorsList(searchParameters, searchAuthorsListDispatch))
    searchWorkGroupsListDispatch(searchWorkGroupsListActions.fetchWorkGroupsList(searchParameters, searchWorkGroupsListDispatch))
    searchExpressionTypesListDispatch(searchExpressionTypesListActions.fetchExpressionTypesList(searchParameters, searchExpressionTypesListDispatch))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    searchExpressionsListDispatch(searchExpressionsListActions.fetchExpressionsList(searchParameters, searchExpressionsListDispatch))
    searchWorkGroupsListDispatch(searchWorkGroupsListActions.fetchWorkGroupsList(searchParameters, searchWorkGroupsListDispatch))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchAuthor])
  useEffect(() => {
    searchExpressionsListDispatch(searchExpressionsListActions.fetchExpressionsList(searchParameters, searchExpressionsListDispatch))
    searchAuthorsListDispatch(searchAuthorsListActions.fetchAuthorsList(searchParameters, searchAuthorsListDispatch))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchWorkGroup])


  return(
    <div>
      <InputGroup size="sm" className="mb-2">
        <InputGroup.Prepend>
            <InputGroup.Text>Search Term</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control as="input" type="text" placeholder="search term" onChange={(e) => setSearchTerm(e.target.value)} value={searchParameters.searchTerm}/>
      </InputGroup>
      {/* {NOTE filter results parameter is useful only when results are of manageable size;
        when results are big, javascript locks up while filtering
        if paging is used, then this could prevent performance slow down 
        but paging makes the tool less than useful, because it will only filter what is on the page
        TODO: reconsider if you want to keep this; or this is not worth the trouble
        NOTE: if this parameters is removed, then filterResults() and filterQuestionResults() functions 
        in Search3 should be removed
        } */}
      <InputGroup size="sm" className="mb-2">
          <InputGroup.Prepend>
            <InputGroup.Text>Filter Results</InputGroup.Text>
          </InputGroup.Prepend>
        <Form.Control as="input" type="secondary results filter" placeholder="secondary results filter" onChange={(e) => handleSetResultsFilter(e.target.value)} value={resultsFilter}/>
      </InputGroup>
      {displayAllParameters &&
        <div>
          <InputGroup size="sm" className="mb-2">
            <InputGroup.Prepend>
              <InputGroup.Text>Search Type</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control as="select" onChange={(e) => {setSearchType(e.target.value)}} value={searchParameters.searchType}>
              <option value="questionTitles">Questions Titles</option>
              <option value="text">Text</option>
              <option value="figure">Figure</option>
            </Form.Control>
          </InputGroup>
          <InputGroup size="sm" className="mb-2">
            <InputGroup.Prepend>
              <InputGroup.Text>Work Group</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control as="select" onChange={(e) => {setSearchWorkGroup(e.target.value)}} value={searchParameters.searchWorkGroup}>
                <option value="">All</option>
                {searchWorkGroupsList && searchWorkGroupsList.map((e, i) => {
                    return (<option key={e.workGroup + "-" + i} value={e.workGroup}>{e.workGroupTitle}</option>)
                  })
                }
              </Form.Control>
          </InputGroup>
          <InputGroup size="sm" className="mb-2">
            <InputGroup.Prepend>
              <InputGroup.Text>Expression Type</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control as="select" onChange={(e) => {setSearchEType(e.target.value)}} value={searchParameters.searchEType}>
                <option value="">All</option>
                {searchExpressionTypesList && searchExpressionTypesList.map((e, i) => {
                    return (<option key={e.expressionType + "-" + i} value={e.expressionType}>{e.expressionTypeTitle}</option>)
                  })
                }
            </Form.Control>
          </InputGroup>
          <InputGroup size="sm" className="mb-2">
            <InputGroup.Prepend>
              <InputGroup.Text>Author</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control as="select" onChange={(e) => {setSearchAuthor(e.target.value)}} value={searchParameters.searchAuthor}>
              <option value="">All</option>
              {searchAuthorsList && searchAuthorsList.map((e, i) => {
                  return (<option key={e.author + "-" + i} value={e.author}>{e.authorTitle}</option>)
                })
              }
            </Form.Control>
          </InputGroup>
          <InputGroup size="sm" className="mb-2">
            <InputGroup.Prepend>
              <InputGroup.Text>Text</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control as="select" onChange={(e) => {setSearchEid(e.target.value)}} value={searchParameters.searchEid}>
              <option value="">All</option>
              {searchExpressionsList && searchExpressionsList.map((e, i) => {
                  return (<option key={e.expression + "-" + i} value={e.expression}>{e.authorTitle}: {e.expressionTitle}</option>)
                })
              }
            </Form.Control>
          </InputGroup>
        </div>
      }
      <InputGroup.Prepend size="sm" className="mb-2">
        {props.children}
        {props.showAdvancedParameters && <Button className="btn-sm" onClick={() => {setDisplayAllParameters(!displayAllParameters)}}>{displayAllParameters ? "Hide" : "Show"} More Filter Options</Button>}        
      </InputGroup.Prepend>
      
      
    </div>
  )
}

export {Search3Parameters as default}
