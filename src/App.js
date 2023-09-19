import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('http://ouss.sytes.net:8000/ftp/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('File upload failed');
    }
  };
  const bytoToUnit = (bt)=>{
    let output={
        "size":0,"unit":"o"
    }
    if(bt<1024){
      output.size=bt
      output.unit="o"
    }
    else if(parseInt(bt/1024)<1024){
      output.size=bt/1024
      output.unit="Ko"
    }
    else if(parseInt(bt/1024/1024)<1024){
      output.size=bt/1024/1024
      output.unit="Mo"
    }
    else if(parseInt(bt/1024/1024/1024)<1024*1024){
      output.size=bt/1024/1024/1024
      output.unit="Go"
    }
    output.size=parseFloat(output.size.toFixed(2))
    return output

  }
  

    const fetchDataFromServer = async () => {
      try {
        const response = await fetch('http://ouss.sytes.net:8000/ftp/list');
        if (response.ok) {
          const data = await response.json();
          console.log(data); // Log the data to the console
          setFiles(data); // Update the state with the fetched data
        } else {
          console.error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error while fetching data:', error);
      }
    };

  return (
    <div>
      <h1>FTP File Explorer</h1>
      <button onClick={fetchDataFromServer}>Fetch Data</button>
      {/* Add File */}
      <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload File</button>
    </div>

      {/* List Files */}
       <ul>
        {files.map((file, index) => (
          <li key={index}>
            {file.name} , {file.type==2?"Dossier":file.name.split(".")[file.name.split(".").length - 1]} , {bytoToUnit(file.size).size} {bytoToUnit(file.size).unit}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
