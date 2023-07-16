import Axios from 'axios'

export function ngramRelatedQuery(id, intersectionTotal = "4"){
  // const query = [
  //   "SELECT ?s ?start ?other ?text ?cosineScore ",
  //     "WHERE {",
  //       "BIND (<" + id + "> as ?start) . ",
  //       "{",
  //       "?s <http://www.w3.org/ns/oa#hasSource> ?start .",
  //       "?s <http://www.w3.org/ns/oa#hasTarget> ?other .",
  //       "?s <http://www.w3.org/ns/oa#hasBody> ?bn .",
  //       "?bn <http://www.w3.org/1999/02/22-rdf-syntax-ns#value> ?text .",
  //       "}",
  //       "UNION",
  //       "{",
  //       "?s <http://www.w3.org/ns/oa#hasSource> ?other .",
  //       "?s <http://www.w3.org/ns/oa#hasTarget> ?start . ",
  //       "?s <http://www.w3.org/ns/oa#hasBody> ?bn .",
  //       "?bn <http://www.w3.org/1999/02/22-rdf-syntax-ns#value> ?text .",
  //       "}",
  //       "?s <http://scta.info/property/cosineScore> ?cosineScore ." ,
  //       "FILTER (?cosineScore >= " + cosineScoreLimit + ") ",
  //     "}",
  //     "ORDER BY DESC(?cosineScore) ",
  //     "LIMIT 100"].join(' ')


    // const query = [
    //   "SELECT ?start ?target ?targetLongTitle ?cosineScore ?intersectionTotal ?cosineScoreIntersection ?targetItem ?author ?authorTitle ",
    //     "WHERE {",
    //       "VALUES ?start { <"  + id + "> }",
    //       "{",
    //       "?start <http://scta.info/property/hasCosineSimilarity> ?bn . ",
    //       "?bn <http://scta.info/property/target> ?target . ",
    //       "?bn <http://scta.info/property/cosineScore> ?cosineScore . ",
    //       "?bn <http://scta.info/property/cosineScoreIntersection> ?cosineScoreIntersection . ",
    //       "?bn <http://scta.info/property/cosineScoreIntersectionOverBase> ?cosineScoreIntersectionOverBase . ",
    //       "?bn <http://scta.info/property/cosineScoreIntersectionOverCompare> ?cosineScoreIntersectionOverCompare . ",
    //       "?bn <http://scta.info/property/intersectionTotal> ?intersectionTotal . ",
    //       "FILTER (?cosineScore >= " + cosineScoreFilter + ") .",
    //       //"FILTER (?cosineScoreIntersection >= " + cosineScoreFilter + ") ",
    //       "FILTER (?intersectionTotal >= " + intersectionTotal + ") .",
    //       "}",
    //       "UNION",
    //       "{",
    //       "?target <http://scta.info/property/hasCosineSimilarity> ?bn . ",
    //       "?bn <http://scta.info/property/target> ?start . ",
    //       "?bn <http://scta.info/property/cosineScore> ?cosineScore . ",
    //       "?bn <http://scta.info/property/cosineScoreIntersection> ?cosineScoreIntersection . ",
    //       "?bn <http://scta.info/property/cosineScoreIntersectionOverBase> ?cosineScoreIntersectionOverBase . ",
    //       "?bn <http://scta.info/property/cosineScoreIntersectionOverCompare> ?cosineScoreIntersectionOverCompare . ",
    //       "?bn <http://scta.info/property/intersectionTotal> ?intersectionTotal . ",
    //       "FILTER (?cosineScore >= " + cosineScoreFilter + ") .",
    //       //"FILTER (?cosineScoreIntersection >= " + cosineScoreFilter + ") ",
    //       "FILTER (?intersectionTotal >= " + intersectionTotal + ") .",
    //       "}",
    //       "?target <http://scta.info/property/longTitle> ?targetLongTitle . ",
    //       "?target <http://scta.info/property/totalOrderNumber> ?targetTotalOrderNumber . ",
    //       "?target <http://scta.info/property/isPartOfStructureItem> ?targetItem . ",
    //       "?targetItem <http://scta.info/property/isPartOfTopLevelExpression> ?topLevel . ",
    //       "?targetItem <http://scta.info/property/totalOrderNumber> ?targetItemTotalOrderNumber .",
    //       //expression && "FILTER(?topLevel = <" + expression + ">) . ",
    //       //expression && "?target <http://scta.info/property/isMemberOf> <" + expression + "> . ",
    //       //expressionType && "?target <http://scta.info/property/isMemberOf> ?member . ?member <http://scta.info/property/expressionType> <" + expressionType + "> .",
    //       //workGroup && "<" + workGroup + "> <http://scta.info/property/hasExpression> ?topLevel  .",
    //       "OPTIONAL{",
    //       "?topLevel <http://www.loc.gov/loc.terms/relators/AUT> ?author . ",
    //       "?author <http://purl.org/dc/elements/1.1/title> ?authorTitle . ",
    //       "}",
    //       "}",
    //       "ORDER BY DESC(?intersectionTotal) DESC(?cosineScore)",
    //       //"ORDER BY ?authorTitle ?topLevel ?targetItemTotalOrderNumber ?targetTotalOrderNumber"
    //       //"LIMIT 1000",
    //       //"OFFSET 2000"
    //     ].join(' ')

    const query = `SELECT (COUNT(*) as ?count) ?start ?target ?longTitle ?author ?authorTitle
            WHERE {
              VALUES ?start { <${id}> }
              ?ngram <http://scta.info/property/isFoundIn> ?start .
              ?ngram <http://scta.info/property/isFoundIn> ?target .
              FILTER(?start != ?target) .
              ?target <http://scta.info/property/longTitle> ?longTitle .
              ?target <http://scta.info/property/isPartOfStructureItem> ?targetItem .
              ?targetItem <http://scta.info/property/isPartOfTopLevelExpression> ?topLevel .
              OPTIONAL{
              ?topLevel <http://www.loc.gov/loc.terms/relators/AUT> ?author .
              ?author <http://purl.org/dc/elements/1.1/title> ?authorTitle . 
                OPTIONAL{
                ?author <http://scta.info/property/dateOfBirth> ?authorBirthDate .
                }
              }
            }
            GROUP BY ?start ?target ?longTitle ?targetItem ?topLevel ?author ?authorTitle ?authorBirthDate
            HAVING (?count >= ${intersectionTotal})
            ORDER BY ?authorTitle ?longTitle`

 return query
}

