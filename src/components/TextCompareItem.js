import React from 'react';
import Diff from 'diff-match-patch'
import Axios from 'axios'
import PropTypes from 'prop-types';

import Spinner from './Spinner';
import {Link} from 'react-router-dom';
import { FaEyeSlash, FaEye, FaStar, FaToggleOn, FaToggleOff, FaRegImage} from 'react-icons/fa';

import {textReduce} from './utils'

import Surface3Wrapper from './Surface3Wrapper'

class TextCompareItem extends React.Component {
  constructor(props){
    super(props)
    this.handleToggleShow = this.handleToggleShow.bind(this)
    this.handleToggleCompare = this.handleToggleCompare.bind(this)
    this.mounted = ""
    this.state = {
      showCompare: false,
      compareText: "",
      rawText: "",
      show: true,
      levenshteinDistance: undefined, 
      usedBase: undefined,
      usedCompareTranscription: undefined
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
    Axios.get("https://exist.scta.info/exist/apps/scta-app/csv-pct.xq?resourceid=" + transcription)
          .then((text) => {
            let reducedText = text.data;
            if (this.props.isMainText && this.props.targetRange){
              reducedText = textReduce(text.data, this.props.targetRange)
            }
            // this conditional should exclude most relations (or relations initated by a structureElement type)
            else if (this.props.relationLabel === 'isQuotedBy' || this.props.relationLabel === 'isReferencedBy'){
              reducedText = text.data
            }
            else if (this.props.isRelatedToRange){
              reducedText = textReduce(text.data, this.props.isRelatedToRange)
            }
            //function needed for word level comparison
            //see https://github.com/google/diff-match-patch/wiki/Line-or-Word-Diffs
            // also required for of npm google-diff-patch and then added function wordsToChars_()
            const diff_wordMode = (text1, text2, dmp) => {
              //var dmp = new Diff.diff_match_patch();
              var a = dmp.diff_wordsToChars_(text1, text2);
              var lineText1 = a.chars1;
              var lineText2 = a.chars2;
              var lineArray = a.lineArray;
              var diffs = dmp.diff_main(lineText1, lineText2, false);
              dmp.diff_charsToLines_(diffs, lineArray);
              return diffs;
            }

            const dmp = new Diff.diff_match_patch();

            //NOTE: uncomment below if you want to switch back to character level diff
            //const diff = dmp.diff_main(this.textClean(base), this.textClean(text.data)); //character level diff
            const diff = diff_wordMode(this.textClean(base), this.textClean(reducedText), dmp) // word level diff
            // Result: [(-1, "Hell"), (1, "G"), (0, "o"), (1, "odbye"), (0, " World.")]
            dmp.diff_cleanupSemantic(diff);
            const levenshteinDistance = dmp.diff_levenshtein(diff)
            const ds = dmp.diff_prettyHtml(diff);
            if (this.mounted === true && base){
              // TODO: setting showCompare to "derivedState" is an ANTI-PATTERN. Better would be to let it be entirely controlled by parent. 
              // NOTE: usedBase and usedCompare transcription are used to record data used to make compare 
              // so that componentDidUpdate can efficiently decide if a new comparison is or is not needed
              this.setState({compareText: ds, rawText: reducedText, levenshteinDistance: levenshteinDistance, showCompare: this.props.showCompare, 
                usedBase: this.props.base, usedCompareTranscription: this.props.compareTranscription})
            }
            else if(this.mounted){
              // TODO: setting showCompare to "derivedState" is an ANTI-PATTERN. Better would be to let it be entirely controlled by parent.
              // NOTE: usedBase and usedCompare transcription are used to record data used to make compare 
              // so that componentDidUpdate can efficiently decide if a new comparison is or is not needed
              this.setState({rawText: reducedText, showCompare: this.props.showCompare, 
                usedBase: this.props.base, usedCompareTranscription: this.props.compareTranscription})
            }
          }).catch((error) => {
            console.log("text request/comparison error", error)
          })
        }

  componentDidMount(){
    this.mounted = true;
    // TODO: setting showCompare to "derivedState" is an ANTI-PATTERN. Better would be to let it be entirely controlled by parent.
    this.setState({rawText: "", compareText: "", showCompare: this.props.showCompare})  
    //conditional attempts to restrict async call to only those components who are intended to be visible at mount
    // NOTE: this conditional will important when scaling. (i.e. when there hundres of references and hundreds of transcriptons)
    if (this.props.show){
      this.createCompare(this.props.base, this.props.compareTranscription)
    }
  }

  componentDidUpdate(prevProps){
    // NOTE: conditional attempts to restrict async call to only those components who are intended to be visible 
    // and for whom a previous comparison has not been made or needs to be changed.
    // need for generation of new comparison is detected by comparing props base and props compare transcription 
    //to base/compare transcription used in previous comparison (or lack there of)
    // NOTE: this conditional will important when scaling. (i.e. when there are hundreds of references and hundreds of transcriptions)
    if (this.props.show && 
      (
        // NOTE: check to see if the current props base/compareTranscription is different than one the last base/compareTranscription when comparison was ran. 
        // If it is different, then re-run compare. If not, don't run because the comparison has already been made.
        (this.props.base !== this.state.usedBase || this.props.compareTranscription !== this.state.usedCompareTranscription))
      )
      {
        this.createCompare(this.props.base, this.props.compareTranscription)
      }

  }



  componentWillUnmount(){
      this.mounted = false;
    }


  render(){
    

    const displayImage = () => {
      const newManifestations = [{
        manifestation: this.props.manifestation,
        manifestationTitle: this.props.manifestationTitle,
        transcription: ""
      }]
      return (
            <div>
              <span onClick={() => {this.setState((prevState)=> {return({showImage: !prevState.showImage})})}}><FaRegImage/></span> 
              {this.state.showImage &&
                <div>
                  <Surface3Wrapper
                  manifestations={newManifestations}
                  focusedManifestation={this.props.manifestation}
                  width={this.props.surfaceWidth}
                  hideSelectionList={true}
                  isDependentSurface3={true}
                />
                </div>
                }
            </div>
      )

    }

    const displayComparison = () => {
      const isBase = this.props.base === this.state.rawText
      if (this.state.showCompare && this.props.base && this.state.compareText){
        const levenNum = this.state.levenshteinDistance
        const heatColor = levenNum * 5
        return (
          <div style={{borderLeft: "5px solid rgba(" + heatColor + ", 0, 255, 1)", paddingLeft: "5px"}}>
            <span><Link to={"/text?resourceid=" + this.props.compareTranscription + ((this.props.relationLabel !== "isQuotedBy" && this.props.relationLabel !== "isReferencedBy" && this.props.isRelatedToRange) ? "@" + this.props.isRelatedToRange : "")}>{this.props.manifestationTitle}</Link> </span>
            <span className="lbp-span-link" title="show/hide" onClick={() => this.handleToggleShow()}>{this.state.show ? <FaEyeSlash/> : <FaEye/>}</span>
            <span className="lbp-span-link" title="toggle comparison off" onClick={() => this.handleToggleCompare()}><FaToggleOn/></span>
            {!isBase && <span className="lbp-span-link" title="set as base" onClick={() => this.props.handleChangeBase(this.state.rawText)}><FaStar/></span>}
            <span style={{fontSize: "14px", paddingLeft: "4px"}} title="levenshtein distance">{levenNum}</span>
            <div className={this.state.show ? "unhidden" : "hidden"}>
              <div ref="text" dangerouslySetInnerHTML={{ __html: this.state.compareText}}></div>
              {displayImage()}

            </div>
          </div>
        )
      }
      else if (this.state.rawText){
        
        return (
          <div>
            <span><Link to={"/text?resourceid=" + this.props.compareTranscription + ((this.props.relationLabel !== "isQuotedBy" && this.props.relationLabel !== "isReferencedBy" && this.props.isRelatedToRange) ? "@" + this.props.isRelatedToRange : "")}>{this.props.manifestationTitle}</Link></span> |
            <span className="lbp-span-link" title="show/hide" onClick={() => this.handleToggleShow()}>{this.state.show ? <FaEyeSlash/> : <FaEye/>}</span>
            <span className="lbp-span-link" title="toggle comparison on" onClick={() => this.handleToggleCompare()}><FaToggleOff/></span>
            {!isBase && <span className="lbp-span-link" title="set as base" onClick={() => this.props.handleChangeBase(this.state.rawText)}><FaStar/></span>}

            <div className={this.state.show ? "unhidden" : "hidden"}>
              <div ref="text" dangerouslySetInnerHTML={{ __html: this.state.rawText}}></div>
              {displayImage()}
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

TextCompareItem.propTypes = {
  /**
  * text comparison component
  **/
  base: PropTypes.string, // base text to perform comparison against
  compareTranscription: PropTypes.string, // transcription id of text to be used in comparison against base text
  handleChangeBase: PropTypes.func, // function to trigger base text change
  show: PropTypes.bool, // boolean to state whether text should be shown. TODO: currently competing with derivedState "show", needs to be resolved
  showCompare: PropTypes.bool //boolean to state whether should be shown with comparison markup. TODO: currently competing with derivedState "showCompare" needs to be resolved
}

export default TextCompareItem;
