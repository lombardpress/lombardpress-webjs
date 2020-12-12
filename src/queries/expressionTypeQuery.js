export function getExpressionTypeInfo(id){
   const query = [
     "SELECT ?expression ?eLongTitle ?expressionAuthor ?expressionAuthorTitle ?author ?authorTitle ",
     "{",
       "{",
         "?expression <http://scta.info/property/expressionType> <" + id + "> .",
       "}",
       "UNION",
       "{",
         "?expression <http://scta.info/property/expressionType> ?expressionType .",
         "?expressionType <http://scta.info/property/isMemberOf> <" + id + "> .",
       "}",
       "?expression <http://scta.info/property/longTitle> ?eLongTitle .",
       "OPTIONAL {",
       "?expression <http://www.loc.gov/loc.terms/relators/AUT> ?author . ",
       "?author <http://purl.org/dc/elements/1.1/title> ?authorTitle .",
       "}",
      "}",
      

     "ORDER BY ?authorTitle"].join(' ')
  return query
}
