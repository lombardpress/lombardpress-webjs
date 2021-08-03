import React, {useState, useEffect} from 'react';
import {getCodexInfo, getCodexInfoFromSurface, getCodexInfoFromCanvas, getCodexInfoFromManifest} from './Queries'
import {Link} from 'react-router-dom';
import {runQuery} from './utils'

function CodexToc(props) {
  const [items, setItems] = useState([])
  const retrieveCodexInfo = (id, type) => {
    
    let codexInfo = undefined
    if (type === "surface"){
      codexInfo = runQuery(getCodexInfoFromSurface(id))
    }
    else if (type === "canvas"){
      codexInfo = runQuery(getCodexInfoFromCanvas(id))
    }
    else if (type === "manifest"){
      codexInfo = runQuery(getCodexInfoFromManifest(id))
    }
    else{
      codexInfo = runQuery(getCodexInfo(id))
    }
    codexInfo.then((d) => {
      console.log("id", id, "type", type, "data", d)
      const data = d.data.results.bindings
      if (data.length > 0 && data[0].surface){
        const expressionIdMap = data.map((d) => {
          return d.expression ? d.expression.value : ""
        })
        var unique = expressionIdMap.filter((v, i, a) => a.indexOf(v) === i);
        let expressionList = {}
        unique.forEach((e) => {
           expressionList[e] = []
        })
        data.forEach((d) => {
            const info = {
              expression: d.expression.value,
              expressionTitle: d.item_expression_title.value,
              manifestation: d.manifestation.value,
              surface: d.surface.value,
              surfaceTitle: d.surface_title.value,
              questionTitle: d.item_expression_question_title ? d.item_expression_question_title.value : ''
            }
          expressionList[d.expression.value].push(info)
        })
        // let focusedSurface = "";
        // if (type === "surface"){
        //    focusedSurface = id
        //  }
        //  else if (type === "canvas"){
        //    focusedSurface = data[0].surfaceFocus.value
        //  }
        //  else{
        //    focusedSurface = data[0].surface.value
        //  }
         setItems(expressionList)
        ///this.setState({items: expressionList, focusedSurface: focusedSurface})

      }
    })
  }
  useEffect(() => {
    retrieveCodexInfo(props.resourceid, props.codexResourceType)
    // eslint-disable-next-line
  }, [props.resourceid])
    
  const displayItems = () => {
      const displayItems = Object.keys(items).map((key) => {
        return (
          <p key={items[key][0].expression}>
          <span>
          <Link to={"/text?resourceid=" + items[key][0].surface}>{items[key][0].surfaceTitle}</Link>
          -
          <Link to={"/text?resourceid=" + items[key][items[key].length - 1].surface}>{items[key][items[key].length - 1].surfaceTitle}</Link>
          </span>{": "}
          <Link to={"/text?resourceid=" + items[key][0].manifestation}>{items[key][0].expressionTitle}</Link>{": "}
          {items[key][0].questionTitle && items[key][0].questionTitle}
          </p>

        )
      })
      return displayItems
    }
  return (
    <div className={props.hidden ? "hidden" : "showing"}>
      {displayItems()}
    </div>
    );
}

export default CodexToc;