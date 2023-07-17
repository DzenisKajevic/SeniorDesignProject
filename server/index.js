// might install Joi -> used for validating data

// cd node_modules\.bin
// jshint ../../index.js
const app = require("./app.js");
const generalConfig = require('./configs/general.config');
const dbConnection = require('./utils/db.service');

const start = async () => {
    try {
        const port = generalConfig.expressPort;
        app.listen(port, () => console.log(`Listening on port ${port}.`));
    } catch (error) {
        console.error(error);
        process.exit(1);
    }

    try {
        await dbConnection.connect();
    }
    catch (error) {
        console.log(error);
    }
};
start();