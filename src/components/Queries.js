//note; each query here represents an attempt an efficient single request for related information
//each query therefore could be tranformed into a restful api

//get Related Expressions
export function getRelatedExpressions(itemExpressionUri){
  const query = [
    "SELECT DISTINCT ?isRelatedTo ",
    "WHERE { ",
    "<" + itemExpressionUri + "> <http://scta.info/property/isRelatedTo> ?isRelatedTo .",
    "}"
  ].join('');

    return query
}

// query info block, division, or item (possible also collection)
export function basicInfoQuery(itemExpressionUri){
  const query = [
    "SELECT DISTINCT ?title ?structureType ?cmanifestation ?cmanifestationTitle ?manifestation ?manifestationTitle ?ctranscription ?manifestationCTranscription ?cdoc ?cxml ?expressionShortId ?longTitle ?topLevelExpression ?next ?previous ?inbox ",
    "WHERE { ",
    "<" + itemExpressionUri + "> <http://purl.org/dc/elements/1.1/title> ?title .",
    "<" + itemExpressionUri + "> <http://scta.info/property/structureType> ?structureType .",
    "<" + itemExpressionUri + "> <http://scta.info/property/hasCanonicalManifestation> ?cmanifestation .",
    "?cmanifestation <http://purl.org/dc/elements/1.1/title> ?cmanifestationTitle .",
    "<" + itemExpressionUri + "> <http://scta.info/property/hasManifestation> ?manifestation .",
    "?manifestation <http://purl.org/dc/elements/1.1/title> ?manifestationTitle .",
    "?manifestation <http://scta.info/property/hasCanonicalTranscription> ?manifestationCTranscription .",
    "?cmanifestation <http://scta.info/property/hasCanonicalTranscription> ?ctranscription .",
    "?ctranscription <http://scta.info/property/hasDocument> ?cdoc . ",
    "?ctranscription <http://scta.info/property/hasXML> ?cxml . ",
    "<" + itemExpressionUri + "> <http://scta.info/property/shortId> ?expressionShortId .",
    "<" + itemExpressionUri + "> <http://scta.info/property/longTitle> ?longTitle .",
    "<" + itemExpressionUri + "> <http://scta.info/property/isPartOfTopLevelExpression> ?topLevelExpression .",
    "OPTIONAL {",
    "<" + itemExpressionUri + "> <http://scta.info/property/next> ?next .",
    "}",
    "OPTIONAL {",
    "<" + itemExpressionUri + "> <http://scta.info/property/previous> ?previous .",
    "}",
    "<" + itemExpressionUri + "> <http://www.w3.org/ns/ldp#inbox> ?inbox . ",
    "}",
    "ORDER BY ?title"].join('');
    
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
      "SELECT DISTINCT ?type ?structureType ?level ?topLevel ?itemParent ",
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
      "OPTIONAL {",
      "<" + resourceurl + "> <http://scta.info/property/isPartOfStructureItem> ?itemParent . ",
      "}",
      "}"].join('');
      return query
    }
  //surface id query, gets canvas and manifestation
  export function getSurfaceInfo(surfaceid){
    const query = [
      "SELECT DISTINCT ?surfaceTitle ?c_height ?c_width ?isurface ?isurfaceTitle ?icodexTitle ?canvas ?imageurl ?next_surface ?previous_surface ",
        "{",
  				"<" + surfaceid + "> <http://purl.org/dc/elements/1.1/title> ?surfaceTitle .",
  				"<" + surfaceid + "> <http://scta.info/property/hasISurface> ?isurface .",
  				"OPTIONAL {",
  					"<" + surfaceid + "> <http://scta.info/property/next> ?next_surface .",
  				"}",
  				"OPTIONAL {",
  					"<" + surfaceid + "> <http://scta.info/property/previous> ?previous_surface .",
          "}",
  				"OPTIONAL {",
  					"?isurface <http://purl.org/dc/elements/1.1/title> ?isurfaceTitle .",
  					"?isurface <http://purl.org/dc/elements/1.1/isPartOf> ?icodex .",
  					"?icodex <http://purl.org/dc/elements/1.1/title> ?icodexTitle .",
  				"}",
  				"?isurface <http://scta.info/property/hasCanvas> ?canvas .",
  				"OPTIONAL{",
  					"?canvas <http://iiif.io/api/presentation/2#hasImageAnnotations> ?blank .",
  				"}",
  				"OPTIONAL{",
  					"?canvas <http://www.shared-canvas.org/ns/hasImageAnnotations> ?blank .",
  				"}",
  				"?canvas <http://www.w3.org/2003/12/exif/ns#width> ?c_width .",
  				"?canvas <http://www.w3.org/2003/12/exif/ns#height> ?c_height .",
  		     "?blank <http://www.w3.org/1999/02/22-rdf-syntax-ns#first> ?o .",
  		     "?o <http://www.w3.org/ns/oa#hasBody> ?o2 .",
  		    "OPTIONAL{",
  					 "?o2 <http://rdfs.org/sioc/services#has_service> ?imageurl .",
  				 "}",
  				 "OPTIONAL{",
  					 "?o2 <http://www.shared-canvas.org/ns/hasRelatedService> ?imageurl .",
  				 "}",
        "}"].join('');
      return query
    }
