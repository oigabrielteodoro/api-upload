const { Router } = require('express');
const multer = require('multer');

const uploadConfig = require('./config/upload');

const FilesController = require('./app/controllers/FilesController');

const routes = Router();
const upload = multer(uploadConfig.multer);
  
routes.post('/', upload.array('files', 10), FilesController.create);

module.exports = routes;