import React, {useState} from 'react'
import Axios from 'axios'
import {FaDownload, FaCloudDownloadAlt, FaUpload, FaCloudUploadAlt, FaPlusCircle} from 'react-icons/fa';

const ImportExport = (props) =>{
  const [newListName, setNewListName] = useState('');
  const [newListUrl, setNewListUrl] = useState('');
  const [showImport, setShowImport] = useState(false);

  const handleFileImport = (e) => {
    var reader = new FileReader();

    reader.readAsText(e.target.files[0]);
    const fileName = e.target.files[0].name
    // define callback function; aka actions to be peerformed after file is read
    reader.onload = function(e) {
      var list = reader.result;
      
      props.handleImportList(JSON.parse(list), fileName)
    }


  }
  const handleUrlImport = (e) => {
    e.preventDefault()
    Axios.get(newListUrl).then((d) => {
      console.log("data", d)
      props.handleImportList(d.data, newListUrl)
    })


  }
  const createNewList = (e) => {
    e.preventDefault();
    //NOTE: first argument needs to be string that will be parsed in the parent component, in this case to an array
    props.handleImportList([], newListName)
    setNewListName('')
  }
  const packageData = () =>
   {
    const data = JSON.stringify(props.currentList, null, 2);
    const dataLink = "data:application/json;charset=utf-8," + encodeURI(data)
    return dataLink
  }
  const downloadTitle = () =>
   {
    const title = props.currentListName.split('.json')[0] + "-" + new Date().toISOString().slice(0, 10)
    return title
  }
  return (
    <div>
      <span className="lbp-span-link" onClick={() => setShowImport(!showImport)}>Import <FaUpload/></span> 
      {showImport &&
        <div>
          <span className="lbp-span-link"><FaUpload/> Load from local file</span> 
          <br/>
          <input type="file" id="files" name="files[]" onChange={handleFileImport}/>
          <br/>
          <span className="lbp-span-link"><FaCloudDownloadAlt/> Load from Cloud</span>
          <form onSubmit={handleUrlImport}><input type="text" value={newListUrl} onChange={(e) => {setNewListUrl(e.target.value)}}></input><input type="submit"/></form>
          
          <span className="lbp-span-link"><FaPlusCircle/> Create New List</span> 
          <form onSubmit={createNewList}><input type="text" value={newListName} onChange={(e) => {setNewListName(e.target.value)}}></input><input type="submit"/></form>
        </div>
      }
      <br/> 
      <a href={packageData()} download={downloadTitle()}><span className="lbp-span-link">Export <FaDownload/></span></a>
      
    </div>
  );
}

export default ImportExport