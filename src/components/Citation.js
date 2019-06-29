import React from 'react';
import { FaClipboard} from 'react-icons/fa';

function Citation(props) {
  return (
    <div className={props.hidden ? "hidden" : "showing"}>
    <h1><FaClipboard/></h1>
    <p>Full Citation</p>
    <p>Peter Plaoul, Commentarius in libros Sententiarum, de Fide, Lectio 1, de Fide, Quaestio: utrum in causa iudiciali fidei contra traditionem pure humanitus adinventam iudex idoneus ferret pro fide sententiam , Paragraph l1-cpspfs, [n. 1], SCTA Expression Url http://scta.info/resource/l1-cpspfs; ed. EditorName, SCTA Manifestion Url http://scta.info/resource/l1-cpspfs, Transcription Data Source QmNynYEQkRrt6MTfCxS8w2Pm6eN4tbLXuRCpE7HbzWdxqg; Accessed at http://scta.lombardpress.org/text/l1-cpspfs on June 29, 2019, Archived at http://scta.lombardpress.org/text/archive?datasource=QmNynYEQkRrt6MTfCxS8w2Pm6eN4tbLXuRCpE7HbzWdxqg</p>

<p>Short Citation</p>

<p>Peter Plaoul, Commentarius in libros Sententiarum, de Fide, Lectio 1, de Fide, Quaestio: utrum in causa iudiciali fidei contra traditionem pure humanitus adinventam iudex idoneus ferret pro fide sententiam , Paragraph l1-cpspfs, [n. 1], QmNynYEQkRrt6MTfCxS8w2Pm6eN4tbLXuRCpE7HbzWdxqg, Accessed on June 29, 2019</p>

<p>Explanation of Citation Practices</p>

<p>The citation of a text that has survived through a historical succession of manifestations is a complicated endeavor. Today, when transcriptions of these manifestations can be published as data, separate from any presentation, and thereby can be presented in a variety of ways, a full citation inevitably becomes even more complex. In order to identify both a specific dataset and the specific presentation of that data, specificity and precision are needed.</p>

<p>Full citations identify three aspects of the text currently being viewed.</p>

<p>First (blue) it identifies the idea of the paragraph in question situated within the conceptual hierarchy of the text.</p>

<p>Second (red) it identifies the transcription data source used to represent a particular manifestion of this passage</p>

<p>Third (green) it identifies specific presentation of the data source currently being viewed.</p>
</div>
  );
}

export default Citation;
