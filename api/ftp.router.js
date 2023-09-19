const express = require('express');
const router = express.Router();
const ftp = require('basic-ftp');
const multer = require('multer')
//;:
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

router.post('/upload', async (req, res) => {
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


// Close the FTP client when it's no longer needed
router.use((req, res, next) => {
  client.close();
  console.log("FTP client closed.");
  next();
});
// Other FTP routes go here

module.exports = router;
