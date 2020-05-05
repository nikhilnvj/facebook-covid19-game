const request = require('request');
const path = require('path');
const zipPath = path.join(__dirname, '../app.zip')
const config = require('../config.json');
const fs = require('fs');

console.log('Uploading archive: ' + zipPath);

request.post({
    url:
        'https://graph-video.facebook.com/' + config.FB_appId + '/assets',
    formData: {
        access_token: config.FB_uploadAccessToken,
        type: 'BUNDLE',
        comment: 'Uploaded via node script',
        asset: {
            value: fs.createReadStream(zipPath),
            options: {
                filename: 'app.zip',
                contentType: 'application/octet-stream',
            },
        },
    },
}, (err, resp) =>{
    if(resp.statusCode === 200){
        console.log('Uploaded zip successfully')
    } else {
        console.log(err)
    }
})
