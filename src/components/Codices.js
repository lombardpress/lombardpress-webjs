import React from 'react';

import Container from 'react-bootstrap/Container';

import CodexListItem from './CodexListItem'
import {runQuery} from './utils'
import {getCodices} from './Queries'

class Codices extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      codices: []
    }
  }
  retrieveCodices(){
    const codicesInfo = runQuery(getCodices())
    codicesInfo.then((d) => {
      const codices = this.arrangeCodexInfo(d.data.results.bindings)
      this.setState({codices: codices})
    })

  }
  arrangeCodexInfo(data){
    const codices = data.map((d) => {
      return {
        codexid: d.codex ? d.codex.value : "",
        title: d.codex_title ? d.codex_title.value : ""
      }
    })
    return codices
  }
  componentDidMount(){
    this.retrieveCodices()
  }
  render(){
    const displayCodices = () => {
      const codices = this.state.codices.map((d) => {
        return <CodexListItem key={d.id} codexid={d.codexid} title={d.title}/>
      })
      return codices
    }
  return (
    <Container className="Codices">
    <h1>Codices</h1>
    {displayCodices()}
    </Container>
  );
}
}

export default Codices;
