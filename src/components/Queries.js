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
  // gets all structure items with basic item information
  export function basicStructureAllItemsInfoQuery(topLevelExpressionUrl){
    const query = [
      "SELECT DISTINCT ?item ?itemTitle ?topLevel ?itemQuestionTitle ?cm ?cmTitle ?ct ?next ?previous ",
      "WHERE { ",
      "<" + topLevelExpressionUrl + "> <http://scta.info/property/hasStructureItem> ?item .",
      "?item <http://scta.info/property/isPartOfTopLevelExpression> ?topLevel .",
      "?item <http://purl.org/dc/elements/1.1/title> ?itemTitle .",
      "OPTIONAL {",
      "?item <http://scta.info/property/questionTitle> ?itemQuestionTitle .",
      "}",
      "OPTIONAL",
      "{",
      "?item <http://scta.info/property/next> ?next .",
      "}",
      "OPTIONAL",
      "{",
      "?item <http://scta.info/property/previous> ?previous .",
      "}",
      "?item <http://scta.info/property/hasCanonicalManifestation> ?cm .",
      "?item <http://scta.info/property/totalOrderNumber> ?totalOrderNumber .",
      "?cm <http://purl.org/dc/elements/1.1/title> ?cmTitle .",
      "?cm <http://scta.info/property/hasCanonicalTranscription> ?ct .",
      "}",
      "ORDER BY ?totalOrderNumber"].join('');
      return query
    }
    // gets all structure items with basic item information
    export function basicStructureAllItemsInfoFromItemIdQuery(itemUrl){
      const query = [
        "SELECT DISTINCT ?item ?itemTitle ?itemQuestionTitle ?cm ?cmTitle ?ct ?next ?previous ?topLevel ",
        "WHERE { ",
        "<" + itemUrl + "> <http://scta.info/property/isPartOfTopLevelExpression> ?topLevel .",
        "?topLevel <http://scta.info/property/hasStructureItem> ?item .",
        "?item <http://purl.org/dc/elements/1.1/title> ?itemTitle .",
        "OPTIONAL {",
        "?item <http://scta.info/property/questionTitle> ?itemQuestionTitle .",
        "}",
        "OPTIONAL",
        "{",
        "?item <http://scta.info/property/next> ?next .",
        "}",
        "OPTIONAL",
        "{",
        "?item <http://scta.info/property/previous> ?previous .",
        "}",
        "?item <http://scta.info/property/hasCanonicalManifestation> ?cm .",
        "?item <http://scta.info/property/totalOrderNumber> ?totalOrderNumber .",
        "?cm <http://purl.org/dc/elements/1.1/title> ?cmTitle .",
        "?cm <http://scta.info/property/hasCanonicalTranscription> ?ct .",
        "}",
        "ORDER BY ?totalOrderNumber"].join('');
        return query
      }

  export function getStructureType(resourceurl){
    const query = [
      "SELECT DISTINCT ?structureType ",
      "WHERE { ",
      "<" + resourceurl + "> <http://scta.info/property/structureType> ?structureType . ",
      "}"].join('');
      return query
    }
