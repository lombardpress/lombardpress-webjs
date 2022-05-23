import React, {useState, useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import {Link} from 'react-router-dom';
import Spinner from './Spinner';
import {runQuery} from './utils'
import {getResources} from '../queries/resourceTypeQuery'


const ResourceTypeList = (props) => {
  const [resources, setResources] = useState([])
  const [filter, setFilter] = useState("")

  useEffect(() => {
    const results = runQuery(getResources(props.resourceTypeId))
    setResources("fetching")
    results.then((d) => {
      setResources(d.data.results.bindings)
    })
  }, [props.resourceTypeId])
  return (
    <Container className="collectionBody">
      <h1>{props.resourceTypeId}</h1>
      <Form.Control as="input" type="text" placeholder="filter" onChange={(e) => setFilter(e.target.value)} value={filter}/>
      {resources === "fetching" ? <Spinner/> :
      resources.map((r) => {
        //check against error resources with ids
        if (r.resource.value !== "http://scta.info/resource/"){
          if (r.resourceTitle.value.toLowerCase().includes(filter.toLowerCase())){
            return <p key={r.resource.value}><Link to={"/text?resourceid=" + r.resource.value}>{r.resourceTitle.value}</Link></p>
          }
          else{
            return null
          }
        }
        else{ 
          return null
        }
      })
    }
    </Container>

  )
}

export default ResourceTypeList;
