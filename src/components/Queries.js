//note; each query here represents an attempt an efficient single request for related information
//each query therefore could be tranformed into a restful api

//NOTE: this query does not work as expected when using Fuseking version 3 it only works as expected using version 2.0
// with version 3, it seems to get all quotes from the entire corpus, suggested something may not be working with the "bind" method
 export function getRelatedExpressions(itemExpressionUri, offset, pagesize, rangeStart, rangeEnd){

   let rangeFilter;
   if (rangeStart && rangeEnd){
    rangeFilter = ["FILTER (?isRelatedToRangeEnd <=" + rangeEnd + ")",
                  "FILTER (?isRelatedToRangeStart >=" + rangeStart + ")"].join(" ")
   }
   let activeSource; 
   if (!rangeStart && !rangeEnd){
    activeSource = [ 
      "{",
        "?element <http://scta.info/property/source> ?isRelatedTo .",
        "FILTER (!isBlank(?isRelatedTo)) .",
      "}",
      "UNION",
      "{",
      "?element <http://scta.info/property/source> ?bn .",
      "?bn <http://scta.info/property/source> ?isRelatedTo .",
      "?bn <http://scta.info/property/canonicalRangeStart> ?isRelatedToRangeStart .",
      "?bn <http://scta.info/property/canonicalRangeEnd> ?isRelatedToRangeEnd .",
      "}"].join(" ")
    }
    else{
      activeSource = ["?element <http://scta.info/property/source> ?bn .",
      "?bn <http://scta.info/property/source> ?isRelatedTo .",
      "?bn <http://scta.info/property/canonicalRangeStart> ?isRelatedToRangeStart .",
      "?bn <http://scta.info/property/canonicalRangeEnd> ?isRelatedToRangeEnd .",
      rangeFilter].join(" ")
    }
   
    let inverseSource;
   if (!rangeStart && !rangeEnd){
    inverseSource = ["{",
            "?isRelatedTo <http://scta.info/property/source> ?element .",
          "}",
            "UNION",
          "{",
            "?isRelatedTo <http://scta.info/property/source> ?bn .",
            "?bn <http://scta.info/property/source> ?element .",
            "?bn <http://scta.info/property/canonicalRangeStart> ?isRelatedToRangeStart .",
            "?bn <http://scta.info/property/canonicalRangeEnd> ?isRelatedToRangeEnd .",
          "}"].join(" ")
   }
   else{
    inverseSource = ["?isRelatedTo <http://scta.info/property/source> ?bn .",
    "?bn <http://scta.info/property/source> ?element .",
    "?bn <http://scta.info/property/canonicalRangeStart> ?isRelatedToRangeStart .",
    "?bn <http://scta.info/property/canonicalRangeEnd> ?isRelatedToRangeEnd .",
    rangeFilter].join(" ")
   }
  //OLD QUERY THAT STOPPED WORKING As part of update to fuseki 4.3
  //  const query = [
  //   "SELECT DISTINCT ?isRelatedTo ?label ?element ?longTitle ?author ?authorTitle ?isRelatedToRangeStart ?isRelatedToRangeEnd ",
  //   "WHERE",
  //   "{ ",
  //   "BIND (<" + itemExpressionUri + "> as ?resource)",
  //     "{",
  //       "?resource ?o ?isRelatedTo .",
  //       "?o a <http://scta.info/resource/textRelation> .",
  //       "FILTER (?o != <http://scta.info/property/quotes>)",
  //       "FILTER (?o != <http://scta.info/property/quotedBy>)", 
  //       "FILTER (?o != <http://scta.info/property/references>)", 
  //       "FILTER (?o != <http://scta.info/property/referencedBy>)", 
  //       "?o <http://www.w3.org/1999/02/22-rdf-syntax-ns#label> ?label . ",
  //       "?isRelatedTo a <http://scta.info/resource/expression> .",
  //     "}",
  //     "UNION",
  //     "{",
  //       "{",
  //         "?resource <http://scta.info/property/structureType> <http://scta.info/resource/structureElement> .",
  //         "BIND (?resource as ?element)",
  //       "}",
  //       "UNION",
  //       "{",
  //         "?element <http://scta.info/property/isMemberOf> ?resource .",
  //       "}",
  //       "{",
  //           activeSource,
  //           "?element <http://scta.info/property/structureElementType> <http://scta.info/resource/structureElementQuote> .",
  //           "BIND ('quotes' as ?label) .",
  //         "}",
  //       "UNION",
  //       "{",
  //         activeSource,
  //         "?element <http://scta.info/property/structureElementType> <http://scta.info/resource/structureElementRef> .",
  //         "BIND ('refs' as ?label) .",
  //       "}",
  //     "}",
  //     "UNION", 
  //     "{",
  //       "{",
  //         "BIND (?resource as ?element)",
  //       "}",
  //       "UNION",
  //       "{",
  //         "?element <http://scta.info/property/isMemberOf> ?resource .",
  //       "}",
  //       "{",
  //         inverseSource,
  //         "?isRelatedTo <http://scta.info/property/structureElementType> <http://scta.info/resource/structureElementQuote> .",
  //         "BIND ('isQuotedBy' as ?label) .",
  //       "}",
  //       "UNION",
  //       "{",
  //         inverseSource,
  //         //"?isRelatedTo <http://scta.info/property/source> ?element.",
  //         "?isRelatedTo <http://scta.info/property/structureElementType> <http://scta.info/resource/structureElementRef> .",
  //         "BIND ('isReferencedBy' as ?label) .",
  //       "}",
  //     "}",
  //     "?isRelatedTo <http://scta.info/property/longTitle> ?longTitle .",
  //     "?isRelatedTo <http://scta.info/property/isMemberOf> ?mem .",
  //     "?mem <http://scta.info/property/level> '1' .",
  //     "OPTIONAL",
  //     "{",
  //       "?mem <http://www.loc.gov/loc.terms/relators/AUT> ?author .",
  //       "?author <http://purl.org/dc/elements/1.1/title> ?authorTitle",
  //     "}",
  //   "}",
  //   "ORDER BY ?authorTitle",
  //   "LIMIT " + pagesize,
  //   "OFFSET " + offset
  //  ].join(' ');

  const query = [
  "SELECT DISTINCT ?isRelatedTo ?label ?element ?longTitle ?author ?authorTitle ?isRelatedToRangeStart ?isRelatedToRangeEnd ",
  "WHERE",
  "{ ",
    "BIND (<" + itemExpressionUri  + "> AS ?resource) .",
    "{",
      "<" + itemExpressionUri  + "> ?o ?isRelatedTo . ",
      "?o a <http://scta.info/resource/textRelation> . ", 
      "FILTER (?o != <http://scta.info/property/quotes>) . ",
      "FILTER (?o != <http://scta.info/property/quotedBy>) . ",
      "FILTER (?o != <http://scta.info/property/references>).",
      "FILTER (?o != <http://scta.info/property/referencedBy>).", 
      "?o <http://www.w3.org/1999/02/22-rdf-syntax-ns#label> ?label . ",
      "?isRelatedTo a <http://scta.info/resource/expression> . ",
      "}", 
      "UNION", 
    "{",
      "{",
      "<" + itemExpressionUri  + "> <http://scta.info/property/structureType> <http://scta.info/resource/structureElement> . ",
        "BIND (<" + itemExpressionUri  + "> as ?element) .",
      "} ",
      "UNION", 
      "{",
        "?element <http://scta.info/property/isMemberOf> <" + itemExpressionUri  + ">  . ",
      "}",
      "{ ",
          activeSource,
          "{",
            "?element <http://scta.info/property/structureElementType> <http://scta.info/resource/structureElementQuote> . ",
            "BIND ('quotes' as ?label) . ",
          "}",
          "UNION",
          "{",
            "?element <http://scta.info/property/structureElementType> <http://scta.info/resource/structureElementRef> . ",
            "BIND ('refs' as ?label) . ",
          "}",
        "} ",
    "} ",
    "UNION",
    "{ ",
    "{ ",
      "BIND (<" + itemExpressionUri  + ">  as ?element) .",
      "} ",
      "UNION ",
      "{ ",
      "?element <http://scta.info/property/isMemberOf> <" + itemExpressionUri  + ">  . ",
      "}",
      inverseSource,
      "{",
      " ?isRelatedTo <http://scta.info/property/structureElementType> <http://scta.info/resource/structureElementQuote> . ",
      " BIND ('isQuotedBy' as ?label) . ",
      "} ",
      "UNION", 
      "{ ",
        "?isRelatedTo <http://scta.info/property/structureElementType> <http://scta.info/resource/structureElementRef> . ",
        "BIND ('isReferencedBy' as ?label) . ",
      "}",
    "}",
    "?isRelatedTo <http://scta.info/property/longTitle> ?longTitle . ",
    "?isRelatedTo <http://scta.info/property/isMemberOf> ?mem . ",
    "?mem <http://scta.info/property/level> '1' . ",
    "OPTIONAL ",
    "{ ",
      "?mem <http://www.loc.gov/loc.terms/relators/AUT> ?author . ",
      "?author <http://purl.org/dc/elements/1.1/title> ?authorTitle .",
    "} ",
  "} ",
  "ORDER BY ?authorTitle",
  "LIMIT " + pagesize,
  "OFFSET " + offset
].join(' ');
     return query
 }
