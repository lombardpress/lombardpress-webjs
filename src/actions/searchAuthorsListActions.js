import Axios from 'axios'
import {sparqlEndpoint} from '../components/config';

export var startAuthorsFetch = () => {
  return{
    type: "START_AUTHORS_FETCH"
  };
};
export var completeAuthorsFetch = (authors) => {
  return{
    type: "COMPLETE_AUTHORS_FETCH",
    authors
  };
};
export var fetchAuthorsList = (searchParameters, dispatch) =>{
    let workGroupSparql = "";
      if (searchParameters.searchWorkGroup){
        workGroupSparql = "<" + searchParameters.searchWorkGroup + "> <http://scta.info/property/hasExpression> ?resource ."
      }
    const query = [
        "SELECT DISTINCT ?author ?authorTitle ?authorShortId ",
        "WHERE { ",
        "?author a <http://scta.info/resource/person> .",
        "?resource a <http://scta.info/resource/expression> .",
        "?resource <http://scta.info/property/level> '1' .",
        workGroupSparql,
        "?resource <http://www.loc.gov/loc.terms/relators/AUT> ?author .",
        "?author <http://scta.info/property/shortId> ?authorShortId .",
        "?author <http://purl.org/dc/elements/1.1/title> ?authorTitle .",
        "}",
        "ORDER BY ?authorTitle"].join('');
  dispatch(startAuthorsFetch());
  Axios.get(sparqlEndpoint, {params: {"query" : query, "output": "json"}}).then(function(res){
    console.log("async firing")
    var results = res.data.results.bindings;
    var authors = results.map((result) => {
        var authorInfo = {
          author: result.author.value,
          authorShortId: result.authorShortId.value,
          authorTitle: result.authorTitle.value,
        }
        return authorInfo

      });
      dispatch(completeAuthorsFetch(authors));
    });
  };
