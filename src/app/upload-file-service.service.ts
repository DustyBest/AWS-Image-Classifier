import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import * as S3 from 'aws-sdk/clients/s3';
import { Subject } from 'rxjs';
const credentials = require('../../assets/creds.json');


 
@Injectable()
export class UploadFileService {
  tag1:string;
  tag2:string;
  tag3:string;
  messageSub = new Subject();
  
  constructor() {
  }

  uploadFile(file) {
    const bucket = new S3(
      {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
        region: credentials.region
      });
    
    const params = {
      Bucket: credentials.bucket,
      Key: file.name,
      Body: file,
      Tagging: `UserTag1=${this.tag1}&UserTag2=${this.tag2}&UserTag3=${this.tag3}`,
      UserTags: [this.tag1, this.tag2, this.tag3]
    };

    bucket.upload(params, (err, data) => {
    
      if (err) {
        console.log('There was an error uploading your file: ', err);
        return false;
      }
      console.log('Successfully uploaded file.', data, params);
      this.messageSub.next(`Success! Your tags were '${this.tag1}', '${this.tag2}', and '${this.tag3}'.`)
      this.tag1 = '';
      this.tag2 = '';
      this.tag3 = '';
      return true;
    });
  }
}