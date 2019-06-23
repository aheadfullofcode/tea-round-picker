const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

// const config = require("../config");

aws.config.update({
  secretAccessKey: "zpyhBLl+nEIWzjWLuZXG1SfOTXgJ1sLmJDawDFhK",
  accessKeyId: "AKIAJAJX3AVAUMZH6OUA",
  region: "us-east-2"
});

const s3 = new aws.S3();

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "putnam-storage",
    metadata: function(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function(req, file, cb) {
      cb(null, Date.now().toString());
    }
  })
});

module.exports = upload;
