const fs = require('fs');
const awsSDK = require('aws-sdk');

const ssm = new awsSDK.SSM();

const paramsPath = process.argv[2]
/* make it false by default */
const recursive = (process.argv[3] || '') === 'true'? true : false

ssm.getParametersByPath({Path: paramsPath, WithDecryption: true, Recursive: recursive}, (err, data) => {
	if (err) {
		console.error(err);
		process.exit(1);
	} else {
		const lines = data.Parameters.map(parameter => {
			const varName = (/[^\/]+$/g).exec()[0];
			return `${parameter.Name.replace(/^.*\/(.*)$/g, '$1')}='${parameter.Value}'`;
		});
		fs.writeFileSync('./.env', lines.join('\n'));
	}
});