//get Related Expressions
// export function getRelatedExpressions(itemExpressionUri){
//   const query = [
//     "SELECT DISTINCT ?isRelatedTo ",
//     "WHERE { ",
//     "{",
//     "<" + itemExpressionUri + "> <http://scta.info/property/isRelatedTo> ?isRelatedTo .",
//     "}",
//     "UNION",
//     "{",
//     "<" + itemExpressionUri + "> <http://scta.info/property/quotes> ?quote .",
//     "?quote a <http://scta.info/resource/quotation> .",
//     "?quote <http://scta.info/property/source> ?isRelatedTo .",
//     "}",
//     "UNION",
//     "{",
//     "<" + itemExpressionUri + "> <http://scta.info/property/quotes> ?quote .",
//     "?quote a <http://scta.info/resource/expression> .",
//     "<" + itemExpressionUri + "> <http://scta.info/property/quotes> ?isRelatedTo .",
//     "}",
//     "UNION",
//     "{",
//     "<" + itemExpressionUri + "> <http://scta.info/property/quotedBy> ?isRelatedTo .",
//     "}",
//     "UNION",
//     "{",
//     "<" + itemExpressionUri + "> <http://scta.info/property/abbreviates> ?isRelatedTo .",
//     "}",
//     "UNION",
//     "{",
//     "<" + itemExpressionUri + "> <http://scta.info/property/abbreviatedBy> ?isRelatedTo .",
//     "}",
//     "UNION",
//     "{",
//     "<" + itemExpressionUri + "> <http://scta.info/property/references> ?isRelatedTo .",
//     "}",
//     "UNION",
//     "{",
//     "<" + itemExpressionUri + "> <http://scta.info/property/referencedBy> ?isRelatedTo .",
//     "}",
//     "UNION",
//     "{",
//     "<" + itemExpressionUri + "> <http://scta.info/property/copies> ?isRelatedTo .",
//     "}",
//     "UNION",
//     "{",
//     "<" + itemExpressionUri + "> <http://scta.info/property/isCopiedBy> ?isRelatedTo .",
//     "}",
//     "}"
//   ].join('');
//
//     return query
// }

