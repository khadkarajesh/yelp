module.exports = {
    'aws': {
        'key': process.env.AWS_ACCESS_KEY_ID,
        'secret': process.env.AWS_SECRET_ACCESS_KEY,
        'ses': {
            'from': {
                'default': '"rkhadka@nvesttech.com" <rkhadka@nvesttech.com>', 
            },
            'region': 'us-east-1' 
        }
    }
};