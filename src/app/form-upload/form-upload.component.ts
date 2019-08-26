import { Component, OnInit } from '@angular/core';
import { UploadFileService } from '../upload-file-service.service';

@Component({
  selector: 'app-form-upload',
  templateUrl: './form-upload.component.html',
  styleUrls: ['./form-upload.component.css']
})
export class FormUploadComponent implements OnInit {
  message;
  imgURL:string = 'https://via.placeholder.com/200';

  selectedFile: File;
  

  selectFile(event) {
    this.selectedFile = event.target.files[0];
     
    var reader = new FileReader();
    reader.readAsDataURL(this.selectedFile); 
    reader.onload = (event) => { 
      this.imgURL = reader.result; 
    }
  }

  constructor(public uploadService: UploadFileService) {
    this.uploadService.messageSub.subscribe(message => this.message = message)
   }
  

  ngOnInit() {
  }

  upload() {
    this.uploadService.uploadFile(this.selectedFile);
  }

}
