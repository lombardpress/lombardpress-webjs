import Axios from 'axios'
import {sparqlEndpoint} from '../components/config';

export var startExpressionTypesListFetch = () => {
  return{
    type: "START_EXPRESSION_TYPES_LIST_FETCH"
  };
};
export var completeExpressionTypesListFetch = (expressionTypes) => {
  return{
    type: "COMPLETE_EXPRESSION_TYPES_LIST_FETCH",
    expressionTypes
  };
};
export var fetchExpressionTypesList = (searchParameters, dispatch) =>{
  let authorQuery = "";
    if (searchParameters.searchAuthor){
      authorQuery = [
      "?workGroup <http://scta.info/property/hasExpression> ?expression .",
      "?expression <http://www.loc.gov/loc.terms/relators/AUT> <" + searchParameters.searchAuthor + "> ."
      ].join('');
    }

    var query = [
        "SELECT DISTINCT ?expressionType ?expressionTypeTitle ",
        "WHERE { ",
        "?expressionType a <http://scta.info/resource/expressionType> .",
        "?expressionType <http://purl.org/dc/elements/1.1/title> ?expressionTypeTitle .",
        "}",
        "ORDER BY ?expressionTypeTitle"].join(' ');
  dispatch(startExpressionTypesListFetch());
  Axios.get(sparqlEndpoint, {params: {"query" : query, "output": "json"}}).then(function(res){
    console.log("async firing expressionTypes", res)
    const results = res.data.results.bindings;
    const expressionTypes = results.map((result) => {
        return {
          expressionType: result.expressionType.value,
          expressionTypeTitle: result.expressionTypeTitle.value,
        }
      });
      dispatch(completeExpressionTypesListFetch(expressionTypes));
    });
  };
