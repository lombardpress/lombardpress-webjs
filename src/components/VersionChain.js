import React from 'react';

import {Link} from 'react-router-dom';
import Axios from 'axios'
import Alert from 'react-bootstrap/Alert';

import {runQuery} from './utils'
import {versionHistoryInfo} from './Queries'

class VersionChain extends React.Component {
  constructor(props){
    super(props)
    this.getVersionHistory = this.getVersionHistory.bind(this)
    this.handleToggleShowVersions = this.handleToggleShowVersions.bind(this)
    this.state = {
      versions: [],
      currentVersion: {},
      showVersions: false
    }
  }
  handleToggleShowVersions(){
    this.setState((prevState) => {
      return {showVersions: !prevState.showVersions}
    })
  }
  getVersionHistory(itemInfo){
      const versionChainInfo = runQuery(versionHistoryInfo(itemInfo.transcriptionid))
      versionChainInfo.then((d) => {
        const b = d.data.results.bindings
        const versions = []
        b.forEach((b, i) => {
          var reviewUrl = "https://dll-review-registry.scta.info/api/v1/reviews/?url=" + b.doc.value + "?society=MAA"
          Axios(reviewUrl).then((d2) => {
            const data = d2.data
            var reviewObject = {}
            if (data.length > 0){
              reviewObject = {
                img_url: data[0]["badge-url"],
                reviewid: data[0]["id"],
                ipfsHash: data[0]["ipfs-hash"],
                html_link: "https://dll-review-registry.scta.info/reviews/" + data[0]["id"] + ".html",
                rubric_link: data[0]["badge-rubric"],
                summary: data[0]["review-summary"]
              }
            }
            this.setState((prevState) => {
              const newVersion = {
                versionTranscription: b.version ? b.version.value : "",
                versionLabel: b.version_label ? b.version_label.value : "",
                versionOrderNumber: b.order_number ? b.order_number.value : "",
                versionReview: b.review ? b.review.value : "",
                versionDoc: b.doc ? b.doc.value : "",
                versionReviewInfo: reviewObject,
              }
              return {
                versions: [...prevState.versions, newVersion],
                currentVersion: itemInfo
              }
            })
          })
        })
      })
    }
  componentDidMount(){
    //this.setState({versions: []}, () => {
      this.getVersionHistory(this.props.itemInfo)
    //})
  }
  componentWillReceiveProps(newProps){
      if (newProps.itemInfo.transcriptionid !== this.props.itemInfo.transcriptionid){
        this.setState({versions: []}, () => {
          this.getVersionHistory(newProps.itemInfo)
        })
      }


  }
  render(){
    const displayVersions = () => {
      const versions = this.state.versions.map((v) => {
        const currentlyViewing = v.versionTranscription === this.state.currentVersion.transcriptionid ? "currentlyViewing" : ""
        return (<p key={v.versionTranscription} className={currentlyViewing}>
          {currentlyViewing ? <span>{v.versionLabel} (Currently Viewing)</span> : <Link to={"/text?resourceid=" + v.versionTranscription}>{v.versionLabel}</Link>}
          {v.versionReviewInfo.html_link && <span> Peer Reviewed: <a href={v.versionReviewInfo.html_link}><img src={v.versionReviewInfo.img_url}/></a> </span>}
          <span class="small"> Data Source: <a href={v.versionDoc}>{v.versionDoc}</a> </span>
          </p>)
      })
      return versions
    }
    const displayAlert = () => {
      if (this.state.versions){
        if (this.state.versions.length > 1){
          return (
            <Alert variant="info">
              <p onClick={this.handleToggleShowVersions}>This Text Has Multiple Indexed Versions</p>
              {this.state.showVersions && displayVersions()}
            </Alert>
          )
        }
        else if (this.state.versions.length === 1){
          const version = this.state.versions[0]
          return (<Alert variant="info">
            <span>Version: {version.versionLabel} | Data Source: <a href={version.versionDoc}>{version.versionDoc}</a> </span>
          </Alert>
          )
        }
        else{
          return null
        }
      }
      else {
        return null
      }
    }
    return (
      displayAlert()

    );
  }
}

export default VersionChain;
