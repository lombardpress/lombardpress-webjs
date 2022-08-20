import React from 'react';
import {Link} from 'react-router-dom';
import Axios from 'axios'


//TODO: these retrieves need to be refactored into; 
// if exist db api is improved then a single request should be easier

// // TODO; the following should be deleted; now that new search script has been made
// export function retrieveExpressionResults(searchTerm, searchEid){
//   const expressionShortId = searchEid === "all" ? searchEid : searchEid.split("/resource/")[1]
//   const url = "https://exist.scta.info/exist/apps/scta-app/jsonsearch/json-search-text-by-expressionid.xq?query=" + searchTerm + "&expressionid=" + expressionShortId
//   const queryPromise = Axios.get(url)
//   return queryPromise
// }
// // TODO; the following should be deleted; now that new search script has been made
// export function retrieveAuthorResults(searchTerm, searchAuthor){
//   const authorShortId = searchAuthor.split("/resource/")[1]
//   const url = "https://exist.scta.info/exist/apps/scta-app/jsonsearch/json-search-text-by-authorid.xq?query=" + searchTerm + "&authorid=" + authorShortId
//   const queryPromise = Axios.get(url)
//   return queryPromise

// }
// // TODO; the following should be deleted; now that new search script has been made
// export function retrieveWorkGroupResults(searchTerm, searchWorkGroup){
//   const workGroupShortId = searchWorkGroup.split("/resource/")[1]
//   const url = "https://exist.scta.info/exist/apps/scta-app/jsonsearch/json-search-text-by-workGroupId.xq?query=" + searchTerm + "&workGroupId=" + workGroupShortId
//   const queryPromise = Axios.get(url)
//   return queryPromise

// }
export function retrieveFigureResults(searchTerm, searchEid){
  const expressionShortId = searchEid === "all" ? searchEid : searchEid.split("/resource/")[1]
  const url = "https://exist2.scta.info/exist/apps/scta-app/jsonsearch/json-search-text-by-figure.xq?query=" + searchTerm + "&expressionid=" + expressionShortId
  const queryPromise = Axios.get(url)
  return queryPromise
}

export function retrieveSearchResults(searchTerm, searchEid, searchWorkGroup, searchAuthor, searchETypeId, searchType, offset){
  const workGroupShortId = searchWorkGroup && searchWorkGroup.split("/resource/")[1]
  const expressionShortId = searchEid && searchEid.split("/resource/")[1]
  const expressionTypeShortId = searchETypeId && searchETypeId.split("/resource/")[1]
  const authorShortId = searchAuthor && searchAuthor.split("/resource/")[1]
  const queryParameters = []
  if (expressionShortId){
    queryParameters.push("eid=" + expressionShortId)
  }
  if (expressionTypeShortId){
    queryParameters.push("etid=" + expressionTypeShortId)
  }
  if (authorShortId){
    queryParameters.push("aid=" + authorShortId)
  }
  if (workGroupShortId){
    queryParameters.push("wgid=" + workGroupShortId)
  }
  if (searchType){
    queryParameters.push("searchType=" + searchType)
  }
  if (offset){
    queryParameters.push("offset=" + offset)
  }
  const queryString = "?query=" + searchTerm + "&" + queryParameters.join("&");
  const url = "https://exist2.scta.info/exist/apps/scta-app/jsonsearch/json-search-text.xq" + queryString
  const queryPromise = Axios.get(url)
  return queryPromise
}

export function displayFigureResults(results, idTitleMap){
    if (!results || results.length === 0){
      return (<div>
        <p>No results found</p>
      </div>)
    }
    else if (results.length > 0){
      console.log("results", results)
      const figureResults = results.map((r, i) => {
        const imgurl = r.imgurl
        const longTitle = idTitleMap["http://scta.info/resource/" + r.pid] ?  idTitleMap["http://scta.info/resource/" + r.pid].longTitle : ""
          //const author = idTitleMap["http://scta.info/resource/" + r.pid] ?  idTitleMap["http://scta.info/resource/" + r.pid].author : ""
          const authorTitle = idTitleMap["http://scta.info/resource/" + r.pid] ?  idTitleMap["http://scta.info/resource/" + r.pid].authorTitle : ""
        return (
          <div key={i} className="figure-tile">
          {/* <Link to={"/text?resourceid=http://scta.info/resource/" + r.pid}><img src={imgurl} alt="figure"></img></Link> */}
          <Link to={"/text?resourceid=http://scta.info/resource/" + r.pid}>
            <span className="image-description">{authorTitle + ", " + longTitle + " (" + r.pid + ")"}</span>
            <img src={imgurl} alt="figure"></img>
          </Link>
          
          </div>
        )
      })
      return (
        <div className="figure-grid">
            {/* <p>{results.length + " results"}</p> */}
            {figureResults}
        </div>
      )
    }
    // TODO: i think this can be deleted
    // else if (results){
    //   const r = results
    //   const imgurl = r.imgurl
    //   return (
    //     <div>
    //       <p>{1 + " results"}</p>
    //       <div key={results.pid}>
    //         <p><Link to={"/text?resourceid=http://scta.info/resource/" + r.pid}>{r.pid}</Link></p>
    //         <img src={imgurl} alt="figure" style={{"width": "300px"}}></img>
    //       </div>
    //     </div>
    //     )
    //   }
    else {
      return (
        <div><p>No results</p></div>
      )
    }
  }  


