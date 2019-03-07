const awsSDK = require('aws-sdk');
const ssm = new awsSDK.SSM();
ssm.getParametersByPath({Path: '/development', WithDecryption: true}, (err, data) => {
	err && console.error(err);
	!err && console.log(data.Parameters);
});