// query info block, division, or item (possible also collection)
export function basicInfoQuery(itemExpressionUri){
  const query = [
    "SELECT DISTINCT ?title ?structureType ?cmanifestation ?cmanifestationTitle ?manifestation ?manifestationTitle ?ctranscription ?manifestationCTranscription ?cdoc ?cxml ?expressionShortId ?longTitle ?topLevelExpression ?next ?previous ?inbox ?author ?authorTitle ?parent ",
    "WHERE { ",
    "<" + itemExpressionUri + "> <http://purl.org/dc/elements/1.1/title> ?title .",
    "<" + itemExpressionUri + "> <http://scta.info/property/structureType> ?structureType .",
    "<" + itemExpressionUri + "> <http://scta.info/property/hasCanonicalManifestation> ?cmanifestation .",
    "?cmanifestation <http://purl.org/dc/elements/1.1/title> ?cmanifestationTitle .",
    "<" + itemExpressionUri + "> <http://scta.info/property/hasManifestation> ?manifestation .",
    "?manifestation <http://purl.org/dc/elements/1.1/title> ?manifestationTitle .",
    "OPTIONAL {",
    "?manifestation <http://scta.info/property/hasCanonicalTranscription> ?manifestationCTranscription .",
    "?cmanifestation <http://scta.info/property/hasCanonicalTranscription> ?ctranscription .",
    "?ctranscription <http://scta.info/property/hasDocument> ?cdoc . ",
    "?ctranscription <http://scta.info/property/hasXML> ?cxml . ",
    "}",
    "<" + itemExpressionUri + "> <http://scta.info/property/shortId> ?expressionShortId .",
    "{",
      "<" + itemExpressionUri + "> <http://scta.info/property/isPartOfTopLevelExpression> ?topLevelExpression .",
    "}",
    "UNION",
    "{",
      "<" + itemExpressionUri + "> <http://scta.info/property/level> '1' .",
      "BIND(<" + itemExpressionUri + "> AS ?topLevelExpression) .", 
    "}",
    "OPTIONAL {",
    "<" + itemExpressionUri + "> <http://scta.info/property/longTitle> ?longTitle .",
    "}",
    "OPTIONAL {",
    "?topLevelExpression <http://www.loc.gov/loc.terms/relators/AUT> ?author .",
    "?author <http://purl.org/dc/elements/1.1/title> ?authorTitle .",
    "}",
    "OPTIONAL {",
    "<" + itemExpressionUri + "> <http://scta.info/property/next> ?next .",
    "}",
    "OPTIONAL {",
    "<" + itemExpressionUri + "> <http://scta.info/property/previous> ?previous .",
    "}",
    "OPTIONAL {",
    "<" + itemExpressionUri + "> <http://purl.org/dc/terms/isPartOf> ?parent .",
    "}",
    "<" + itemExpressionUri + "> <http://www.w3.org/ns/ldp#inbox> ?inbox . ",
    "}",
    "ORDER BY ?title"].join('');

    return query
  }

  export function itemTranscriptionInfoQuery(itemTranscriptionUri){
    const query = [
      "SELECT DISTINCT ?title ?manifestation ?doc ?xml ?expression ?expressionShortId ?longTitle ?topLevelExpression ?next ?previous ?inbox ?t ",
      "WHERE { ",
      "BIND(<" + itemTranscriptionUri + "> as ?t) . ",
      "?t <http://purl.org/dc/elements/1.1/title> ?title .",
      "?t <http://scta.info/property/isTranscriptionOf> ?manifestation .",
      "?t <http://scta.info/property/hasDocument> ?doc . ",
      "?t <http://scta.info/property/hasXML> ?xml . ",
      "?manifestation <http://scta.info/property/isManifestationOf> ?expression .",
      "?expression <http://purl.org/dc/elements/1.1/title> ?expressionTitle .",
      "?expression <http://scta.info/property/shortId> ?expressionShortId .",
      "?expression <http://scta.info/property/longTitle> ?longTitle .",
      "?expression <http://scta.info/property/isPartOfTopLevelExpression> ?topLevelExpression .",
      "OPTIONAL {",
      "?expression <http://scta.info/property/next> ?next .",
      "}",
      "OPTIONAL {",
      "?expression <http://scta.info/property/previous> ?previous .",
      "}",
      "?expression <http://www.w3.org/ns/ldp#inbox> ?inbox . ",
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
        "SELECT DISTINCT ?title ?description ?part ?partTitle ?partQuestionTitle ?partType ?partLevel ",
        "WHERE { ",
        "<" + resourceurl + "> <http://purl.org/dc/elements/1.1/title> ?title .",
        "<" + resourceurl + "> <http://purl.org/dc/elements/1.1/description> ?description .",
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
        "}",
        "ORDER BY ?itemAuthorTitle"].join('');
        return query
  }
  export function getArticleTranscriptionDoc(resourceurl){
    const query = [
      "SELECT DISTINCT ?doc ?articleType ",
      "WHERE { ",
        "<" + resourceurl + "> <http://scta.info/property/hasCanonicalTranscription> ?ctranscription . ",
        "<" + resourceurl + "> <http://scta.info/property/articleType> ?articleType .",
        "?ctranscription <http://scta.info/property/hasXML> ?doc . ",
      "}"].join('');
      return query
  }
  export function getItemTranscriptionFromBlockDiv(resourceurl){
    const query = [
      "SELECT DISTINCT ?ctranscription ?blockDivExpression ",
      "WHERE { ",
        "OPTIONAL",
        "{",
          //"<" + resourceurl + "> <http://scta.info/property/isPartOfStructureItem> ?itemParent . ",
          //"<" + resourceurl + "> <http://scta.info/property/isMemberOf> ?itemParent . ",
          "{",
            "<" + resourceurl + "> <http://scta.info/property/isPartOfStructureItem> ?itemParent . ",
          "}",
          "UNION",
          "{",
            "<" + resourceurl + ">  <http://scta.info/property/isPartOfStructureBlock> ?blockParent .",
            "?blockParent <http://scta.info/property/isPartOfStructureItem> ?itemParent . ",
          "}",

        "?itemParent <http://scta.info/property/structureType> <http://scta.info/resource/structureItem> . ",
        "{",
          "{",
            "?itemParent <http://scta.info/property/hasCanonicalManifestation> ?cmanifestation . ",
            "?cmanifestation <http://scta.info/property/hasCanonicalTranscription> ?ctranscription . ",
          "}",
          "UNION",
          "{",
            "?itemParent <http://scta.info/property/hasCanonicalTranscription> ?ctranscription . ",
          "}",
        "}",
        "}",
        "OPTIONAL",
        "{",
          "{",
            "<" + resourceurl + "> <http://scta.info/property/isManifestationOf> ?blockDivExpression . ",
          "}",
          "UNION",
          "{",
            "<" + resourceurl + "> <http://scta.info/property/isTranscriptionOf> ?blockDivManifestation . ",
            "?blockDivManifestation <http://scta.info/property/isManifestationOf> ?blockDivExpression . ",
          "}",
        "}",
      "}"].join('');
      return query
  }
  /**
   * @description constructs query needed for initial textSwitch component; captures resource type information and related 
   * details needed to allow the textSwitch component decide what kind of display is necessary
   * 
   * @param {string} resourceurl - resource url should be full scta url id
   * @returns {string} - returns query as string
   */
  export function getStructureType(resourceurl){
    const query = [
      "SELECT DISTINCT ?type ?structureType ?level ?topLevel ?itemParent ?resourceTitle ?author ?authorTitle ?ctranscription ",
      "WHERE { ",
      "<" + resourceurl + "> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?type . ",
      "OPTIONAL {",
        "<" + resourceurl + "> <http://www.loc.gov/loc.terms/relators/AUT> ?author .",
        "?author <http://purl.org/dc/elements/1.1/title> ?authorTitle .",
      "}",
      "OPTIONAL {",
        "<" + resourceurl + "> <http://purl.org/dc/elements/1.1/title> ?resourceTitle .",
      "}",
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
      "<" + resourceurl + "> <http://scta.info/property/isPartOfTopLevelManifestation> ?topLevel . ",
      "}",
      "OPTIONAL {",
      "<" + resourceurl + "> <http://scta.info/property/isPartOfTopLevelTransription> ?topLevel . ",
      "}",
      "OPTIONAL {",
        "{",
          "<" + resourceurl + "> <http://scta.info/property/isPartOfStructureItem> ?itemParent . ",
        "}",
        "UNION",
        "{",
          "<" + resourceurl + "> <http://scta.info/property/isPartOfStructureBlock> ?blockParent . ",
          "?blockParent  <http://scta.info/property/isPartOfStructureItem> ?itemParent .",
        "}",
      "}",
      "OPTIONAL {",
        "{",
          "<" + resourceurl + "> <http://scta.info/property/hasCanonicalManifestation> ?cmanifestation . ",
          "?cmanifestation <http://scta.info/property/hasCanonicalTranscription> ?ctranscription . ",
        "}",
        "UNION",
        "{",
          "<" + resourceurl + "> <http://scta.info/property/hasCanonicalTranscription> ?ctranscription . ",
        "}",
        "UNION",
        "{",
          "<" + resourceurl + "> a <http://scta.info/resource/transcription> . ",
          "BIND(<" + resourceurl + "> AS ?ctranscription) .",
        "}",
      "}",
    "}"].join('');
      return query
    }
  //surface id query, gets canvas and manifestation
  export function getSurfaceInfo(surfaceid){
    const query = [
      "SELECT DISTINCT ?surfaceTitle ?isurface ?isurfaceTitle ?icodexTitle ?canvas ?imageurl ?next_surface ?previous_surface ",
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
  				"?canvas <http://www.w3.org/2003/12/exif/ns#height> ?c_height .",
          "}",
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

//surface id query, gets canvas and manifestation
export function getAuthorInformation(authorid){
    const query = [
      "CONSTRUCT",
      "{",
      "?author  <http://purl.org/dc/elements/1.1/title> ?authorTitle ;",
      "<http://scta.info/resource/hasTopLevelExpression> ?expression ;",
      "<http://scta.info/property/authorArticle> ?authorArticle;",
      "<http://scta.info/property/textArticle> ?textArticle .",
    	"?authorArticle <http://purl.org/dc/elements/1.1/title> ?authorArticleTitle . ",
      "?textArticle <http://purl.org/dc/elements/1.1/title> ?textArticleTitle . ",
    	"?expression <http://purl.org/dc/elements/1.1/title> ?topLevelExpressionTitle .",
      "}",
      "WHERE ",
      "{",
      "BIND(<" + authorid + "> as ?author) . ",
      "?author <http://purl.org/dc/elements/1.1/title> ?authorTitle .",
      "OPTIONAL",
      "{",
      "?expression <http://www.loc.gov/loc.terms/relators/AUT> ?author .",
      "?expression a <http://scta.info/resource/expression> .",
      "?expression <http://scta.info/property/level> '1' .",
      "?expression <http://purl.org/dc/elements/1.1/title> ?topLevelExpressionTitle .",
      "}",
      "OPTIONAL",
      "{",
      "?expression2 <http://www.loc.gov/loc.terms/relators/AUT> ?author .",
      "?textArticle <http://scta.info/property/isArticleOf> ?expression2 .",
      "?textArticle <http://purl.org/dc/elements/1.1/title> ?textArticleTitle .",
      "}",
      "OPTIONAL",
      "{",
      "?authorArticle <http://scta.info/property/isArticleOf> ?author .",
      "?authorArticle <http://purl.org/dc/elements/1.1/title> ?authorArticleTitle",
      "}",
      "}"].join('');
      return query
      }

  export function versionHistoryInfo(transcriptionUri){
     	 	const query = [
     	 		"SELECT ?version ?version_shortId ?order_number ?version_label ?review ?doc",
     	    "{",
            "{",
               "BIND(<" + transcriptionUri + "> as ?version) . ",
     	         "?version <http://scta.info/property/shortId> ?version_shortId .",
               "?version <http://scta.info/property/hasDocument> ?doc . ",
     	         "?version <http://scta.info/property/versionOrderNumber> ?order_number .",
     					 "?version <http://scta.info/property/versionLabel> ?version_label .",
     					 "OPTIONAL {",
     					 	"?version <http://scta.info/property/hasReview> ?review .",
     				   "}",
     				 "}",
     	       "UNION",
            "{",
     	         "<" + transcriptionUri + "> <http://scta.info/property/hasAncestor> ?version .",
     					 "?version <http://scta.info/property/shortId> ?version_shortId .",
               "?version <http://scta.info/property/hasDocument> ?doc . ",
     	         "?version <http://scta.info/property/versionOrderNumber> ?order_number .",
     					 "?version <http://scta.info/property/versionLabel> ?version_label .",
     					 "OPTIONAL {",
     					 	"?version <http://scta.info/property/hasReview> ?review .",
     				   "}",
     				 "}",
     	       "UNION",
     	       "{",
     	         "<" + transcriptionUri + "> <http://scta.info/property/hasDescendant> ?version .",
     					 "?version <http://scta.info/property/shortId> ?version_shortId .",
               "?version <http://scta.info/property/hasDocument> ?doc . ",
     	         "?version <http://scta.info/property/versionOrderNumber> ?order_number .",
     					 "?version <http://scta.info/property/versionLabel> ?version_label .",
     					 "OPTIONAL {",
     					 	"?version <http://scta.info/property/hasReview> ?review .",
     				   "}",
     				 "}",
     	     "}",
     	     "ORDER BY DESC(?order_number)"].join('');
           return query
           }

  //gets lines and zone order for
  export function getBlockLines(manifestationBlockId){
     const query = [
       "SELECT ?first ?last ?order ?surface",
       "{",
         "<" + manifestationBlockId + "> <http://scta.info/property/isOnZone> ?zone . ",
         "?zone <http://scta.info/property/isOnZone> ?zone2 .",
         "?zone2 <http://scta.info/property/firstLine> ?first .",
         "?zone2 <http://scta.info/property/lastLine> ?last .",
         "?zone2 <http://scta.info/property/isPartOfSurface> ?surface .",
         "?zone <http://scta.info/property/isOnZoneOrder> ?order .",
       "}"].join('');
       return query
     }

   //gets lines and zone order for
   export function getChildParts(resourceid){
      const query = [
        "SELECT ?part ?title ?level ?order ?structureType ?questionTitle ?author ?authorTitle ?isPartOf ?isPartOfTitle ",
        "{",
          "<" + resourceid + "> <http://purl.org/dc/terms/hasPart> ?part . ",
          "?part <http://purl.org/dc/elements/1.1/title> ?title .",
          "OPTIONAL {",
            "?isPartOf <http://purl.org/dc/terms/hasPart> <" + resourceid + "> .",
            "?isPartOf <http://purl.org/dc/elements/1.1/title> ?isPartOfTitle .",
          "}",
          "OPTIONAL {",
            "?part <http://www.loc.gov/loc.terms/relators/AUT> ?author .",
            "?author <http://purl.org/dc/elements/1.1/title> ?authorTitle .",
          "}",
          "OPTIONAL",
          "{",
          "?part <http://scta.info/property/level> ?level .",
          "}",
          "OPTIONAL",
          "{",
          "?part <http://scta.info/property/structureType> ?structureType .",
          "}",
          "OPTIONAL",
          "{",
            "{",
              "?part <http://scta.info/property/sectionOrderNumber> ?order .",
            "}",
            "UNION",
            "{",
              "?part <http://scta.info/property/isTranscriptionOf> ?mpart . ",
              "?mpart <http://scta.info/property/isManifestationOf> ?epart . ",
              "?epart <http://scta.info/property/sectionOrderNumber> ?order .",
            "}",
            "UNION",
            "{",
              "?part <http://scta.info/property/isManifestationOf> ?epart . ",
              "?epart <http://scta.info/property/sectionOrderNumber> ?order .",
            "}",
          "}",
          "OPTIONAL",
          "{",
          "?part <http://scta.info/property/questionTitle> ?questionTitle .",
          "}",
        "}",
        "ORDER BY ?order"].join('');
        return query
      }
      //gets lines and zone order for
    export function getMembersOf(resourceid){
       const query = [
         "SELECT ?memberOf",
         "{",
           "<" + resourceid + "> <http://scta.info/property/isMemberOf> ?memberOf . ",
         "}"].join('');
         return query
       }

    export function getManifestationCitationInfo(transcriptionid){
       var query = [
       "SELECT DISTINCT ?manifestation ?manifestationTitle ?manifestationSurface ?surfaceTitle ?codexTitle ?datasource ?eLongTitle ?author ?authorTitle ?expression ?editor ?editorTitle",
       "{",
       "<" + transcriptionid + "> <http://scta.info/property/isTranscriptionOf> ?manifestation .",
       "<" + transcriptionid + "> <http://scta.info/property/hasXML> ?datasource . ",
       "?manifestation <http://purl.org/dc/elements/1.1/title> ?manifestationTitle .",
       "{",
        "?manifestation <http://scta.info/property/isPartOfTopLevelManifestation> ?topLevelManifestation .",
       "}",
       "UNION",
       "{",
        "?manifestation <http://scta.info/property/level> '1' .",
        "BIND (?manifestation AS ?topLevelManifestation) .",
       "}",
       "OPTIONAL {",
         "?topLevelManifestation <http://scta.info/property/editor> ?editor .",
         "?editor <http://purl.org/dc/elements/1.1/title> ?editorTitle .",
       "}",
       "?manifestation <http://scta.info/property/isManifestationOf> ?expression .",
       "{",
       "?expression <http://scta.info/property/isPartOfTopLevelExpression> ?topLevelExpression .",
       "}",
       "UNION",
       "{",
        "?expression <http://scta.info/property/level> '1' .",
        "BIND (?expression AS ?topLevelExpression) .",
       "}",
       "OPTIONAL {",
        "?expression <http://scta.info/property/longTitle> ?eLongTitle",
      "}",
       "OPTIONAL {",
         "?topLevelExpression <http://www.loc.gov/loc.terms/relators/AUT> ?author .",
         "?author <http://purl.org/dc/elements/1.1/title> ?authorTitle .",
       "}",
       // # TODO isOnSurface should become more uniform across manifestations in order to simplify this
       "OPTIONAL",
         "{",
         // #option 1 get surfaces for elements and blocks
          "{",
            "?manifestation <http://scta.info/property/isOnZone> ?bn . ",
            "?bn <http://scta.info/property/isOnZone> ?zone .",
            "?zone <http://scta.info/property/isPartOfSurface> ?manifestationSurface .",
          "}",
          "UNION",
          //#option 2 get surface for divisions and items
          "{",
            "?manifestation <http://scta.info/property/hasStructureBlock> ?block .",
            "?block <http://scta.info/property/isOnSurface> ?manifestationSurface .",
          "}",
          "UNION",
          //#option 3 get surfaces for collections"
          "{",
            "?manifestation <http://scta.info/property/hasStructureItem> ?item .",
            "?item <http://scta.info/property/isOnSurface> ?manifestationSurface .",
          "}",
          "?manifestationSurface <http://purl.org/dc/elements/1.1/title> ?surfaceTitle .",
          "?manifestationSurface <http://scta.info/property/order> ?surface_order .",
          "?codex <http://scta.info/property/hasSurface> ?manifestationSurface .",
          "?codex <http://purl.org/dc/elements/1.1/title> ?codexTitle .",
         "}",
       "}",
       "ORDER BY ?surface_order"].join('');
       return query
     }
    

    export function getCodices(){
     const query = [
       "SELECT ?codex ?codex_title",
 	     "{",
				 "?codex a <http://scta.info/resource/codex> .",
				 "?codex <http://purl.org/dc/elements/1.1/title> ?codex_title",
				"}",
			 "ORDER BY ?codex_title"].join('')
       return query
     }
     export function getCodexInfo(codexid){
      const query = [
        "SELECT DISTINCT ?codex ?expression ?codex_title ?item_expression_title ?item_expression_question_title ?surface ?surface_title ?surface_order ?manifestation ?manifestation_short_id ?status ",
        "{",
          "BIND(<" + codexid + "> as ?codex) . ",
          "?codex <http://purl.org/dc/elements/1.1/title> ?codex_title .",
          "OPTIONAL {",
          "?icodex <http://scta.info/property/isCodexItemOf> ?codex .",
          "?isurface <http://purl.org/dc/elements/1.1/isPartOf> ?icodex .",
          "?surface <http://scta.info/property/hasISurface> ?isurface .",
          "?surface <http://scta.info/property/order> ?surface_order .",
          "?surface <http://purl.org/dc/elements/1.1/title> ?surface_title .",
          "?manifestation <http://scta.info/property/isOnSurface> ?surface .",
          "?manifestation <http://scta.info/property/structureType> <http://scta.info/resource/structureItem> .",
          "?manifestation <http://scta.info/property/shortId> ?manifestation_short_id .",
          "?manifestation <http://scta.info/property/isManifestationOf> ?expression .",
          "?expression <http://purl.org/dc/elements/1.1/title> ?item_expression_title .",
          "?expression <http://scta.info/property/status> ?status .",
          "OPTIONAL {",
             "?expression <http://scta.info/property/questionTitle> ?item_expression_question_title .",
           "}",
         "}",
        "}",
        "ORDER BY ?surface_order"].join('')
     return query
   }
   export function getCodexInfoFromManifest(manifestid){
    const query = [
      "SELECT DISTINCT ?codex ?expression ?codex_title ?item_expression_title ?item_expression_question_title ?surface ?surface_title ?surface_order ?manifestation ?manifestation_short_id ?status ",
      "{",
        "?icodex <http://scta.info/property/hasOfficialManifest> <" + manifestid + "> .",
        "?codex <http://scta.info/property/hasCodexItem> ?icodex .",
        "?codex <http://purl.org/dc/elements/1.1/title> ?codex_title .",
        "OPTIONAL {",
        "?icodex <http://scta.info/property/isCodexItemOf> ?codex .",
        "?isurface <http://purl.org/dc/elements/1.1/isPartOf> ?icodex .",
        "?surface <http://scta.info/property/hasISurface> ?isurface .",
        "?surface <http://scta.info/property/order> ?surface_order .",
        "?surface <http://purl.org/dc/elements/1.1/title> ?surface_title .",
        "?manifestation <http://scta.info/property/isOnSurface> ?surface .",
        "?manifestation <http://scta.info/property/structureType> <http://scta.info/resource/structureItem> .",
        "?manifestation <http://scta.info/property/shortId> ?manifestation_short_id .",
        "?manifestation <http://scta.info/property/isManifestationOf> ?expression .",
        "?expression <http://purl.org/dc/elements/1.1/title> ?item_expression_title .",
        "?expression <http://scta.info/property/status> ?status .",
        "OPTIONAL {",
           "?expression <http://scta.info/property/questionTitle> ?item_expression_question_title .",
         "}",
       "}",
      "}",
      "ORDER BY ?surface_order"].join('')
      return query
    }

     export function getCodexInfoFromSurface(surfaceid){
      const query = [
        "SELECT DISTINCT ?codex ?expression ?codex_title ?item_expression_title ?item_expression_question_title ?surface ?surface_title ?surface_order ?manifestation ?manifestation_short_id ?status ",
        "{",
          "?codex <http://scta.info/property/hasSurface> <" + surfaceid + "> .",
          "?codex <http://purl.org/dc/elements/1.1/title> ?codex_title .",
          "OPTIONAL {",
          "?icodex <http://scta.info/property/isCodexItemOf> ?codex .",
          "?isurface <http://purl.org/dc/elements/1.1/isPartOf> ?icodex .",
          "?surface <http://scta.info/property/hasISurface> ?isurface .",
          "?surface <http://scta.info/property/order> ?surface_order .",
          "?surface <http://purl.org/dc/elements/1.1/title> ?surface_title .",
          "?manifestation <http://scta.info/property/isOnSurface> ?surface .",
          "?manifestation <http://scta.info/property/structureType> <http://scta.info/resource/structureItem> .",
          "?manifestation <http://scta.info/property/shortId> ?manifestation_short_id .",
          "?manifestation <http://scta.info/property/isManifestationOf> ?expression .",
          "?expression <http://purl.org/dc/elements/1.1/title> ?item_expression_title .",
          "?expression <http://scta.info/property/status> ?status .",
          "OPTIONAL {",
             "?expression <http://scta.info/property/questionTitle> ?item_expression_question_title .",
           "}",
         "}",
        "}",
        "ORDER BY ?surface_order"].join('')
     return query
   }

   export function getCodexInfoFromCanvas(canvasid){
    const query = [
      "SELECT DISTINCT ?codex ?surfaceFocus ?expression ?codex_title ?item_expression_title ?item_expression_question_title ?surface ?surface_title ?surface_order ?manifestation ?manifestation_short_id ?status ",
      "{",
        "?isurfaceFocus <http://scta.info/property/hasCanvas> <" + canvasid + "> .",
        "?surfaceFocus <http://scta.info/property/hasISurface> ?isurfaceFocus .",
        "?codex <http://scta.info/property/hasSurface> ?surfaceFocus .",
        "?codex <http://purl.org/dc/elements/1.1/title> ?codex_title .",
        "OPTIONAL {",
        "?icodex <http://scta.info/property/isCodexItemOf> ?codex .",
        "?isurface <http://purl.org/dc/elements/1.1/isPartOf> ?icodex .",
        "?surface <http://scta.info/property/hasISurface> ?isurface .",
        "?surface <http://scta.info/property/order> ?surface_order .",
        "?surface <http://purl.org/dc/elements/1.1/title> ?surface_title .",
        "?manifestation <http://scta.info/property/isOnSurface> ?surface .",
        "?manifestation <http://scta.info/property/structureType> <http://scta.info/resource/structureItem> .",
        "?manifestation <http://scta.info/property/shortId> ?manifestation_short_id .",
        "?manifestation <http://scta.info/property/isManifestationOf> ?expression .",
        "?expression <http://purl.org/dc/elements/1.1/title> ?item_expression_title .",
        "?expression <http://scta.info/property/status> ?status .",
        "OPTIONAL {",
           "?expression <http://scta.info/property/questionTitle> ?item_expression_question_title .",
         "}",
       "}",
      "}",
      "ORDER BY ?surface_order"].join('')
      return query
    }

   export function getSearchExpressionList(filters){
     //filters should be an ojbect
     let authorFilter = ""
     if (filters.authorId){
       authorFilter = "BIND(<" + filters.authorId + "> as ?author) . "
     }
     const query = [
       "SELECT DISTINCT ?expressionid ?expressionTitle ?author ?authorTitle ",
       "{",
         authorFilter,
         "?author a <http://scta.info/resource/person> .",
         "?expressionid <http://www.loc.gov/loc.terms/relators/AUT> ?author .",
         "?expressionid a <http://scta.info/resource/expression> .",
         "?expressionid <http://scta.info/property/level> '1' .",
         "?expressionid <http://purl.org/dc/elements/1.1/title> ?expressionTitle .",
         "?author <http://purl.org/dc/elements/1.1/title> ?authorTitle .",
       "}",
       "ORDER BY ?authorTitle"].join('')
    return query
   }
   export function getSearchAuthorList(filters){
     //filters should be an ojbect
     const query = [
       "SELECT DISTINCT ?author ?authorTitle ",
       "{",
          "?author a <http://scta.info/resource/person> .",
          "?expressionid <http://www.loc.gov/loc.terms/relators/AUT> ?author .",
          "?author <http://purl.org/dc/elements/1.1/title> ?authorTitle .",

       "}",
       "ORDER BY ?authorTitle"].join('')
    return query
   }
