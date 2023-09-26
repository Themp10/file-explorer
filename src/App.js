import React, { useState, useEffect } from 'react';
import axios from 'axios';
import listPng from './assets/list.png'
import gridPng from './assets/grid.png'
import reloadPng from './assets/reload.png'
import toast, { Toaster } from 'react-hot-toast';


import './App.css';
import Filestable from './components/Filestable';
import Filesgrid from './components/Filesgrid';
import Uploader from './components/Uploader';

const App = () => {
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [selectedGL, setSelectedGL] = useState("grid");
  const [uploadProgress, setUploadProgress] = useState(0);

  const toggleListGrid = (event) => {
    const gridIcon = document.querySelectorAll('.grid-list-icon')[0];
    const listIcon = document.querySelectorAll('.grid-list-icon')[1];
    const fileDataContainer = document.querySelectorAll('.file-data-container');
    
    if (event.target === gridIcon) {
      // clicked on grid icon
      console.log("clicked")
      gridIcon.classList.add('selected-grid-list');
      listIcon.classList.remove('selected-grid-list');
      setSelectedGL("grid")
    } else if (event.target === listIcon) {
      // clicked on list icon
      listIcon.classList.add('selected-grid-list');
      gridIcon.classList.remove('selected-grid-list');
      console.log("list")
      setSelectedGL("list")
    }
  };

  const handleFileDownload = async (file) => {
    console.log(file)
    let data={"file":file}
    try {
      let response=await axios.post('http://ouss.sytes.net:8000/ftp/download', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      alert(response.data.message);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
   };
    


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
        onUploadProgress: (progressEvent) => {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          setUploadProgress(progress);
        },
      });
      toast.success(file.name +' Successfully uploaded!')
      setTimeout(() => {
        setUploadProgress(0)
        setFile(null)
      }, 1000);
         

    } catch (error) {
      console.error('Error uploading file:', error);
      alert('File upload failed');
      setUploadProgress(0)
      setFile(null)
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

          const sortedData = data.sort((a, b) => {
            if (a.type === 2 && b.type !== 2) {
              return -1; // Type 2 comes first
            } else if (a.type !== 2 && b.type === 2) {
              return 1; // Type 2 comes first
            } else {
              return 0; // Both are of the same type, no need to change their order
            }
          });
          setFiles(sortedData); // Update the state with the fetched data
        } else {
          console.error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error while fetchin g data:', error);
      }
    };

  return (
    <div>
      <div><Toaster  position="top-center" reverseOrder={false}/></div>
      <h1>FTP File Explorer</h1>
      {/* Add File */}
      <Uploader handleFileChange = {handleFileChange} handleUpload={handleUpload} progress={uploadProgress}/>

      {/* List Files */}
        <div className='show-selector'>
        
          <img src={reloadPng} alt="reload" className='reload-icon' onClick={fetchDataFromServer}/>
          <img src={gridPng} alt="grid" className='grid-list-icon selected-grid-list' onClick={toggleListGrid}/>
          <img src={listPng} alt="list" className='grid-list-icon' onClick={toggleListGrid}/>

        </div>
        {
          selectedGL=="grid"?
          <Filesgrid data = {files} bytoToUnit={bytoToUnit}/>
          :
          <Filestable data = {files} bytoToUnit={bytoToUnit} handleFileDownload={handleFileDownload}/> 
        }
        
     
    </div>
  );
};

export default App;
