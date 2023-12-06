const fs = require('fs');
const readlineSync = require('readline-sync');

const envFile = '.env';
const regex = /"([^"]*)"/g;

function getUserInformation(prompt) {
    return readlineSync.question(prompt);
}

function getContent(value) {
    return value.match(regex).join('');
}

function formatEnvContent(apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId, measurementId, port) {

    return `
# firebase config's

API_KEY = ${getContent(apiKey)}
AUTH_DOMAIN = ${getContent(authDomain)}
PROJECT_ID = ${getContent(projectId)}
STORAGE_BUCKET = ${getContent(storageBucket)}
MSG_ID = ${getContent(messagingSenderId)}
APP_ID = ${getContent(appId)}
MSR_ID = ${getContent(measurementId)}


# you need to consult your data in your project settings in firebase
# insert data between quotation marks

# PORT
PORT = "${port}"
`;
}

function createEnv() {
    const apiKey = getUserInformation('Enter your Firebase API Key: ');
    const authDomain = getUserInformation('Enter your Firebase Auth Domain: ');
    const projectId = getUserInformation('Enter your Firebase Project ID: ');
    const storageBucket = getUserInformation('Enter your Firebase Storage Bucket: ');
    const messagingSenderId = getUserInformation('Enter your Firebase Messaging Sender ID: ');
    const appId = getUserInformation('Enter your Firebase App ID: ');
    const measurementId = getUserInformation('Enter your Firebase Measurement ID: ');

    const port = getUserInformation('Enter your server port (default is 3000): ') || '3000';

    const envContent = formatEnvContent(apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId, measurementId, port);

    try {
        fs.writeFileSync(envFile, envContent.trim());
        console.log('\x1b[42;30m%s\x1b[0m', ' .env file created successfully with user input. ');
    } catch (error) {
        console.error('\x1b[41;30m%s\x1b[0m', ` ERROR: Failed to create .env file. ${error.message}`);
    }
}

// Verificar se o arquivo .env já existe
if (fs.existsSync(envFile)) {
    const answer = getUserInformation('The .env file already exists. Do you want to overwrite it? (y/n): ');
    if (answer === 'y' || answer === 'Y') {
        createEnv();
    } else {
        console.log('The .env file was not overwritten.');
    }
} else {
    createEnv();
}