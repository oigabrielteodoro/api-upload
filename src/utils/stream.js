const { promisify } = require('util');
const { pipeline } = require('stream');

const pipelineSync = promisify(pipeline);
 
module.exports = { 
  pipelineSync, 
  promisify 
};