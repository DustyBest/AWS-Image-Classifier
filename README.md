# AWSImageClassifyApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.1.1.

## To Run Yourself...

After signing up for an AWS account of your own...

Create a new IAM user with AWS console access, and Administrator permissions. Generate security keys for the new user and save them somewhere safe.

Now, while logged in as your new AWS IAM user...

Within DynamoDB, create a new table, noting the table's name.

Within AWS Lambda Service, author a new Lambda from scratch.

From the root folder and within /assets there is an index.js file. This is the code for the AWS Lambda function that will communicate to Rekognition, and DynamoDB. On line 47 you will need to enter your unique DynamoDB table name you've noted above.

Set the lambda trigger to S3 (all creation events), and give the lambda permissions to use Rekognition and DynamoDB.

Within S3, create a new bucket, noting the bucket's name.

From the project root folder, navigate to /assets and replace creds.example.json with creds.json and insert your own credentials. These are the keys we generated earlier when we made an IAM User. Insert the name of your S3 bucket and you're all finished. 

After installing dependencies and compiling, you should be able to launch the Angular app in a browser ('ng seve') and start classifying some images!
