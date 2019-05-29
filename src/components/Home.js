import React from 'react';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button';
import Text from './Text';
import Qs from "query-string"



function Home(props) {
  const resourceid = Qs.parse(props.location.search, { ignoreQueryPrefix: true }).resourceid;
  const displayBody = () => {
    if (resourceid){
      return <Text resourceid={props.location.search.resourceid}/>
    }
    else
    return (
      <div className="Home">
        <Container id="lbp-home" fluid>
            <Container>
              <Jumbotron id="lbp-jumbo">
              	<h1>The SCTA Reading Room</h1>
              	<p>A site for reading, viewing, and studying the scholastic tradition</p>
                <Button>View the text</Button> | <Button>Learn More</Button>
              </Jumbotron>
            </Container>
          </Container>
          </div>
    )
  }
  return (
    displayBody()
  )
}

export default Home;
