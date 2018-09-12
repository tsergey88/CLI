const fs = require('fs');
const path = require('path');

const { exec } = require('child_process');

function createDirectory(dirName, componentName) {
    if (!fs.existsSync(path.resolve(dirName))) {
        fs.mkdirSync(path.resolve(dirName))
    }
    if (!fs.existsSync(path.resolve(dirName, componentName))) {
        fs.mkdirSync(path.resolve(dirName, componentName))
    }
}

function createFiles(extensions, subDir, componentName, type) {
    let command;
    switch (process.platform) {
        case 'linux':
            command = 'touch ';
            break;
        case 'win32':
            command = 'echo > ';
            break;
        default:
            throw new Error('Unsupported platform: ' + process.platform);
    }

    extensions.forEach((ext) => {
        exec(command + path.resolve(subDir, componentName + ext), (err) => {
            if (err) { throw err }
        });
    });
    if (type === "component") {
        exec(command + path.resolve(subDir, "index.js"), (err) => {
            if (err) { throw err }
        });
    }
}

function createTemplates(subDir, componentName, type) {
    if (type === "component") {
        const componentTemplate = `import React from 'react';
    
export default function ${componentName}(props) {
    return (
        <div>${componentName} works!</div>
    )
}`;
        fs.writeFileSync(path.resolve(subDir, componentName + ".js"), componentTemplate );

        const templateIndex = `export default from './${componentName}.js'`;
        fs.writeFileSync(path.resolve(subDir, "index.js"), templateIndex);
    }

    if (type === "container") {
        const containerTemplate = `import React, { Component } from 'react';
    
export default class ${componentName} extends Component {
    componentDidMount() {
    
    }

    render() {
        return (
            <div>${componentName} works!</div>
        )
    }
}`;

        fs.writeFileSync(path.resolve(subDir, componentName + ".js"), containerTemplate);
    }
}

module.exports = {createDirectory, createFiles, createTemplates};