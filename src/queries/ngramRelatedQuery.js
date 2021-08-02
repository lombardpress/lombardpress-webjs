import Axios from 'axios'

export function ngramRelatedQuery(id, cosineScoreLimit = ".05"){
  const query = [
    "SELECT ?s ?start ?other ?text ?cosineScore ",
      "WHERE {",
        "BIND (<" + id + "> as ?start) . ",
        "{",
        "?s <http://www.w3.org/ns/oa#hasSource> ?start .",
        "?s <http://www.w3.org/ns/oa#hasTarget> ?other .",
        "?s <http://www.w3.org/ns/oa#hasBody> ?bn .",
        "?bn <http://www.w3.org/1999/02/22-rdf-syntax-ns#value> ?text .",
        "}",
        "UNION",
        "{",
        "?s <http://www.w3.org/ns/oa#hasSource> ?other .",
        "?s <http://www.w3.org/ns/oa#hasTarget> ?start . ",
        "?s <http://www.w3.org/ns/oa#hasBody> ?bn .",
        "?bn <http://www.w3.org/1999/02/22-rdf-syntax-ns#value> ?text .",
        "}",
        "?s <http://scta.info/property/cosineScore> ?cosineScore ." ,
        "FILTER (?cosineScore >= " + cosineScoreLimit + ") ",
      "}",
      "ORDER BY DESC(?cosineScore) ",
      "LIMIT 100"].join(' ')
 return query
}

export function runNgramQuery(query){
  const sparqlEndpoint = "http://localhost:3030/ds/query"
  const queryPromise = Axios.get(sparqlEndpoint, { params: { "query": query, "output": "json" } })
  return queryPromise
}