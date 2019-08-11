 export function getCanonicalTranscription(expressionId){
   const query = [
     "SELECT DISTINCT ?ctranscription ",
     "WHERE { ",
       "<" + expressionId + "> <http://scta.info/property/hasCanonicalManifestation> ?manifestation .",
       "?manifestation <http://scta.info/property/hasCanonicalTranscription> ?ctranscription .",
     "}"
    ].join('');
  return query
 }
