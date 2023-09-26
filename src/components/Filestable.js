import React,{useState} from 'react'
import filePng from '../assets/file.png'
import folderPng from '../assets/folder.png'
import downloadPng from '../assets/download.png'

const Filestable = ({data,bytoToUnit,handleFileDownload}) => {
  const [sortCriteria, setSortCriteria] = useState({
    column: 'name', // Default sorting column is 'name'
    order: 'asc',   // Default sorting order is ascending
  });

  const handleSort = (column) => {
    setSortCriteria((prevCriteria) => ({
      column,
      order:
        prevCriteria.column === column && prevCriteria.order === 'asc'
          ? 'desc'
          : 'asc',
    }));
  };
  const sortedData = [...data].sort((a, b) => {
    if (sortCriteria.column === 'name') {
      return sortCriteria.order === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortCriteria.column === 'date') {
      return sortCriteria.order === 'asc'
      ? a.rawModifiedAt.localeCompare(b.rawModifiedAt)
      : b.rawModifiedAt.localeCompare(a.rawModifiedAt);
  } else if (sortCriteria.column === 'size') {
    const sizeA = a.size;
    const sizeB = b.size;
    return sortCriteria.order === 'asc' ? sizeA - sizeB : sizeB - sizeA;
  }
    return 0;
  });
  return (
    <table>
    <thead>
      <tr>
          <th></th>
          <th><button onClick={() => handleSort('name')}>File Name</button></th>
          <th><button onClick={() => handleSort('date')}>File Name</button></th>
          <th><button onClick={() => handleSort('Size')}>File Name</button></th>
          <th>Type</th>
          <th>Telecharger</th>
      </tr>
    </thead>
    <tbody>
      {sortedData.map((file, index) => (
      <tr className='file-row' key={index}>
          <td className='table-fi'><img src={file.type==2?folderPng:filePng} alt="file" className='file-icon-table'/></td>
          <td className='table-fn'>{file.name}</td>
          <td className='table-fd'>{file.rawModifiedAt}</td>
          <td className='table-fs'>{file.size}</td>

          {/* <td className='table-fs'>{bytoToUnit(file.size).size} {bytoToUnit(file.size).unit}</td> */}
          <td className='table-fe'>{file.type==2?"":file.name.split(".")[file.name.split(".").length - 1]}</td>
          <td className='table-fdw'><button alt="file" className='table-dl-button' onClick={() =>handleFileDownload(file.name)}></button></td>
      </tr>
        ))}      
    </tbody>   
  </table>  
  )
}

export default Filestable