import React, {useState, useEffect, useReducer} from 'react';
import searchParametersReducer from '../reducers/searchParametersReducer'
import searchParametersContext from '../contexts/searchParametersContext'
import * as searchParametersActions from '../actions/searchParametersActions'
import searchExpressionsListReducer from '../reducers/searchExpressionsListReducer'
import * as searchExpressionsListActions from '../actions/searchExpressionsListActions'
import searchAuthorsListReducer from '../reducers/searchAuthorsListReducer'
import * as searchAuthorsListActions from '../actions/searchAuthorsListActions'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {runQuery} from './utils'
import {questionTitleQuery} from '../queries/questionTitleQuery'
import Spinner from './Spinner';
import {Link} from 'react-router-dom';

const Search3Parameters = (props) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchAuthor, setSearchAuthor] = useState(props.searchAuthor)
  const [searchEid, setSearchEid] = useState(props.searchEid)
  const [searchExpressionsList, searchExpressionsListDispatch] = useReducer(searchExpressionsListReducer, [])
  const [searchAuthorsList, searchAuthorsListDispatch] = useReducer(searchAuthorsListReducer, [])
  const searchParameters = {searchTerm, searchAuthor, searchEid}

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
  }, [])
  useEffect(() => {
    searchExpressionsListDispatch(searchExpressionsListActions.fetchExpressionsList(searchParameters, searchExpressionsListDispatch))
  }, [searchAuthor])


  return(
    <div>
      <Form.Group>
        {props.showLabels && <Form.Label>Search Term in Question Titles</Form.Label>}
        <Form.Control as="input" type="text" placeholder="search term in question titles" onChange={(e) => setSearchTerm(e.target.value)} value={searchParameters.searchTerm}/>
      </Form.Group>
      {displayAllParameters &&
        <div>
          <Form.Group>
            <Form.Label>Author</Form.Label>
              <Form.Control as="select" onChange={(e) => {setSearchAuthor(e.target.value)}} value={searchParameters.searchAuthor}>
                <option value="">All</option>
                {searchAuthorsList && searchAuthorsList.map((e) => {
                    return (<option key={e.author} value={e.author}>{e.authorTitle}</option>)
                  })
                }
              </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Text</Form.Label>
              <Form.Control as="select" onChange={(e) => {setSearchEid(e.target.value)}} value={searchParameters.searchEid}>
                <option value="">All</option>
                {searchExpressionsList && searchExpressionsList.map((e) => {
                    return (<option key={e.expression} value={e.expression}>{e.expressionTitle}</option>)
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
