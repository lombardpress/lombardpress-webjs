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
      "SELECT DISTINCT ?item ?itemTitle ?topLevel ?itemQuestionTitle ?cm ?cmTitle ?ct ?next ?previous ?itemType ?doc ",
      "WHERE { ",
      "<" + topLevelExpressionUrl + "> <http://scta.info/property/hasStructureItem> ?item .",
      "?item <http://scta.info/property/isPartOfTopLevelExpression> ?topLevel .",
      "?item <http://purl.org/dc/elements/1.1/title> ?itemTitle .",
      "?item <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?itemType . ",
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
      "?ct <http://scta.info/property/hasDocument> ?doc .",
      "}",
      "ORDER BY ?totalOrderNumber"].join('');
      return query
    }
    // gets all parts
    export function partsInfoQuery(resourceurl){
      const query = [
        "SELECT DISTINCT ?part ?partTitle ?partQuestionTitle ?partType ?partLevel ",
        "WHERE { ",
        "<" + resourceurl + "> <http://purl.org/dc/terms/hasPart> ?part .",
        "?part <http://purl.org/dc/elements/1.1/title> ?partTitle .",
        "?part <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?partType . ",
        "OPTIONAL {",
        "?part <http://scta.info/property/questionTitle> ?partQuestionTitle .",
        "}",
        "OPTIONAL {",
        "?part <http://scta.info/property/level> ?partLevel .",
        "}",
        "OPTIONAL {",
        "?part <http://scta.info/property/totalOrderNumber> ?totalOrderNumber .",
        "}",
        "}",
        "ORDER BY ?totalOrderNumber"].join('');
        return query
      }
    // gets all expressions for work Group
    export function workGroupExpressionQuery(resourceurl){
      const query = [
        "SELECT DISTINCT ?item ?itemTitle ?itemAuthor ?itemAuthorTitle ?itemType ",
        "WHERE { ",
        "<" + resourceurl + "> <http://scta.info/property/hasExpression> ?item .",
        "?item <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?itemType . ",
        "?item <http://purl.org/dc/elements/1.1/title> ?itemTitle .",
        "?item <http://www.loc.gov/loc.terms/relators/AUT> ?itemAuthor .",
        "?itemAuthor <http://purl.org/dc/elements/1.1/title> ?itemAuthorTitle .",
        "}"].join('');
        return query
      }

  // get basic info, structure type, level, and top Level
  export function getStructureType(resourceurl){
    const query = [
      "SELECT DISTINCT ?type ?structureType ?level ?topLevel ",
      "WHERE { ",
      "<" + resourceurl + "> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?type . ",
      "OPTIONAL {",
      "<" + resourceurl + "> <http://scta.info/property/structureType> ?structureType . ",
      "}",
      "OPTIONAL {",
      "<" + resourceurl + "> <http://scta.info/property/level> ?level . ",
      "}",
      "OPTIONAL {",
      "<" + resourceurl + "> <http://scta.info/property/isPartOfTopLevelExpression> ?topLevel . ",
      "}",
      "}"].join('');
      return query
    }
  //surface id query, gets canvas and manifestation
  export function getSurfaceInfo(resourceurl){
    const query = [
      "SELECT DISTINCT ?canvas",
      "WHERE { ",
      "<" + resourceurl + "> <http://scta.info/property/hasCanonicalISurface> ?isurface . ",
      "?isurface <http://scta.info/property/hasCanvas> ?canvas .",
      "}"].join('');
      return query
    }
