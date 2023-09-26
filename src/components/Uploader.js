import React, { useState } from 'react'
import cloud from '../assets/cloud.png'

const Uploader = ({handleFileChange,handleUpload,progress}) => {
    const [fileName,setFileName]=useState("Choisir un fichier")
    const handleChange = (e)=>{
        setFileName(e.target.files[0].name)
        handleFileChange(e)
    }
  return (
    <div className='uploader-container'>
        <div className='progress-bar' style={{width:parseInt(progress) +'%'}}></div>
        <label className="custom-file-upload">
        <img src={cloud} alt="cloud"/>
            <input type="file" className='cu-fi-up' onChange={handleChange}/>
            <span className="file-name">{fileName}</span>
        </label>

        
        <button className='upload-button' onClick={handleUpload}>{progress==0?'Upload': parseInt(progress) +' %'}</button>
    </div>
  )
}

export default Uploader