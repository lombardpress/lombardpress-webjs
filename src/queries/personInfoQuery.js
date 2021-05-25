export function getPersonInfo(resourceid){
  const query = [
    "SELECT ?author ?authorTitle ?wikidataid",
    "{",
        "BIND(<" + resourceid + "> AS ?author) .",
        "?author <http://purl.org/dc/elements/1.1/title> ?authorTitle ." ,
        "OPTIONAL {",
          "?author <http://www.w3.org/2002/07/owl#sameAs> ?wikidataid .",
          "FILTER(regex(str(?wikidataid), 'http://www.wikidata.org' ))",
        "}",
     "}",
    "ORDER BY ?authorTitle"].join(' ')
 return query
}

export function getPersonMentionedByFrequency(personid){

      var query = [
        "select ?personTitle ?author ?authorTitle (count(?ref) as ?count)" ,
        "where {",

        "?ref <http://scta.info/property/structureElementType> <http://scta.info/resource/structureElementName> .",
			  "?ref <http://scta.info/property/isInstanceOf> <" + personid + "> .",
        "<" + personid + "> <http://purl.org/dc/elements/1.1/title> ?personTitle .",
        "?ref <http://scta.info/property/isPartOfTopLevelExpression> ?refTopLevel .",
        "?refTopLevel <http://www.loc.gov/loc.terms/relators/AUT> ?author .",
        "?author <http://purl.org/dc/elements/1.1/title> ?authorTitle .",
        "}",
        "GROUP BY ?author ?authorTitle ?personTitle"
      ].join('');

    
    return query;
}

export function getPersonMentionsFrequency(personid){

  

  var query = [
    "select ?author ?authorTitle (count(?ref) as ?count)",
    "where {",
      "?sourceTopLevel <http://www.loc.gov/loc.terms/relators/AUT> <" + personid + "> .",
      "?sourceTopLevel <http://scta.info/property/level> '1' .",
      "?ref <http://scta.info/property/isPartOfTopLevelExpression> ?sourceTopLevel .",
      "?ref <http://scta.info/property/structureElementType> <http://scta.info/resource/structureElementName> .",
      "?ref <http://scta.info/property/isInstanceOf> ?author .",
      "?author <http://purl.org/dc/elements/1.1/title> ?authorTitle .",
    "}",
    "GROUP BY ?author ?authorTitle",
  ].join('');
return query;
}