let AWS = require("aws-sdk");
let s3 = new AWS.S3({apiVersion: "2006-03-01"});
let rekognition = new AWS.Rekognition();
let docClient = new AWS.DynamoDB.DocumentClient();

let lambdaCallback, bucket, key;

exports.handler = function(event, context, callback) {
  lambdaCallback = callback
  bucket = event.Records[0].s3.bucket.name;
  key = event.Records[0].s3.object.key;
  

  rekognizeLabels(bucket, key)
    .then(function(data) {
      labelData = data["Labels"];
    }).then(function(faceData) {
      return addToClassedImagesTable()
    }).then(function(data) {
      console.log("Data added toDynamoDB");
      lambdaCallback(null, data)
    }).catch(function(err) {
      lambdaCallback(err, null);
    });
};

function addToClassedImagesTable() {
  let labels = []
  labelData.forEach(function(label) {
    labels.push(label.Name)
  });
  
  var userParams = {
  Bucket: bucket, 
  Key: key, 
 };
 s3.getObjectTagging(userParams, function(err, data) {
   if (err) console.log(err, err.stack); // an error occurred
   else     {           // successful response
   let Tags = data["TagSet"];
   let userLabels = [];
   Tags.forEach(function(pair) {
    userLabels.push(pair.Value)
  });

  let params = {
    TableName: "REPLACE_WITH_YOUR_DYNAMODB_TABLE_NAME",
    Item: {
      id: key.split(".")[0],
      userLabels: userLabels,
      rekolabels: labels,
      timestamp: new Date().getTime(),
      filename: key.split(".")[0]

    }
  };
  return docClient.put(params).promise()
  };
 });
}

function rekognizeLabels(bucket, key) {
  let params = {
    Image: {
      S3Object: {
        Bucket: bucket,
        Name: key
      }
    },
    MaxLabels: 5,
    MinConfidence: 85
  };
  return rekognition.detectLabels(params).promise()
};
