import React from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios'
import Alert from 'react-bootstrap/Alert';
import { withTranslation } from 'react-i18next';

import {runQuery} from './utils'
import {versionHistoryInfo} from './Queries'

class VersionChain extends React.Component {
  constructor(props){
    super(props)
    this.getVersionHistory = this.getVersionHistory.bind(this)
    this.handleToggleShowVersions = this.handleToggleShowVersions.bind(this)
    this.state = {
      versions: [],
      currentVersion: "",
      showVersions: false
    }
  }
  handleToggleShowVersions(){
    this.setState((prevState) => {
      return {showVersions: !prevState.showVersions}
    })
  }
  getVersionHistory(transcriptionid){
      const versionChainInfo = runQuery(versionHistoryInfo(transcriptionid))
      versionChainInfo.then((d) => {
        const b = d.data.results.bindings
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
                currentVersion: transcriptionid
              }
            })
          })
        })
      })
    }
  componentDidMount(){
    //prevents call when itemInfo prop is not present
    if (this.props.transcriptionid){
      this.getVersionHistory(this.props.transcriptionid)
    }
  }
  componentDidUpdate(prevProps, prevState){
    if (this.props.transcriptionid !== prevProps.transcriptionid){
      console.log('running fetch')
      this.setState({versions: []}, () => {
        this.getVersionHistory(this.props.transcriptionid)
      })
    }
}
  render(){
    const { t } = this.props;
    const displayVersions = () => {
      const versions = this.state.versions.map((v) => {
        const currentlyViewing = v.versionTranscription === this.state.currentVersion ? "currentlyViewing" : ""
        const gitHubEdit = v.versionDoc.includes("github.com") && v.versionDoc.replace("/raw/", "/edit/")
        return (<p key={v.versionTranscription} className={currentlyViewing}>
          {currentlyViewing ? <span>{v.versionLabel} {t("(Currently Viewing)")}</span> : <span className="lbp-span-link" onClick={()=>{this.props.handleFocusChange(v.versionTranscription)}}>{v.versionLabel}</span>}
          {v.versionReviewInfo.html_link && <span> {t("Peer Reviewed")}: <a href={v.versionReviewInfo.html_link}><img alt="review" src={v.versionReviewInfo.img_url}/></a> </span>}
          <span className="small"> {t("Data Source")}: <a href={v.versionDoc}>{v.versionDoc}</a> </span>
          {gitHubEdit && <span className="small"> | <a href={gitHubEdit} target="_blank" rel="noopener noreferrer"> Edit on <img src="github-octocat-logo.png" alt="github" height="25px"/> Github</a></span>}
          </p>)
      })
      return versions
    }
    const displayAlert = () => {
      if (this.state.versions){
        if (this.state.versions.length > 1){
          return (
            <Alert variant="info">
              <p onClick={this.handleToggleShowVersions}>{t("This Text Has Multiple Indexed Versions")}</p>
              {this.state.showVersions && displayVersions()}
            </Alert>
          )
        }
        else if (this.state.versions.length === 1){
          const version = this.state.versions[0]
          const gitHubEdit = version.versionDoc.includes("github.com") && version.versionDoc.replace("/raw/", "/edit/")
          return (<Alert variant="info">
            <span>{t("Version")}: {version.versionLabel} 
            | 
            {t("Data Source")}: <a href={version.versionDoc}>{version.versionDoc}</a> 
            </span>
            {gitHubEdit && <span className="small"> | <a href={gitHubEdit} target="_blank" rel="noopener noreferrer"> Edit on <img src="github-octocat-logo.png" alt="github" height="25px"/> Github</a></span>}
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
VersionChain.propTypes = {
  /**
  * transcription resource id of focused passage,
  * transcription id is required, because a specific text passage is being complicated
  */
  transcriptionid: PropTypes.string.isRequired,
  /**
  * handleFocusChange; a function carrying desired behavior
  * when you user selects non-current version
  */
  handleFocusChange: PropTypes.func.isRequired
}

export default withTranslation()(VersionChain);
