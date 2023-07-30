import React, {useState, useEffect} from 'react';

import {Link} from 'react-router-dom';

import TextCompare from './TextCompare'
import Spinner from './Spinner'
import {ngramRelatedQuery} from '../queries/ngramRelatedQuery'
import {ngramFragmentQuery} from '../queries/ngramRelatedQuery'
import {runNgramQuery} from '../queries/ngramRelatedQuery'
import {textClean} from './utils'

/**
 * 
 * A comment wrapper for submitting comments to local storage test
 * @public
 */

const createExpressionsList = (bindings) => {
  const expressions = [];
  bindings.forEach((r) => {
    expressions.push({
      id: r.target.value,
      relationLabel: "Ngram Intersections:" + r.count.value,
      referringResource: "",
      author: r.author?.value,
      authorTitle: r.authorTitle?.value,
      longTitle: r.longTitle?.value,
      show: false,
      isRelatedToRange: ""
    })
  })
  return expressions
}

function NgramDisplay(props) {
  const [relatedExpressions, setRelatedExpressions] = useState([])
  const [intersectionTotal, setIntersectionTotal] = useState(4)
  useEffect(() => {
    // if targetRange is presents forces query to wait until baseText is present
    if (props.baseText && props.targetRange){
      console.log("firing1")
      const tokenizedText = textClean(props.baseText).split(" ");
      const ngramArray = []  
      console.log("baseText", props.baseText)
      console.log("tokenizedText", tokenizedText)
      // create a for loop the length of the number of words props.baseText
      for (let i = 0; i < (tokenizedText.length - 3); i++){
        const ngramId = `<http://scta.info/resource/ngram/${tokenizedText.slice(i, (i + 4)).join("")}>`
        ngramArray.push(ngramId)
      }
      const ngramRelated = runNgramQuery(ngramFragmentQuery(ngramArray.join(" "), intersectionTotal));
      ngramRelated.then((d) => {
        const bindings = d.data.results.bindings;
        const expressions = createExpressionsList(bindings);
        setRelatedExpressions(expressions)
      })
    }
    // NOTE: prevents general query if a targetRange is present
    // TODO: probably needs to be refactored; useEffect can probably be used better
    else if (!props.targetRange){
      const ngramRelated = runNgramQuery(ngramRelatedQuery(props.resourceid, intersectionTotal));
      ngramRelated.then((d) => {
        const bindings = d.data.results.bindings
        const expressions = createExpressionsList(bindings);
        setRelatedExpressions(expressions)
      })
    }
  }, [props.resourceid, props.baseText, props.targetRange, intersectionTotal])
  
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
              handleAddCtRelatedExpressions={props.handleAddCtRelatedExpressions}
              handleShowCollationOverlay={props.handleShowCollationOverlay}
            />}
          </div>
          )
    })
    return displayExpressions
  }
  return(
    <div>
      <hr/>
      <p>
        Potential Related Passages 
        <br/>
        <span style={{"fontSize": '12px'}}>Ngram Intersection Threshold: {intersectionTotal}
          (<span className='lbp-span-link' title="increase intersection threshold" onClick={() => setIntersectionTotal(intersectionTotal + 1)}> + </span>
          {intersectionTotal > 0 && <> | <span className='lbp-span-link' title="decrease intersection threshold" onClick={() => setIntersectionTotal(intersectionTotal - 1)}> - </span></>})
        </span> 
        </p>
      
      {/* <input type="text" value={scoreMinimumInput} onChange={(e) => setScoreMinimumInput(e.target.value)}></input>
      <button onClick={() => {setScoreMinimumUse(scoreMinimumInput)}}>Re-run Query with new minimum</button> */}
      {relatedExpressions === "retrieving" ? <Spinner/> : displayExpressions()}
    </div>
  )
}
export default NgramDisplay;