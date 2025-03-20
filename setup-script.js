#!/usr/bin/env node

const readline = require('readline');
const yargs = require('yargs');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const TEMPLATE_REPO_URL = 'https://github.com/notifi-network/smart-link-template.git';


const execCommand = (command, options = {}) => {
    try {
        execSync(command, { stdio: 'inherit', ...options });
    } catch (error) {
        console.error(`Error executing command: ${command}`);
        process.exit(1);
    }
};

const setupRepository = async (projectName, argv) => {
    execCommand(`git clone --depth=1 ${TEMPLATE_REPO_URL} ${projectName}`);

    const projectPath = path.join(process.cwd(), projectName);
    execCommand('npm install', { cwd: projectPath });
    fs.rmSync(path.join(projectPath, '.git'), { recursive: true });
    execCommand('git init', { cwd: projectPath });

    const defaultConfig = {
        "projectName": projectName,
        "environment": argv.environment || "PRODUCTION",
        "notifiAuthToken": argv.authToken || "",
        "actionSourceId": argv.actionSourceId || "",
    };

    fs.writeFileSync(
        path.join(projectPath, 'notifi-config.json'),
        JSON.stringify(defaultConfig, null, 2)
    );

    console.log('Created Notifi-Config.json with your settings');
    execCommand('git add .', { cwd: projectPath });
    execCommand('git commit -m "Initial commit"', { cwd: projectPath });
};

const getProjectName = async () => {
    let projectName = yargs.argv.name;

    if (!projectName) {
        const rl = createInterface();
        projectName = await askQuestion(rl, 'Enter your Notifi Action Project Name: ');

        rl.close();
    }

    return projectName;
};

const createInterface = () => {
    return readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
};

const askQuestion = (rl, question) => {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
};

const main = async () => {
    const argv = yargs
        .option('name', {
            describe: 'Project name',
            type: 'string'
        })
        .option('authToken', {
            describe: 'Notifi Auth Token',
            type: 'string'
        })
        .option('actionSourceId', {
            describe: 'Action Source ID',
            type: 'string'
        })
        .option('environment', {
            describe: 'Environment (development or production)',
            type: 'string',
            default: 'PRODUCTION'
        })
        .argv;

    const projectName = await getProjectName();
    await setupRepository(projectName, argv);
};

main().catch(console.error);