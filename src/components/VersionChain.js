import React from 'react';



import {runQuery} from './utils'
import {versionHistoryInfo} from './Queries'

class VersionChain extends React.Component {
  constructor(props){
    super(props)
    this.getVersionHistory = this.getVersionHistory.bind(this)
    this.state = {
      versions: [],
      currentVersion: {}
    }
  }
  getVersionHistory(itemInfo){
    console.log("id", itemInfo.transcriptionid)
    const versionChainInfo = runQuery(versionHistoryInfo(itemInfo.transcriptionid))
    versionChainInfo.then((d) => {
      console.log("d", d)
      const b = d.data.results.bindings
      const versions = []
      b.forEach((b) => {
        versions.push({
          versionTranscription: b.version ? b.version.value : "",
          versionLabel: b.version_label ? b.version_label.value : "",
          versionOrderNumber: b.version_label ? b.version_label.value : "",
          versionReview: b.review ? b.review.value : "",
        })
      })
      this.setState({versions: versions, currentVersion: itemInfo})
    })
  }
  componentDidMount(){
    this.getVersionHistory(this.props.itemInfo)
  }
  componentWillReceiveProps(newProps){
    if (newProps.itemInfo !== this.props.itemInfo){
      this.getVersionHistory(newProps.itemInfo)
    }
  }
  render(){
    const displayVersions = () => {
      const versions = this.state.versions.map((v) => {
        return (<p>{v.versionLabel}: {v.versionOrderNumber} - {v.versionReview && "reviewed"}</p>)
      })
      return versions
    }
    return (
      <div className="VersionChain">
        {this.state.currentVersion && <p>{this.state.currentVersion.tVersionLabel}: {this.state.currentVersion.tVersionOrderNumber} - {this.state.currentVersion.tHasReview && "reviewed"}</p>}
        {displayVersions()}
      </div>
    );
  }
}

export default VersionChain;
