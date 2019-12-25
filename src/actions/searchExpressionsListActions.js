import Axios from 'axios'
import {sparqlEndpoint} from '../components/config';

export var startExpressionsFetch = () => {
  return{
    type: "START_EXPRESSIONS_FETCH"
  };
};
export var completeExpressionsFetch = (expressions) => {
  return{
    type: "COMPLETE_EXPRESSIONS_FETCH",
    expressions
  };
};
export var fetchExpressionsList = (searchParameters, dispatch) =>{
    var workGroupSparql = ""
    if (searchParameters.workGroup){
      workGroupSparql = [
      "<http://scta.info/resource/" + searchParameters.workGroup + "> <http://scta.info/property/hasExpression> ?expression ."
      ].join('');
    }
    let expressionAuthorTypeSparql = ""
    if (searchParameters.expressionAuthorType){
      expressionAuthorTypeSparql = [
      "?expression <http://www.loc.gov/loc.terms/relators/AUT> ?expressionAuthor . ",
      "?expressionAuthor <http://scta.info/property/personType> <http://scta.info/resource/" + searchParameters.expressionAuthorType + "> ."
      ].join('');
    }

    var authorSparql = ""
    if (searchParameters.searchAuthor){
      authorSparql = [
      "?expression <http://www.loc.gov/loc.terms/relators/AUT> <" + searchParameters.searchAuthor + "> ."
      ].join('');
    }
    var query = [
        "SELECT ?type ?expression ?expressionShortId ?expressionTitle ?author ?authorTitle ?workGroup ?workGroupTitle",
        "WHERE { ",
          "?expression a <http://scta.info/resource/expression> .",
          "?expression a ?type .",
          "?expression <http://scta.info/property/level> '1' . ",
          expressionAuthorTypeSparql,
          workGroupSparql,
          authorSparql,
          "?expression <http://scta.info/property/shortId> ?expressionShortId .",
          "?expression <http://scta.info/property/shortId> ?expressionShortId .",
          "?expression <http://purl.org/dc/elements/1.1/title> ?expressionTitle .",
          "?expression <http://www.loc.gov/loc.terms/relators/AUT> ?author . ",
          "?author <http://purl.org/dc/elements/1.1/title> ?authorTitle .",
          "?expression <http://purl.org/dc/terms/isPartOf> ?workGroup .",
          "?workGroup <http://purl.org/dc/elements/1.1/title> ?workGroupTitle .",
          "}",
        "ORDER BY ?expressionTitle"].join('');

  dispatch(startExpressionsFetch());
  Axios.get(sparqlEndpoint, {params: {"query" : query, "output": "json"}}).then(function(res){
    console.log("async firing")
    var results = res.data.results.bindings;
    var searchWorks = results.map((result) => {
      var workInfo = {
          expression: result.expression.value,
          expressionShortId: result.expressionShortId ? result.expressionShortId.value : "",
          expressionTitle: result.expressionTitle.value,
          workGroup: result.workGroup ? result.workGroup.value : "",
          workGroupTitle: result.workGroupTitle ? result.workGroupTitle.value : "",
          author: result.author ? result.author.value : "",
          authorTitle: result.author ? result.authorTitle.value : "",
          type: result.type.value

        }
        return workInfo

      });
      dispatch(completeExpressionsFetch(searchWorks));
    });

};
