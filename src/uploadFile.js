const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const BUCKET_NAME = process.env.FILE_UPLOAD_BUCKET_NAME;

module.exports.handler = async(event) => {
    console.log(event);

    const response = {
        isBase64Encoded: false,
        statusCode: 200,
        body: JSON.stringify({message: "Successfully uploaded the file to S3"})
    };

    try{
        const parsedBody = JSON.parse(event.body);
        const base64File = parsedBody.file;
        const decodedFile = Buffer.from(base64File.replace(/^data:image\/\w+;base64,/,""), "base64");
        const parameters = {
            Bucket: BUCKET_NAME,
            Key: `images/${new Date().toISOString()}.jpeg`,
            body: decodedFile,
            ContentType: 'image/jpeg',
        };
        const uploadResult = await s3.upload(parameters).promise();
        response.body = JSON.stringify({message: "Successfully uploaded the file to S3"});
    } catch(e) {
        console.log(e);
        response.body = JSON.stringify({message: "Failed to upload the file to S3"});
        response.statusCode = 500;
    }

    return response
}
