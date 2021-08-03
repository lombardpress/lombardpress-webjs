//note; each query here represents an attempt an efficient single request for related information
//each query therefore could be tranformed into a restful api


 export function getSurfaceInfo(surfaceid){
   const query = [
     "CONSTRUCT",
     "{",
     "?expression <http://scta.info/property/hasManifestation> ?manifestation2 .",
     "?manifestation2 <http://scta.info/property/isOnSurface> ?surface2 .",
     "}",
     "WHERE",
     "{",
     "?manifestation <http://scta.info/property/isOnSurface> <" + surfaceid + "> .",
     "?manifestation <http://scta.info/property/structureType> <http://scta.info/resource/structureBlock> .",
     "?manifestation <http://scta.info/property/isManifestationOf> ?expression .",
     "?expression <http://scta.info/property/totalOrderNumber> ?order .",
     "?expression <http://scta.info/property/hasManifestation> ?manifestation2 .",
     "?manifestation2 <http://scta.info/property/isOnSurface> ?surface2 .",
     "?codex <http://scta.info/property/hasSurface> ?surface2 .",
     "}"
   ].join('');
   return query
 }
