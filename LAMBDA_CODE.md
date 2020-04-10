'use strict';
let AWS = require("aws-sdk");
let s3 = new AWS.S3({apiVersion: "2006-03-01"});
let rekognition = new AWS.Rekognition();
let docClient = new AWS.DynamoDB.DocumentClient({region: 'us-west-1'});

let bucket, key, labelData;

exports.handler = function(event, context, callback) {
  bucket = event.Records[0].s3.bucket.name;
  key = event.Records[0].s3.object.key;
  
  rekognizeTags()
  .then(function(rekoLabels){
    addToClassedImagesTable(rekoLabels)
  });
  
}




/* This operation detects labels in the supplied image */
function rekognizeTags() {

 var params = {
  Image: {
   S3Object: {
    Bucket: bucket, 
    Name: key
   }
  }, 
  MaxLabels: 5, 
  MinConfidence: 85
 };
   return rekognition.detectLabels(params, function(err, data) {
     if (err) console.log(err, err.stack); // an error occurred
     else     {
     let rekoLabels = [];
     let labels = data.Labels;
    // console.log(labels);
    labels.forEach(function(label){
      rekoLabels.push(label.Name);
    })
    console.log("reko Tags ", rekoLabels);
    return rekoLabels;
     }
   }).promise();
  }

function addToClassedImagesTable(rekoLabels) {
  console.log("Should fire second", rekoLabels);
  let reko = [];
  let lables = rekoLabels.Labels;
  lables.forEach(function(label){
    reko.push(label.Name);
  })
  
  var userParams = {
    Bucket: bucket, 
    Key: key, 
  }

  s3.getObjectTagging(userParams, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     {           // successful response
    let Tags = data["TagSet"];
    let userLabels = [];
    Tags.forEach(function(pair) {
      userLabels.push(pair.Value)
    });
  
    let params = {
      TableName: "ClassedImages",
      Item: {
        id: key.split(".")[0],
        userLabels: userLabels,
        rekolabels: reko,
        timestamp: new Date().getTime(),
        filename: key.split(".")[0]
      }
    };
    
    return docClient.put(params).promise();
    }
  })
}