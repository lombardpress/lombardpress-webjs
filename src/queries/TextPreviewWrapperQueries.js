 export function getCanonicalTranscription(resourceid){
   const query = [
      "SELECT DISTINCT ?ctranscription ?longTitle ",
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
        "?ctranscription <http://scta.info/property/isTranscriptionOf> ?m .",
        "?m <http://scta.info/property/isManifestationOf> ?e .",
        "?e <http://scta.info/property/longTitle> ?longTitle .",
      "}"
      ].join(' ');
  return query
 }
