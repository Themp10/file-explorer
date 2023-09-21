const express = require('express');
const router = express.Router();
const ftp = require('basic-ftp');
const multer = require('multer')
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Define the storage configuration for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Specify the directory where uploaded files will be saved
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Define how the file should be named
    cb(null, file.originalname);
  },
});


const upload = multer({ storage: storage });


// Create an FTP client
const client = new ftp.Client();

router.use(async (req, res, next) => {
  try {
    console.log("Connecting to the FTP server....");
    await client.access({
      host: 'ouss.sytes.net',
      user: 'ftpuser',
      password: 'thethepo'
    });
    console.log("Connected to the FTP server!");
    next();
  } catch (error) {
    console.error('FTP Connection Error:', error);
    res.status(500).json({ error: 'Failed to connect to FTP server' });
  }
});

// Route to list files
router.get('/list', async (req, res) => {
  try {
    const list = await client.list();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});



// Define your '/upload' route and handle file upload
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    // Access the uploaded file using req.file
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Define the source and destination paths
    const sourcePath = path.join(__dirname, 'uploads', req.file.filename);
    const destinationPath = '/mnt/Home/' + req.file.originalname; // Change this to your desired destination

    // Copy the file to the destination directory
    fs.copyFileSync(sourcePath, destinationPath);


    // Send a success response
    res.status(200).json({ message: 'File uploaded successfully' });
  } catch (error) {
    console.error('Error uploading file:', error.message);
    res.status(500).json({ error: error.message });
  }
});



router.post('/uploadtest', async (req, res) => {
  try {
    // Use Multer to handle file uploads
    const upload = multer({ storage: multer.memoryStorage() }).single('file');
    upload(req, res, async function (err) {
      if (err) {
        return res.status(400).json({ error: 'File upload failed' });
      }

      const fileData = req.file;

      if (!fileData) {
        return res.status(400).json({ error: 'No file selected' });
      }
      console.log(fileData)
      console.log(fileData.buffer)

      await client.append(fileData.buffer, fileData.originalname);
      res.status(200).json({ message: 'File uploaded successfully' });
    });
  } catch (error) {
    console.error('Error uploading file:', error.message);
    res.status(500).json({ error: error.message });
  }
});


router.post('/download', async (req, res) => {
  try {
      const localDirectory = '/mnt/Home'
      console.log(req.body)
      const fileName = req.body.file;
      const filePath = path.join(localDirectory, fileName)
      console.log(filePath)
      if (fs.existsSync(filePath)) {
        // Send the file as a response
        const originalPermissions = fs.statSync(filePath).mode;
        fs.chmodSync(filePath, 0o777)
        res.sendFile(filePath);
        console.log('File sent successfully');
        fs.chmodSync(filePath, originalPermissions);
      } else {
        res.status(404).json({ error: 'File not found' });
      }
  
  } catch (error) {
    console.error('Error uploading file:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Close the FTP client when it's no longer needed
router.use((req, res, next) => {
  client.close();
  console.log("FTP client closed.");
  next();
});
// Other FTP routes go here

module.exports = router;
