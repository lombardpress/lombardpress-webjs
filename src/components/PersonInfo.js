import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import Axios from 'axios'
import {runQuery} from './utils';
import Container from 'react-bootstrap/Container';

import {getPersonInfo, getPersonMentionedByFrequency, getPersonMentionsFrequency} from '../queries/personInfoQuery';


function PersonInfo(props) {
  const [authorTitle, setAuthorTitle] = useState()
  const [authorImageUrl, setAuthorImageUrl] = useState()
  const [authorDescription, setAuthorDescription] = useState()
  const [birthDate, setAuthorBirthDate] = useState()
  const [deathDate, setAuthorDeathDate] = useState()
  const [mentionedByFrequency, setMentionedByFrequency] = useState([])
  const [mentionsFrequency, setMentionsFrequency] = useState([])
  useEffect(() => {
      setMentionedByFrequency([]);
      setMentionsFrequency([]);
      setAuthorImageUrl("");
      setAuthorDescription("");
      setAuthorBirthDate("");
      setAuthorDeathDate("");
      setAuthorTitle("");


      const personInfo = runQuery(getPersonInfo(props.resourceid))
      personInfo.then((pd) => {
        const bindings = pd.data.results.bindings
        if (bindings.length > 0){
          const personTitle = bindings[0].authorTitle && bindings[0].authorTitle.value;
          const wikidataid = bindings[0].wikidataid && bindings[0].wikidataid.value;
          setAuthorTitle(personTitle)
          wikidataid && getWikiDataInfo(wikidataid)
        }
      })
      const mentionedByfreq = runQuery(getPersonMentionedByFrequency(props.resourceid))
      mentionedByfreq.then((fd) => {
        const bindings = fd.data.results.bindings
        //TODO; this conditional is extremely hacking; window component is passing not person id at the same time that is passing personView=true
        // this needs to be corrected, but the conditions is checking for null results when using the wrong id
        if (bindings.length > 0 && bindings[0].count.value !== "0"){
          
          // sort by name
          bindings.sort(sortFrequencyResults);
          const results = bindings.map((item) => {
            
            return (
              <p key={item.author.value}>
                <Link to={"/text?resourceid=" + item.author.value}>{item.authorTitle.value}</Link>:
                 {item.count.value}
                 </p>
            )
          })
          setMentionedByFrequency(results);
          
        }
        })
      
      

      const mentionsFreq = runQuery(getPersonMentionsFrequency(props.resourceid))
      mentionsFreq.then((fd) => {
        const bindings = fd.data.results.bindings
        //TODO; this conditional is extremely hacking; window component is passing not person id at the same time that is passing personView=true
        // this needs to be corrected, but the conditions is checking for null results when using the wrong id
        if (bindings.length > 0 && bindings[0].count.value !== "0"){
        // sort by name
        bindings.sort(sortFrequencyResults);
        const results = bindings.map((item, idx) => {
          
          return (
            <p key={idx + "-" + item.author.value}>
              <Link to={"/text?resourceid=" + item.author.value}>{item.authorTitle.value}</Link>: 
              {item.count.value}
              </p>
          )
        })
        setMentionsFrequency(results);
      }
      })
    }, [props.resourceid]);

  const sortFrequencyResults = (a, b) => {
      //order by author name
       const nameA = a.authorTitle.value.toUpperCase(); // ignore upper and lowercase
       const nameB = b.authorTitle.value.toUpperCase(); // ignore upper and lowercase
      // order by frequency 
      //const nameA = parseInt(a.count.value); // ignore upper and lowercase
      //const nameB = parseInt(b.count.value); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1; //switch to 1 to reverse order
      }
      if (nameA > nameB) {
        return 1; //switch to -1 to reverse order
      }
      // names must be equal
      return 0;
    }
  const getWikiDataInfo = (wikidataid) => {
    const wikidataShortId = wikidataid.split("/entity/")[1];
    Axios.get("https://www.wikidata.org/w/api.php?origin=*&action=wbgetentities&ids=" + wikidataShortId + "&format=json").then((wd)=> {
        const imageslug = wd.data.entities[wikidataShortId].claims.P18 && wd.data.entities[wikidataShortId].claims.P18[0].mainsnak.datavalue.value;
        const description = wd.data.entities[wikidataShortId].descriptions["en"] && wd.data.entities[wikidataShortId].descriptions["en"].value;
        const birthDate = wd.data.entities[wikidataShortId].claims.P569 && wd.data.entities[wikidataShortId].claims.P569[0].mainsnak.datavalue.value.time;
        const deathDate = wd.data.entities[wikidataShortId].claims.P570 && wd.data.entities[wikidataShortId].claims.P570[0].mainsnak.datavalue.value.time;
        Axios.get("https://commons.wikimedia.org/w/api.php?origin=*&action=query&prop=imageinfo&iiprop=url&redirects&format=json&titles=File:" + imageslug).then((d3) => {
          const pages = d3.data.query.pages
          const page = Object.keys(pages)[0];
          const imageurl = d3.data.query.pages[page].imageinfo && d3.data.query.pages[page].imageinfo[0].url
          
        setAuthorImageUrl(imageurl)
        setAuthorDescription(description)
        //setAuthorBirthDate(new Date(birthDate.split('+')[1]).toDateString())
        //setAuthorDeathDate(new Date(deathDate.split('+')[1]).toDateString())
        setAuthorBirthDate(parseInt(birthDate));
        setAuthorDeathDate(parseInt(deathDate));
        })
        
        
      });

  }
  return (
    <div className={props.hidden ? "hidden" : "showing"}>
      <Container>
    <h1>PersonInfo for {authorTitle} {birthDate && "(" + birthDate + "-" + deathDate + ")"}</h1>
    <div style={{display: "flex", justifyContent: "left"}}>
    { authorImageUrl && <img alt="author" src={authorImageUrl} width="100px"/>}
    <p style={{marginLeft: "10px"}}>{authorDescription} {authorDescription && "(wikidata)"}</p>
    </div>
    <div>
      <h1>Discussed/Mentioned By Frequency</h1>
        {mentionedByFrequency}
    </div>
    <div>
      <h1>Discusses/Mentions Frequency</h1>
        {mentionsFrequency}
    </div>
    </Container>

    </div>
  );
}

export default PersonInfo;