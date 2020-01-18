import React from 'react';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button';
import {Link} from 'react-router-dom';
import {resourceEndpoint} from './config';
import {useTranslation} from 'react-i18next'



function Home(props) {
  const {t, i18n} = useTranslation();
  //const resourceid = props.location ? Qs.parse(props.location.search, { ignoreQueryPrefix: true }).resourceid : null;
  const displayBody = () => {
    // if (resourceid){
    //   return <Text resourceid={props.location.search.resourceid}/>
    // }
    // else
    return (
      <div className="Home">
        <Container id="lbp-home" fluid>
            <Container>
              <Jumbotron id="lbp-jumbo">
              	<h1>{t("Title")} TEST Change on develop</h1>
                <p>{t("Subtitle")}</p>
                <Button><Link className="nav-link" to={"/text?resourceid=" + resourceEndpoint} style={{color: "black"}}>{t("Enter")}</Link></Button>
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