export function displayTextResults(results, idTitleMap){
  if (!results || results.length === 0){
    return (<div>
      <p>No results found</p>
    </div>)
  }
  else {
      if (results.length > 0){
        const textResults = results.map((r, i) => {
          const textString = r.previous + " <span class='highlight'>" + r.hit + "</span> " + r.next
          const range = r.start + "-" + r.end
          const longTitle = idTitleMap["http://scta.info/resource/" + r.pid] ?  idTitleMap["http://scta.info/resource/" + r.pid].longTitle : ""
          //const author = idTitleMap["http://scta.info/resource/" + r.pid] ?  idTitleMap["http://scta.info/resource/" + r.pid].author : ""
          const authorTitle = idTitleMap["http://scta.info/resource/" + r.pid] ?  idTitleMap["http://scta.info/resource/" + r.pid].authorTitle : ""
          return (
            <div key={i}>
            {/* <p><Link to={"/text?resourceid=http://scta.info/resource/" + r.pid + "@" + range}>{r.pid + "@" + range}</Link></p> */}
            <p><Link to={"/text?resourceid=http://scta.info/resource/" + r.pid + "@" + range}>{authorTitle + ", " + longTitle + " (" + r.pid + "@" + range + ")"}</Link></p>
            <p dangerouslySetInnerHTML={{ __html: textString}}/>
            </div>
          )
          
        })
        return (
          <div>
              {textResults}
          </div>
        )
      }
      // don't think this is necessary now that I've forced all results to be an array 
      // else if (results){
      //   const r = results
      //   const textString = r.previous + " <span class='highlight'>" + r.hit + "</span> " + r.next
      //   const range = r.start + "-" + r.end
      //   return (
      //     <div>
      //       <p>{1 + " results"}</p>
      //     <div key={results.pid}>
      //     <p><Link to={"/text?resourceid=http://scta.info/resource/" + r.pid + "@" + range}>{r.pid + "@" + range}</Link></p>
      //     <p dangerouslySetInnerHTML={{ __html: textString}}/>
      //     </div>
      //     </div>
      //   )
      // }
      else{
        return (
          <div><p>No results</p></div>
        )
      }
  }
}

export function displayQuestionResults(results, searchParameters){
  if (results.length > 0){
    const displayResults = results.map((r, i) => {
      return (
      <div key={r.resource.value + "-" + i}>
        <p><Link to={"/text?resourceid=" + r.author.value}>{r.authorTitle.value}</Link>: <Link to={"/text?resourceid=" + r.resource.value}>{r.longTitle.value}</Link></p>
        <p>{r.qtitle.value.toLowerCase().replace(searchParameters.searchTerm.toLowerCase(), searchParameters.searchTerm.toUpperCase())}</p>
      </div>
      )
    })
    return (
      <div>
        <p>{displayResults.length + " results"}</p>
        {displayResults}
      </div>
    )
  }
  else{
    return (
      <div>
        <p>No results</p>
      </div>
    )

  }
}

export const getValueLongTitlesAndAuthors = (results) => {
  let values = []
  if (results){
    //if (results.length > 0){
      values = results.map((r) => {
        return "<http://scta.info/resource/" + r.pid + ">"
      })
    //}
    // else {
    //   values = ["<http://scta.info/resource/" + results.pid + ">"]
    // }
    const valuesString = values.join(" ")

    const query = [
      "SELECT DISTINCT ?id ?longTitle ?author ?authorTitle ",
        "{",
        "VALUES ?id {" + valuesString + "}",
        "?id <http://scta.info/property/longTitle> ?longTitle .",
        "OPTIONAL {",
          "?id <http://scta.info/property/isPartOfTopLevelExpression> ?topLevel .",
          "?topLevel <http://www.loc.gov/loc.terms/relators/AUT> ?author .",
          "?author <http://purl.org/dc/elements/1.1/title> ?authorTitle .",
        "}",
      "}"].join('')
    return query
  }
}

export const createIdTitleMap = (bindings) => {
  const idTitleMap = {}
  bindings.forEach((b) => {
    idTitleMap[b.id.value] = {
      longTitle: b.longTitle.value, 
      author: b.author && b.author.value, 
      authorTitle: b.authorTitle && b.authorTitle.value}
  })
  return idTitleMap
}
