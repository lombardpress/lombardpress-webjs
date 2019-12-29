import React, {useState, useEffect, useReducer} from 'react';
import searchParametersReducer from '../reducers/searchParametersReducer'
import searchParametersContext from '../contexts/searchParametersContext'
import * as searchParametersActions from '../actions/searchParametersActions'
import searchExpressionsListReducer from '../reducers/searchExpressionsListReducer'
import * as searchExpressionsListActions from '../actions/searchExpressionsListActions'
import searchAuthorsListReducer from '../reducers/searchAuthorsListReducer'
import * as searchAuthorsListActions from '../actions/searchAuthorsListActions'
import searchWorkGroupsListReducer from '../reducers/searchWorkGroupsListReducer'
import * as searchWorkGroupsListActions from '../actions/searchWorkGroupsListActions'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {runQuery} from './utils'
import {questionTitleQuery} from '../queries/questionTitleQuery'
import Spinner from './Spinner';
import {Link} from 'react-router-dom';

const Search3Parameters = (props) => {
  const [searchType, setSearchType] = useState(props.searchType ? props.searchType : "questionTitles")
  const [searchTerm, setSearchTerm] = useState("")
  const [searchAuthor, setSearchAuthor] = useState(props.searchAuthor)
  const [searchEid, setSearchEid] = useState(props.searchEid)
  const [searchWorkGroup, setSearchWorkGroup] = useState(props.searchWorkGroup)
  const [searchExpressionsList, searchExpressionsListDispatch] = useReducer(searchExpressionsListReducer, [])
  const [searchAuthorsList, searchAuthorsListDispatch] = useReducer(searchAuthorsListReducer, [])
  const [searchWorkGroupsList, searchWorkGroupsListDispatch] = useReducer(searchWorkGroupsListReducer, [])
  const searchParameters = {searchTerm, searchAuthor, searchEid, searchWorkGroup, searchType}

  const [displayAllParameters, setDisplayAllParameters] = useState(false)

  const handleSetSearchParameters = () => {
    props.handleSetSearchParameters(searchParameters)
  }

  useEffect(() => {
    handleSetSearchParameters()
  }, [searchParameters])
  useEffect(() => {
    searchExpressionsListDispatch(searchExpressionsListActions.fetchExpressionsList(searchParameters, searchExpressionsListDispatch))
    searchAuthorsListDispatch(searchAuthorsListActions.fetchAuthorsList(searchParameters, searchAuthorsListDispatch))
    searchWorkGroupsListDispatch(searchWorkGroupsListActions.fetchWorkGroupsList(searchParameters, searchWorkGroupsListDispatch))
  }, [])
  useEffect(() => {
    searchExpressionsListDispatch(searchExpressionsListActions.fetchExpressionsList(searchParameters, searchExpressionsListDispatch))
    searchWorkGroupsListDispatch(searchWorkGroupsListActions.fetchWorkGroupsList(searchParameters, searchWorkGroupsListDispatch))
  }, [searchAuthor])
  useEffect(() => {
    searchExpressionsListDispatch(searchExpressionsListActions.fetchExpressionsList(searchParameters, searchExpressionsListDispatch))
    searchAuthorsListDispatch(searchAuthorsListActions.fetchAuthorsList(searchParameters, searchAuthorsListDispatch))

  }, [searchWorkGroup])


  return(
    <div>
      <Form.Group>
        {props.showLabels && <Form.Label>Search Term</Form.Label>}
        <Form.Control as="input" type="text" placeholder="search term " onChange={(e) => setSearchTerm(e.target.value)} value={searchParameters.searchTerm}/>
      </Form.Group>
      {displayAllParameters &&
        <div>
        <Form.Group>
          <Form.Label>Search Type</Form.Label>
            <Form.Control as="select" onChange={(e) => {setSearchType(e.target.value)}} value={searchParameters.searchType}>
              <option value="questionTitles">Questions Titles</option>
              <option value="text">Text</option>
            </Form.Control>
        </Form.Group>
          <Form.Group>
            <Form.Label>Work Group</Form.Label>
              <Form.Control as="select" onChange={(e) => {setSearchWorkGroup(e.target.value)}} value={searchParameters.searchWorkGroup}>
                <option value="">All</option>
                {searchWorkGroupsList && searchWorkGroupsList.map((e, i) => {
                    return (<option key={e.workGroup + "-" + i} value={e.workGroup}>{e.workGroupTitle}</option>)
                  })
                }
              </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Author</Form.Label>
              <Form.Control as="select" onChange={(e) => {setSearchAuthor(e.target.value)}} value={searchParameters.searchAuthor}>
                <option value="">All</option>
                {searchAuthorsList && searchAuthorsList.map((e, i) => {
                    return (<option key={e.author + "-" + i} value={e.author}>{e.authorTitle}</option>)
                  })
                }
              </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Text</Form.Label>
              <Form.Control as="select" onChange={(e) => {setSearchEid(e.target.value)}} value={searchParameters.searchEid}>
                <option value="">All</option>
                {searchExpressionsList && searchExpressionsList.map((e, i) => {
                    return (<option key={e.expression + "-" + i} value={e.expression}>{e.authorTitle}: {e.expressionTitle}</option>)
                  })
                }
              </Form.Control>
          </Form.Group>
        </div>
      }
      {props.showAdvancedParameters && <Button onClick={() => {setDisplayAllParameters(!displayAllParameters)}}>{displayAllParameters ? "Hide" : "Show"} Filter Options</Button>}
    </div>
  )
}

export {Search3Parameters as default}
