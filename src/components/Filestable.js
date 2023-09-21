import React from 'react'
import filePng from '../assets/file.png'
import folderPng from '../assets/folder.png'
import downloadPng from '../assets/download.png'

const Filestable = ({data,bytoToUnit,handleFileDownload}) => {
  return (
    <table>
    <thead>
      <tr>
          <th></th>
          <th>File Name</th>
          <th>Modifié Le</th>
          <th>Size</th>
          <th>Type</th>
          <th>Telecharger</th>
      </tr>
    </thead>
    <tbody>
      {data.map((file, index) => (
      <tr className='file-row' key={index}>
          <td className='table-fi'><img src={file.type==2?folderPng:filePng} alt="file" className='file-icon-table'/></td>
          <td className='table-fn'>{file.name}</td>
          <td className='table-fd'>{file.rawModifiedAt}</td>
          <td className='table-fs'>{bytoToUnit(file.size).size} {bytoToUnit(file.size).unit}</td>
          <td className='table-fe'>{file.type==2?"":file.name.split(".")[file.name.split(".").length - 1]}</td>
          <td className='table-fdw'><button alt="file" className='table-dl-button' onClick={() =>handleFileDownload(file.name)}></button></td>
      </tr>
        ))}      
    </tbody>   
  </table>  
  )
}

export default Filestable