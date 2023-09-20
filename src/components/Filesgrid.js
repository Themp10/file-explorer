import React from 'react'
import filePng from '../assets/file.png'
import folderPng from '../assets/folder.png'

const Filesgrid = ({data,bytoToUnit}) => {
  return (
    <div className='files-list'>
    {data.map((file, index) => (
      <div className='file-container' key={index}>
        <img src={file.type==2?folderPng:filePng} alt="file" className='file-icon'/>
        <div className='file-data-container'>
          <p className='file-data'>{file.name}</p>
          <p className='file-data'>{file.type==2?"":file.name.split(".")[file.name.split(".").length - 1]}</p>
          <p className='file-data'>{bytoToUnit(file.size).size} {bytoToUnit(file.size).unit}</p>
        </div>
      </div>
    ))}
       
  </div>
  )
}

export default Filesgrid