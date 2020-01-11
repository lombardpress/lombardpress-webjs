import React from 'react';
import Diff from 'diff-match-patch'
import Axios from 'axios'
import Spinner from './Spinner';
import {Link} from 'react-router-dom';

import { FaEyeSlash, FaEye, FaStar, FaToggleOn, FaToggleOff} from 'react-icons/fa';

class TextCompareItem extends React.Component {
  constructor(props){
    super(props)
    this.handleToggleShow = this.handleToggleShow.bind(this)
    this.handleToggleCompare = this.handleToggleCompare.bind(this)
    this.mounted = ""
    this.state = {
      showCompare: true,
      compareText: "",
      rawText: "",
      show: true,
      levenshteinDistance: undefined
    }
  }
  handleToggleShow(){
    this.setState((prevState) => {
      return{
        show: !prevState.show
      }
    })
  }
  handleToggleCompare(){
    this.setState((prevState) => {
      return{
        showCompare: !prevState.showCompare
      }
    })
  }
  textClean(text){
    const punctuationless = text.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"");
    const finalString = punctuationless.replace(/\s{2,}/g," ");
    const finalFinalString = finalString.toLowerCase()
    return finalFinalString

  }
  createCompare(base, transcription){

    Axios.get("http://exist.scta.info/exist/apps/scta-app/csv-pct.xq?resourceid=" + transcription)
          .then((text) => {

            const dmp = new Diff.diff_match_patch();
            const diff = dmp.diff_main(this.textClean(base), this.textClean(text.data));
            // Result: [(-1, "Hell"), (1, "G"), (0, "o"), (1, "odbye"), (0, " World.")]
            dmp.diff_cleanupSemantic(diff);
            const levenshteinDistance = dmp.diff_levenshtein(diff)
            const ds = dmp.diff_prettyHtml(diff);
            if (this.mounted === true && base){
              this.setState({compareText: ds, rawText: text.data, levenshteinDistance: levenshteinDistance})
            }
            else if(this.mounted){
              this.setState({rawText: text.data})
            }

          })
        }

  componentDidMount(){
    this.mounted = true;
    this.setState({rawText: "", compareText: ""})
    this.createCompare(this.props.base, this.props.compareTranscription)
  }
  UNSAFE_componentWillReceiveProps(newProps){
    // conditional try to restrict new async calls to only when props.info changes
    if (newProps.base !== this.props.base || newProps.compareTranscription !== this.props.compareTranscription){
      this.setState({rawText: "", compareText: ""})
      this.createCompare(newProps.base, newProps.compareTranscription)
    }

  }
  componentWillUnmount(){
      this.mounted = false;
    }


  render(){
    const displayComparison = () => {
      const isBase = this.props.base === this.state.rawText
      if (this.state.showCompare && this.props.base && this.state.compareText){
        const levenNum = this.state.levenshteinDistance
        const heatColor = levenNum * 5
        return (
          <div style={{borderLeft: "5px solid rgba(" + heatColor + ", 0, 255, 1)", paddingLeft: "5px"}}>
            <span><Link to={"/text?resourceid=" + this.props.compareTranscription}>{this.props.compareTranscription}</Link> </span>
            <span className="lbp-span-link" title="show/hide" onClick={() => this.handleToggleShow()}>{this.state.show ? <FaEyeSlash/> : <FaEye/>}</span>
            <span className="lbp-span-link" title="toggle comparison off" onClick={() => this.handleToggleCompare()}><FaToggleOn/></span>
            {!isBase && <span className="lbp-span-link" title="set as base" onClick={() => this.props.handleChangeBase(this.state.rawText)}><FaStar/></span>}
            <span style={{fontSize: "14px", paddingLeft: "4px"}} title="levenshtein distance">{levenNum}</span>
            <div className={this.state.show ? "unhidden" : "hidden"}>
              <div ref="text" dangerouslySetInnerHTML={{ __html: this.state.compareText}}></div>


            </div>
          </div>
        )
      }
      else if (this.state.rawText){
        return (
          <div>
            <span><Link to={"/text?resourceid=" + this.props.compareTranscription}>{this.props.compareTranscription}</Link></span> |
            <span className="lbp-span-link" title="show/hide" onClick={() => this.handleToggleShow()}>{this.state.show ? <FaEyeSlash/> : <FaEye/>}</span>
            <span className="lbp-span-link" title="toggle comparison on" onClick={() => this.handleToggleCompare()}><FaToggleOff/></span>
            {!isBase && <span className="lbp-span-link" title="set as base" onClick={() => this.props.handleChangeBase(this.state.rawText)}><FaStar/></span>}

            <div className={this.state.show ? "unhidden" : "hidden"}>
              <div ref="text" dangerouslySetInnerHTML={{ __html: this.state.rawText}}></div>
            </div>
          </div>
        )
      }
      else{
        return <Spinner/>
      }
    }

    return (
      displayComparison()
    );
  }
}

export default TextCompareItem;
