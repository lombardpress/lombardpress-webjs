import React from 'react';
import Diff from 'diff-match-patch'
import Axios from 'axios'

import { FaEyeSlash, FaEye, FaStar } from 'react-icons/fa';

class TextCompareItem extends React.Component {
  constructor(props){
    super(props)
    this.handleToggleShow = this.handleToggleShow.bind(this)
    this.mounted = ""
    this.state = {
      compareText: "",
      rawText: "",
      show: true
    }
  }
  handleToggleShow(){
    this.setState((prevState) => {
      return{
        show: !prevState.show
      }
    })
  }
  createCompare(base, transcription){

    Axios.get("http://exist.scta.info/exist/apps/scta-app/csv-pct.xq?resourceid=" + transcription).
          then((text) => {

            const dmp = new Diff.diff_match_patch();

            const diff = dmp.diff_main(base, text.data);
            // Result: [(-1, "Hell"), (1, "G"), (0, "o"), (1, "odbye"), (0, " World.")]
            dmp.diff_cleanupSemantic(diff);
            const ds = dmp.diff_prettyHtml(diff);
            if (this.mounted === true && base){
              this.setState({compareText: ds, rawText: text.data})
            }

          })
        }

  componentDidMount(){
    this.mounted = true;
    this.setState({rawText: "", compareText: ""})
    this.createCompare(this.props.base, this.props.compareTranscription)
  }
  componentWillReceiveProps(newProps){
    // conditional try to restrict new async calls to only when props.info changes
    if (newProps.base != this.props.base || newProps.compareTranscription != this.props.compareTranscription){
      this.setState({rawText: "", compareText: ""})
      this.createCompare(newProps.base, newProps.compareTranscription)
    }
  }
  componentWillUnmount(){
      this.mounted = false;
    }


  render(){
    const displayComparison = () => {
      if (this.props.base && this.state.compareText){
        return (
          <div>
            <span onClick={() => this.handleToggleShow()}>{this.state.show ? <FaEyeSlash/> : <FaEye/>}</span>
            <span onClick={() => this.props.handleChangeBase(this.state.rawText)}><FaStar/></span>
            <div className={this.state.show ? "unhidden" : "hidden"}>
              <div ref="text" dangerouslySetInnerHTML={{ __html: this.state.compareText}}></div>
            </div>
          </div>
        )
      }
      else{
        return <p>Loading</p>
      }
    }

    return (
      displayComparison()
    );
  }
}

export default TextCompareItem;
