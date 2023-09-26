const express = require('express');
const app = express();
var cors = require('cors')
const port = 8000; // Choose a port for your Express server
const ftpRouter = require('./ftp.router')

const corsOptions = {
  origin: ['http://ouss.sytes.net:8001','http://localhost:8001'],
}
app.use(cors(corsOptions))
app.use(express.json());
app.use('/ftp', ftpRouter);

app.listen(port, () => {
  console.log(`Express server is running on port ${port}`);
});
