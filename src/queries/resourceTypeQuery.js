export function getResources(resourceType){
   const query = [
     "SELECT ?resource ?resourceTitle",
     "{",
       "?resource a <" + resourceType + "> .",
       "?resource <http://purl.org/dc/elements/1.1/title> ?resourceTitle",
      "}",
     "ORDER BY ?resourceTitle"].join('')
  return query
}
