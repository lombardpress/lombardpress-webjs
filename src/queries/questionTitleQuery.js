export function questionTitleQuery(searchParameters){
  const searchTerm = searchParameters.searchTerm
  let workGroupQuery = "";
    if (searchParameters.searchWorkGroup){
      workGroupQuery = [
        "BIND(<" + searchParameters.searchWorkGroup + "> AS ?workGroup) .",
        "?workGroup <http://scta.info/property/hasExpression> ?topLevel ."
      ].join(' ')
    }
  let expressionTypeQuery = "";
    if (searchParameters.searchEType){
      expressionTypeQuery = [
        "BIND(<" + searchParameters.searchEType + "> AS ?expressionType) .",
        "{",
          "?resource <http://scta.info/property/expressionType> ?expressionType .",
        "}",
        "UNION",
        "{",
          "?resource <http://scta.info/property/isMemberOf> ?ancestor .",
          "?ancestor <http://scta.info/property/expressionType> ?expressionType .",
        "}"].join(' ')
    }
  let authorQuery = "";
    if (searchParameters.searchAuthor){
      authorQuery = "BIND(<" + searchParameters.searchAuthor + "> AS ?author)."
    }
  let eidQuery = "";
    if (searchParameters.searchEid){
      eidQuery = "BIND(<" + searchParameters.searchEid + "> AS ?topLevel)."
    }
   const query = [
     "SELECT ?resource ?qtitle ?resourceTitle ?structureType ?longTitle ?author ?authorTitle",
     "WHERE",
     "{",

       "?resource <http://scta.info/property/questionTitle> ?qtitle  .",
       "?resource <http://purl.org/dc/elements/1.1/title> ?resourceTitle .",
       "?resource <http://scta.info/property/structureType> ?structureType .",
       "?resource <http://scta.info/property/longTitle> ?longTitle .",
       expressionTypeQuery,
       eidQuery,
       "?resource <http://scta.info/property/isPartOfTopLevelExpression> ?topLevel .",
       authorQuery,
       "?topLevel <http://www.loc.gov/loc.terms/relators/AUT> ?author .",
       "?author <http://purl.org/dc/elements/1.1/title> ?authorTitle .",
       workGroupQuery,
       "FILTER (REGEX(STR(?qtitle), '" + searchTerm + "', 'i')) .",
     "}"
   ].join(' ');
   return query
 }
