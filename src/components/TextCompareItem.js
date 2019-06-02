import React from 'react';
import Diff from 'diff-match-patch'
import Axios from 'axios'

class TextCompareItem extends React.Component {
  constructor(props){
    super(props)
    this.mounted = ""
    this.state = {
      compareText: "",
      rawText: ","
    }
  }
  createCompare(base, transcription){
    Axios.get("http://exist.scta.info/exist/apps/scta-app/csv-pct.xq?resourceid=" + transcription).
          then((text) => {
            const dmp = new Diff.diff_match_patch();

            const diff = dmp.diff_main(base, text.data);
            // Result: [(-1, "Hell"), (1, "G"), (0, "o"), (1, "odbye"), (0, " World.")]
            dmp.diff_cleanupSemantic(diff);
            const ds = dmp.diff_prettyHtml(diff);
            if (this.mounted === true){
              this.setState({compareText: ds, rawText: text.data})
            }

          })
        }

  componentDidMount(){
    this.mounted = true;
    this.createCompare(this.props.base, this.props.compareTranscription)
  }
  componentWillReceiveProps(newProps){
    //this.refs.text.innerHTML = ""
    this.createCompare(newProps.base, newProps.compareTranscription)
  }
  componentWillUnmount(){
      this.mounted = false;
    }


  render(){

    return (
      <div>
        <div ref="text" dangerouslySetInnerHTML={{ __html: this.state.compareText}}></div>
        <button onClick={() => this.props.handleChangeBase(this.state.rawText)}/>


      </div>
    );
  }
}

export default TextCompareItem;
