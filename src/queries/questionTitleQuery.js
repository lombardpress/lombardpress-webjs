export function questionTitleQuery(searchParameters){
  const searchTerm = searchParameters.searchTerm
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
       "FILTER (REGEX(STR(?qtitle), '" + searchTerm + "', 'i')) .",
       "?resource <http://purl.org/dc/elements/1.1/title> ?resourceTitle .",
       "?resource <http://scta.info/property/structureType> ?structureType .",
       "?resource <http://scta.info/property/longTitle> ?longTitle .",
       eidQuery,
       "?resource <http://scta.info/property/isPartOfTopLevelExpression> ?topLevel .",
       authorQuery,
       "?topLevel <http://www.loc.gov/loc.terms/relators/AUT> ?author .",

       "?author <http://purl.org/dc/elements/1.1/title> ?authorTitle .",
     "}"
   ].join(' ');
   return query
 }
