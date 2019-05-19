const AWS = require('aws-sdk');
//https://attacomsian.com/blog/amazon-ses-integration-nodejs
const config = require('../config'); // 
AWS.config.update({
    accessKeyId: config.aws.key,
    secretAccessKey: config.aws.secret,
    region: config.aws.ses.region
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

async function sendEmail(to, subject, message, from, res) {
    const params = {
        Destination: {
            ToAddresses: [to]
        },
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: message
                },
                /* replace Html attribute with the following if you want to send plain text emails. 
                Text: {
                    Charset: "UTF-8",
                    Data: message
                }
             */
            },
            Subject: {
                Charset: 'UTF-8',
                Data: subject
            }
        },
        ReturnPath: from ? from : config.aws.ses.from.default,
        Source: from ? from : config.aws.ses.from.default,
    };
    try{
        ses.sendEmail(params)
    }
    catch(error){
        res.json({error: error})
    }
};

module.exports = { sendEmail }