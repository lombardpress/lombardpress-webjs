import React, {useState, useEffect} from 'react';

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
  const [scoreMinimumInput, setScoreMinimumInput] = useState(".02")
  const [scoreMinimumUse, setScoreMinimumUse] = useState(".02")
  useEffect(() => {
    const ngramRelated = runNgramQuery(ngramRelatedQuery(props.resourceid, scoreMinimumUse));
    const expressions = [];
    ngramRelated.then((d) => {
      const bindings = d.data.results.bindings
      bindings.forEach((r) => {
        expressions.push({
          id: r.other.value,
          relationLabel: "ngram: " + r.text.value,
          referringResource: "",
          author: "",
          authorTitle: "",
          longTitle: "",
          show: false,
          isRelatedToRange: ""
        })
      })
      setRelatedExpressions(expressions)
    })
    
  }, [props.resourceid, scoreMinimumUse])
  
  const displayExpressions = () => {
    const displayExpressions = relatedExpressions.map((i, index) => {
      return (
      <div key={index + "-ngram-" + i.id}>
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
      
      <input type="text" value={scoreMinimumInput} onChange={(e) => setScoreMinimumInput(e.target.value)}></input>
      <button onClick={() => {setScoreMinimumUse(scoreMinimumInput)}}>Re-run Query with new minimum</button>

      
      {relatedExpressions === "retrieving" ? <Spinner/> : displayExpressions()}
    </div>
  )
}
export default NgramDisplay;