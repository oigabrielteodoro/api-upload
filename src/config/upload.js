const path = require('path');
const multer = require('multer');
const crypto = require('crypto');

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

module.exports = {
  driver: 's3',

  tmpFolder,
  uploadsFolder: tmpFolder,

  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename(_, file, callback) {
        const fileHashed = crypto.randomBytes(10).toString('hex');

        const fileName = `${fileHashed}-${file.originalname}`;

        return callback(null, fileName);
      },
    }),
  }, 

  config: {
    disk: {},
    aws: {
      bucket: 'application-customer',
    },
  },
}