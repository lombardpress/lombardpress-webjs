import React, {useState} from 'react'

const ImportExport = (props) =>{
  const [newListName, setNewListName] = useState('');

  const handleFileImport = (e) => {
    var reader = new FileReader();

    reader.readAsText(e.target.files[0]);
    const fileName = e.target.files[0].name
    // define callback function; aka actions to be peerformed after file is read
    reader.onload = function(e) {
      var list = reader.result;
      
      props.handleImportList(list, fileName)
    }


  }
  const createNewList = (e) => {
    e.preventDefault();
    //NOTE: first argument needs to be string that will be parsed in the parent component, in this case to an array
    props.handleImportList('[]', newListName)
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
    const title = "lbpwebjs-list-" + new Date().toISOString().slice(0, 10)
    return title
  }
  return (
    <div>
      <a href={packageData()} download={downloadTitle()}>Download State</a> |
      Import List <input type="file" id="files" name="files[]" onChange={handleFileImport}/>
      |
      New List <form onSubmit={createNewList}><input type="text" value={newListName} onChange={(e) => {setNewListName(e.target.value)}}></input><input type="submit"/></form>
      
    </div>
  );
}

export default ImportExport