import React, {useState, useEffect} from 'react';

import {Link} from 'react-router-dom';

import TextCompare from './TextCompare'
import Spinner from './Spinner'
import {ngramRelatedQuery} from '../queries/ngramRelatedQuery'
import {runNgramQuery} from '../queries/ngramRelatedQuery'

/**
 * 
 * A comment wrapper for submitting comments to local storage test
 * @public
 */

function NgramDisplay(props) {
  const [relatedExpressions, setRelatedExpressions] = useState([])
  //const [scoreMinimumInput, setScoreMinimumInput] = useState(".02")
  //const [scoreMinimumUse, setScoreMinimumUse] = useState(".02")
  useEffect(() => {
    const ngramRelated = runNgramQuery(ngramRelatedQuery(props.resourceid));
    const expressions = [];
    ngramRelated.then((d) => {
      const bindings = d.data.results.bindings
      bindings.forEach((r) => {
        expressions.push({
          id: r.target.value,
          relationLabel: "cosineSimilarity: " + (parseFloat(r.cosineScore.value) * 100).toFixed(2) + "% | cosineIntersection:" + r.intersectionTotal.value,
          referringResource: "",
          author: r.author ? r.author.value : "",
          authorTitle: r.authorTitle ? r.authorTitle.value : "",
          longTitle: r.targetLongTitle ? r.targetLongTitle.value : "",
          show: false,
          isRelatedToRange: ""
        })
      })
      setRelatedExpressions(expressions)
    })
    
  }, [props.resourceid])
  
  const displayExpressions = () => {
    const displayExpressions = relatedExpressions.map((i, index) => {
      const marked = props.markedExpressions.find((e) => e.parentBlock === i.id)
      return (
      
      <div key={index + "-ngram-" + i.id}>
        {marked && <span style={{fontSize: "12px", paddingLeft: "2px", marginLeft: "3px", borderLeft: "3px solid purple"}}>Already Marked via <Link to={"/text?resourceid=" + marked.id}>{marked.id}</Link></span>}
            {<TextCompare
              info={props.info}
              expressionid={i.id}
              relationLabel={i.relationLabel}
              referringResource={i.referringResource}
              author={i.author}
              authorTitle={i.authorTitle}
              longTitle={i.longTitle}
              isMainText={false}
              handleChangeBase={props.handleChangeBase}
              baseText={props.baseText}
              show={i.show}
              surfaceWidth={props.surfaceWidth}
              isRelatedToRange={i.isRelatedToRange}
            />}
          </div>
          )
    })
    return displayExpressions
  }
  return(
    <div>
      <hr/>
      <p>Potential Related Passages</p>
      
      {/* <input type="text" value={scoreMinimumInput} onChange={(e) => setScoreMinimumInput(e.target.value)}></input>
      <button onClick={() => {setScoreMinimumUse(scoreMinimumInput)}}>Re-run Query with new minimum</button> */}
      {relatedExpressions === "retrieving" ? <Spinner/> : displayExpressions()}
    </div>
  )
}
export default NgramDisplay;