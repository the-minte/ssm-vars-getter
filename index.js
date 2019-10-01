const fs = require('fs');
const awsSDK = require('aws-sdk');

const ssm = new awsSDK.SSM();

const paramsPath = process.argv[2];
/* make it false by default */
const recursive = (process.argv[3] || '') === 'true' ? true : false;

function getParametersByPath({ path, recursive, token }) {
  return new Promise((resolve, reject) => {
    ssm.getParametersByPath(
      {
        Path: path,
        WithDecryption: true,
        Recursive: recursive,
        NextToken: token,
      },
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
}

async function getAllParamsByPath({path, recursive}) {
  let token = undefined;
  let allParameters = [];
  do {
    const {Parameters, NextToken} = await getParametersByPath({path, recursive, token});
    allParameters = allParameters.concat(Parameters);
    token = NextToken
  } while(token);
  return allParameters;
}

function convertParamsJsonToEnv(parameters = []) {
  const lines = parameters.map(parameter => {
    const varName = /[^\/]+$/g.exec(parameter.Name)[0];
    return `${varName}="${parameter.Value}"`;
  });
  return lines;
}

function saveToEnvFile(envLines) {
  fs.writeFileSync('./.env', envLines.join('\n'));
}

async function main({path, recursive}) {
  const parameters = await getAllParamsByPath({path, recursive});
  console.log(parameters.length);
  const envLines = convertParamsJsonToEnv(parameters);
  saveToEnvFile(envLines);
}

main({
  path: paramsPath,
  recursive
})
  .catch(err => {
    console.error(err);
    process.exit(1);
  })
  .then(() => {
    process.exit(0);
  });

  module.exports = {
    getParametersByPath
  };
