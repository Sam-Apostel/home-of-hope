const ftp = require('./private-vars.js');
const FtpDeploy = require('ftp-deploy');


const ftpDeploy = new FtpDeploy();

const config = {
    user: ftp.usr,
    password: ftp.pwd,
    host: ftp.hst,
    port: ftp.port,
    localRoot: __dirname + "/dist",
    remoteRoot: ftp.rrt,
    include: ["*","**/*"],
    deleteRemote: true,
    forcePasv: true
};

ftpDeploy
    .deploy(config)
    .then(res => {
        console.log("finished!");  //TODO: formatting res to pretty print in console to output what files are uploaded
    })
    .catch(err => console.log(err));
