const { StatusError } = require('../utils/helper.util');
const { spawn } = require('child_process');

async function generateRecommendedPlaylists(req, res, next) {
    let callPythonScripts = async (req, res, next) => {
        console.log("Python script started");
        //console.log(req.user);
        // spawn new child process to call the python script
        // starts looking for scripts from the server folder (from index.js)
        const python = spawn('python', ['../ML/mainPythonScript.py', JSON.stringify(req.user)]);
        // collect data from script
        var playlists;
        python.stdout.on('data', function (data) {
            console.log('Pipe data from python script ...');
            playlists = data.toString();
        });
        // in close event we are sure that stream from child process is closed
        python.on('close', (code) => {
            console.log(`child process close all stdio with code ${code}`);
            console.log(playlists);
            if (code == 0) {
                res.status(200).send("Successfully generated recommendations");
                /* res.status(200).send(playlists); */
            }
            else if (code == 400)
                next(new StatusError(playlists, `Not enough songs played to recommend playlists`, 400));
            else {
                console.error(`Error generating recommendations\n`);
                next(new StatusError(playlists, `Error generating recommendations`, 500));

            }
        });
    };
    await callPythonScripts(req, res, next);
}


module.exports = {
    generateRecommendedPlaylists
};