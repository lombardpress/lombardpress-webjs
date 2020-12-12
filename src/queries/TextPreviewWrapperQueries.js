 export function getCanonicalTranscription(resourceid){
   const query = [
      "SELECT DISTINCT ?ctranscription ",
      "WHERE { ",
        "{",
          "<" + resourceid + "> <http://scta.info/property/hasCanonicalManifestation> ?manifestation .",
          "?manifestation <http://scta.info/property/hasCanonicalTranscription> ?ctranscription .",
        "}",
        "UNION",
        "{",
          "BIND(<" + resourceid + "> AS ?ctranscription ) . ",
          "?ctranscription a <http://scta.info/resource/transcription> .",
        "}",
        "UNION",
        "{",
          "<" + resourceid + "> <http://scta.info/property/hasCanonicalTranscription> ?ctranscription .",
        "}",
      "}"
      ].join('');
  return query
 }
