import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import Axios from 'axios'
import {runQuery} from './utils';
import Container from 'react-bootstrap/Container';

import {getPersonMentionedByFrequency, getPersonMentionsFrequency} from '../queries/personInfoQuery';


function PersonInfo(props) {
  const [authorTitle, setAuthorTitle] = useState()
  const [authorImageUrl, setAuthorImageUrl] = useState()
  const [mentionedByFrequency, setMentionedByFrequency] = useState([])
  const [mentionsFrequency, setMentionsFrequency] = useState([])
  console.log("test", props.resourceid)
  useEffect(() => {
    setMentionedByFrequency([])
    setMentionsFrequency([])
      const mentionedByfreq = runQuery(getPersonMentionedByFrequency(props.resourceid))
      mentionedByfreq.then((fd) => {
        console.log(fd)
        const bindings = fd.data.results.bindings
        //TODO; this conditional is extremely hacking; window component is passing not person id at the same time that is passing personView=true
        // this needs to be corrected, but the conditions is checking for null results when using the wrong id
        if (bindings.length > 0 && bindings[0].count.value !== "0"){
          const personTitle = bindings[0].personTitle.value;
          // sort by name
          bindings.sort(function(a, b) {
            // const nameA = a.authorTitle.value.toUpperCase(); // ignore upper and lowercase
            // const nameB = b.authorTitle.value.toUpperCase(); // ignore upper and lowercase
            const nameA = parseInt(a.count.value); // ignore upper and lowercase
            const nameB = parseInt(b.count.value); // ignore upper and lowercase
            if (nameA < nameB) {
              return 1;
            }
            if (nameA > nameB) {
              return -1;
            }

            // names must be equal
            return 0;
          });
          const results = bindings.map((item) => {
            
            return (
              <p key={item.author.value}>
                <Link to={"/text?resourceid=" + item.author.value}>{item.authorTitle.value}</Link>:
                 {item.count.value}
                 </p>
            )
          })
          setMentionedByFrequency(results);
          setAuthorTitle(personTitle)
        }
        })
      

      const mentionsFreq = runQuery(getPersonMentionsFrequency(props.resourceid))
      mentionsFreq.then((fd) => {
        console.log(fd)
        const bindings = fd.data.results.bindings
        //TODO; this conditional is extremely hacking; window component is passing not person id at the same time that is passing personView=true
        // this needs to be corrected, but the conditions is checking for null results when using the wrong id
        if (bindings.length > 0 && bindings[0].count.value !== "0"){
        // sort by name
        bindings.sort(function(a, b) {
          // const nameA = a.authorTitle.value.toUpperCase(); // ignore upper and lowercase
            // const nameB = b.authorTitle.value.toUpperCase(); // ignore upper and lowercase
            const nameA = parseInt(a.count.value); // ignore upper and lowercase
            const nameB = parseInt(b.count.value); // ignore upper and lowercase
          if (nameA < nameB) {
            return 1;
          }
          if (nameA > nameB) {
            return -1;
          }

          // names must be equal
          return 0;
        });
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


      //const wikidataid = "Q43936" //ockham
      //const wikidataid = "Q9438" //Aquinas
      // getWikiData()
    }, [props.resourceid]);

  const getWikiDataInfo = (wikidataid) => {
    Axios.get("https://www.wikidata.org/w/api.php?action=wbgetentities&ids=" + wikidataid + "&format=json").then((wd)=> {
        console.log(wd);
        const imageslug = wd.data.entities[wikidataid].claims.P18[0].mainsnak.datavalue.value;
        Axios.get("https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url&redirects&format=json&titles=File:" + imageslug).then((d3) => {
          const pages = d3.data.query.pages
          const page = Object.keys(pages)[0];
          const imageurl = d3.data.query.pages[page].imageinfo[0].url
          
        setAuthorImageUrl(imageurl)
        })
        
        
      });

  }
  return (
    <div className={props.hidden ? "hidden" : "showing"}>
      <Container>
    <h1>PersonInfo for {authorTitle}</h1>
    <img src={authorImageUrl} width="100px"/>
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