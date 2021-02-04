const fs = require('fs');
const path = require('path');
const mime = require('mime');
const aws = require('aws-sdk');

const uploadConfig = require('../config/upload');

class S3StorageProvider { 
  constructor() {
    this.client = new aws.S3({
      region: 'us-east-1',
      credentials: {
        accessKeyId: 'aws-key-id',
        secretAccessKey: 'aws-secret-access-key',
      },
    });
  }  

  async saveFile(file, io) {
    const originalPath = path.resolve(uploadConfig.tmpFolder, file);

    const ContentType = mime.getType(originalPath);

    if (!ContentType) {
      throw new Error('File not found');
    }

    const fileContent = fs.createReadStream(originalPath);
    
    await this.client
      .putObject({
        Bucket: uploadConfig.config.aws.bucket,
        Key: file,
        ACL: 'public-read',
        Body: fileContent,
        ContentType, 
        ContentDisposition: `inline; filename=${file}`,
      }).on('httpUploadProgress', event => { 
        io.emit('upload', {
          total: event.total,
          loaded: event.loaded,
          percentage: (event.loaded * 100 / event.total).toFixed(),
          filename: file.split('-')[1],
        }); 

        return event;
      }).on('httpDone', () => {
        fs.promises.unlink(originalPath);
      }).promise()
 
    return file;
  }

  async deleteFile(file) {
    await this.client
      .deleteObject({
        Bucket: uploadConfig.config.aws.bucket,
        Key: file,
      })
      .promise();
  } 

  getS3() {
    return this.client.getS3();
  }
} 

module.exports = S3StorageProvider;
