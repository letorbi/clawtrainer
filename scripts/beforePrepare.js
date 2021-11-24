const path = require('path');
const { spawn } = require('child_process');

module.exports = ctx => {
    return new Promise((resolve, reject) => {
        console.log("Installing NPM packages inside www...")
        const child = spawn('npm', ['install'], {
            cwd: path.join(ctx.opts.projectRoot, 'www'),
            stderr: 'inherit',
            stdio: 'inherit'
        });
        child.on('exit', code => {
            if (code === 0)
                resolve(code);
            else
                reject(new Error("NPM exited with code " + code));
        });
    });
};
