import React from 'react';
import {Link} from 'react-router-dom';
import Axios from 'axios'

export function retrieveExpressionResults(searchTerm, searchEid){
  const expressionShortId = searchEid === "all" ? searchEid : searchEid.split("/resource/")[1]
  const url = "https://exist.scta.info/exist/apps/scta-app/jsonsearch/json-search-text-by-expressionid.xq?query=" + searchTerm + "&expressionid=" + expressionShortId
  const queryPromise = Axios.get(url)
  return queryPromise
}
export function retrieveAuthorResults(searchTerm, searchAuthor){
  const authorShortId = searchAuthor.split("/resource/")[1]
  const url = "https://exist.scta.info/exist/apps/scta-app/jsonsearch/json-search-text-by-authorid.xq?query=" + searchTerm + "&authorid=" + authorShortId
  const queryPromise = Axios.get(url)
  return queryPromise

}

export function displayTextResults(results){
  if (!results){
    return (<div>
      <p>No results found</p>
    </div>)
  }
  else if (results.length > 1){
    const textResults = results.map((r, i) => {
      return (
        <div key={i}>
        <p><Link to={"/text?resourceid=http://scta.info/resource/" + r.pid}>{r.pid}</Link></p>
        <p dangerouslySetInnerHTML={{ __html: r.text}}/>
        </div>
      )

    })
  return textResults
  }
  else if (results){
    return (
      <div key={results.pid}>
      <p><Link to={"/text?resourceid=http://scta.info/resource/" + results.pid}>{results.pid}</Link></p>
      <p dangerouslySetInnerHTML={{ __html: results.text}}/>
      </div>
    )
  }
  else{
    return (
      <div><p>No results</p></div>
    )
  }
}

export function displayQuestionResults(results, searchParameters){
  const displayResults = results.map((r, i) => {
    return (
    <div key={r.resource.value + "-" + i}>
      <p><Link to={"/text?resourceid=" + r.author.value}>{r.authorTitle.value}</Link>: <Link to={"/text?resourceid=" + r.resource.value}>{r.longTitle.value}</Link></p>
      <p>{r.qtitle.value.toLowerCase().replace(searchParameters.searchTerm.toLowerCase(), searchParameters.searchTerm.toUpperCase())}</p>
    </div>
    )
  })
  return displayResults
}
