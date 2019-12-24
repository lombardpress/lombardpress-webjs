import React, {useState, useEffect} from 'react';
import Spinner from './Spinner';
import {Link} from 'react-router-dom';

import {runQuery} from './utils'
import {questionTitleQuery} from '../queries/questionTitleQuery'

function Search2(props) {
  const [searchParameters, setSearchParameters] = useState({})
  // this should move to separate component, with context and reducer.
  // search should get all update parameters from context and run search
  const [searchTerm, setSearchTerm] = useState("")
  const [searchAuthor, setSearchAuthor] = useState("")
  const [searchEid, setSearchEid] = useState("")

  const [results, setResults] = useState([])
  const handleSetSearchParameters = (e) => {
    e.preventDefault()
    setSearchParameters({
      searchTerm,
      searchAuthor: searchAuthor ? "http://scta.info/resource/" + searchAuthor : "",
      searchEid: searchEid ? "http://scta.info/resource/" + searchEid : ""
    })
  }
  useEffect(() => {
    console.log("searchTerm", searchTerm)
    console.log("searchParameters", searchParameters)
    const questionResults = runQuery(questionTitleQuery(searchParameters))
    questionResults.then((d) => {
      console.log(d)
      setResults(d.data.results.bindings)
    })
  }, [searchParameters])
  return(
    <div>
    <form onSubmit={handleSetSearchParameters}>
      <input value={searchTerm} placeholder="search term" onChange={(e) => setSearchTerm(e.target.value)}/>
      <input value={searchAuthor} placeholder="author term"onChange={(e) => setSearchAuthor(e.target.value)}/>
      <input value={searchEid} placeholder="eid term" onChange={(e) => setSearchEid(e.target.value)}/>
      <button>Submit</button>
    </form>
    {results ? results.map((r) => (
      <div key={r.resource.value}>
        <p><Link to={"/text?resourceid=" + r.author.value}>{r.authorTitle.value}</Link>: <Link to={"/text?resourceid=" + r.resource.value}>{r.resourceTitle.value}</Link></p>
        <p>{r.qtitle.value.toLowerCase().replace(searchTerm, searchTerm.toUpperCase())}</p>
      </div>
    ))
    :
    <Spinner/>
    }
    </div>
  )
}

export {Search2 as default}
