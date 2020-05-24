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


const Search3Parameters = (props) => {
  const [searchType, setSearchType] = useState(props.searchType ? props.searchType : "questionTitles")
  const [searchTerm, setSearchTerm] = useState("")
  const [searchAuthor, setSearchAuthor] = useState(props.searchAuthor)
  const [searchEid, setSearchEid] = useState(props.searchEid)
  const [searchEType, setSearchEType] = useState(props.searchEType)
  const [searchWorkGroup, setSearchWorkGroup] = useState(props.searchWorkGroup)

  const [searchExpressionTypesList, searchExpressionTypesListDispatch] = useReducer(searchExpressionTypesListReducer, [])
  const [searchExpressionsList, searchExpressionsListDispatch] = useReducer(searchExpressionsListReducer, [])
  const [searchAuthorsList, searchAuthorsListDispatch] = useReducer(searchAuthorsListReducer, [])
  const [searchWorkGroupsList, searchWorkGroupsListDispatch] = useReducer(searchWorkGroupsListReducer, [])
  const searchParameters = {searchTerm, searchAuthor, searchEid, searchWorkGroup, searchType, searchEType}

  const [displayAllParameters, setDisplayAllParameters] = useState(false)

  const handleSetSearchParameters = () => {
    props.handleSetSearchParameters(searchParameters)
  }

  //begin effects to update hooks when props change
  // perhaps this could be comined into a single custom hood
  useEffect(() => {
    setSearchType(props.searchType ? props.searchType : "questionTitles")
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
  //end effects to update hooks when props change
  //begin other effects
  useEffect(handleSetSearchParameters, [searchTerm, searchAuthor, searchEid, searchWorkGroup, searchType, searchEType])
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
      <Form.Group>
        {props.showLabels && <Form.Label>Search Term</Form.Label>}
        <Form.Control as="input" type="text" placeholder="search term" onChange={(e) => setSearchTerm(e.target.value)} value={searchParameters.searchTerm}/>
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
            <Form.Label>ExpressionType</Form.Label>
              <Form.Control as="select" onChange={(e) => {setSearchEType(e.target.value)}} value={searchParameters.searchEType}>
                <option value="">All</option>
                {searchExpressionTypesList && searchExpressionTypesList.map((e, i) => {
                    return (<option key={e.expressionType + "-" + i} value={e.expressionType}>{e.expressionTypeTitle}</option>)
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
