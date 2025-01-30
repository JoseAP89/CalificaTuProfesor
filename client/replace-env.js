const fs = require('fs');
const path = require('path');

// Path to the environment.ts file
const envFilePath = path.join(__dirname, 'src', 'environments', 'environment.ts');

// Read the environment.ts file
let envFileContent = fs.readFileSync(envFilePath, 'utf8');
let prod = process.env.PRODUCTION;
let api_url = process.env.API_URL;

// Replace placeholders with environment variables
envFileContent = envFileContent.replace(/\"\${PRODUCTION}\"/g, prod);
envFileContent = envFileContent.replace(/\${API_URL}/g, api_url);

// Write the updated content back to the file
fs.writeFileSync(envFilePath, envFileContent, 'utf8');

console.log(`****** Environment variables PRODUCTION='${prod}' & API_URL='${api_url}' replaced successfully. ******`);