import Axios from 'axios'
import {sparqlEndpoint} from '../components/config';

export var startWorkGroupsListFetch = () => {
  return{
    type: "START_WORK_GROUPS_LIST_FETCH"
  };
};
export var completeWorkGroupsListFetch = (workGroups) => {
  return{
    type: "COMPLETE_WORK_GROUPS_LIST_FETCH",
    workGroups
  };
};
export var fetchWorkGroupsList = (searchParameters, dispatch) =>{
  let authorQuery = "";
    if (searchParameters.searchAuthor){
      authorQuery = [
      "?workGroup <http://scta.info/property/hasExpression> ?expression .",
      "?expression <http://www.loc.gov/loc.terms/relators/AUT> <" + searchParameters.searchAuthor + "> ."
      ].join('');
    }
  //   // Begin Author date sparql filters
  //   let quotationAuthorDateSparql = "";
  //   if (searchParameters.quotationAuthorDateAfter || searchParameters.quotationAuthorDateBefore){
  //     quotationAuthorDateSparql = "?author <http://scta.info/property/dateOfBirth> ?dateOfBirth ."
  //   }
  //   let quotationAuthorDateAfterSparqlFilter = "";
  //   if (searchParameters.quotationAuthorDateAfter){
  //     quotationAuthorDateAfterSparqlFilter = "FILTER (?dateOfBirth >= '" + searchParameters.quotationAuthorDateAfter + "')."
  //   }
  //   let quotationAuthorDateBeforeSparqlFilter = "";
  //   if (searchParameters.quotationAuthorDateBefore){
  //     quotationAuthorDateBeforeSparqlFilter = "FILTER (?dateOfBirth <= '" + searchParameters.quotationAuthorDateBefore + "')."
  //   }
    // END author date sparql filter
    var query = [
        "SELECT DISTINCT ?workGroup ?workGroupTitle ",
        "WHERE { ",
        "?workGroup a <http://scta.info/resource/workGroup> .",
        "?workGroup <http://purl.org/dc/elements/1.1/title> ?workGroupTitle .",
        authorQuery,
        "}",
        "ORDER BY ?workGroupTitle"].join(' ');
  dispatch(startWorkGroupsListFetch());
  Axios.get(sparqlEndpoint, {params: {"query" : query, "output": "json"}}).then(function(res){
    console.log("async firing workGroups")
    var results = res.data.results.bindings;
    var workGroups = results.map((result) => {
        var workGroupInfo = {
          workGroup: result.workGroup.value,
          workGroupTitle: result.workGroupTitle.value,
        }
        return workGroupInfo

      });
      dispatch(completeWorkGroupsListFetch(workGroups));
    });
  };
