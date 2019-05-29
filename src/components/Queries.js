//note; each query here represents an attempt an efficient single request for related information
//each query therefore could be tranformed into a restful api
export function basicStructureItemInfoQuery(itemExpressionUri){
  const query = [
    "SELECT DISTINCT ?cmanifestation ?cmanifestationTitle ?manifestation ?manifestationTitle ?ctranscription ?expressionShortId ?longTitle ?topLevelExpression ?next ?previous ?inbox ",
    "WHERE { ",
    "<" + itemExpressionUri + "> a <http://scta.info/resource/expression> .",
    "<" + itemExpressionUri + "><http://scta.info/property/hasCanonicalManifestation> ?cmanifestation .",
    "?cmanifestation <http://purl.org/dc/elements/1.1/title> ?cmanifestationTitle .",
    "<" + itemExpressionUri + "> <http://scta.info/property/hasManifestation> ?manifestation .",
    "?manifestation <http://purl.org/dc/elements/1.1/title> ?manifestationTitle .",
    "?cmanifestation <http://scta.info/property/hasCanonicalTranscription> ?ctranscription .",
    "<" + itemExpressionUri + "> <http://scta.info/property/shortId> ?expressionShortId .",
    "<" + itemExpressionUri + "> <http://scta.info/property/longTitle> ?longTitle .",
    "<" + itemExpressionUri + "> <http://scta.info/property/isPartOfTopLevelExpression> ?topLevelExpression .",
    "<" + itemExpressionUri + "> <http://scta.info/property/next> ?next .",
    "<" + itemExpressionUri + "> <http://scta.info/property/previous> ?previous .",
    "<" + itemExpressionUri + "> <http://www.w3.org/ns/ldp#inbox> ?inbox . ",
    "}",
    "ORDER BY ?expressionTitle"].join('');
    return query
  }

export const basicStructureBlockInfoQuery = []
