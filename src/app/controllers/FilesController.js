const S3StorageProvider = require('../../providers/S3StorageProvider');

class FilesController {
  async create(request, response) { 
    const { io, files } = request;

    const storageProvider = new S3StorageProvider();

    const uploadedFiles = await Promise.all([files.map(async file => {
      const uploaded = await storageProvider.saveFile(file.filename, io);
      
      return uploaded;
    })]);

    return response.json(uploadedFiles);
  }
}

module.exports = new FilesController();