export function ngramFragmentQuery(ngramIds, intersectionTotal = "4"){
  const query = `SELECT (COUNT(*) as ?count) ?target ?longTitle ?author ?authorTitle
            WHERE {
              VALUES ?ngram { ${ngramIds} }
              ?ngram <http://scta.info/property/isFoundIn> ?target .
              ?target <http://scta.info/property/longTitle> ?longTitle .
              ?target <http://scta.info/property/isPartOfStructureItem> ?targetItem .
              ?targetItem <http://scta.info/property/isPartOfTopLevelExpression> ?topLevel .
              OPTIONAL{
              ?topLevel <http://www.loc.gov/loc.terms/relators/AUT> ?author .
              ?author <http://purl.org/dc/elements/1.1/title> ?authorTitle . 
                OPTIONAL{
                ?author <http://scta.info/property/dateOfBirth> ?authorBirthDate .
                }
              }
            }
            GROUP BY ?target ?longTitle ?targetItem ?topLevel ?author ?authorTitle ?authorBirthDate
            HAVING (?count >= ${intersectionTotal})
            ORDER BY ?authorTitle ?longTitle`
 return query
}

export function runNgramQuery(query){
  const sparqlEndpoint = "https://ngram.scta.info/ds/query"
  const queryPromise = Axios.get(sparqlEndpoint, { params: { "query": query, "output": "json" } })
  return queryPromise
}