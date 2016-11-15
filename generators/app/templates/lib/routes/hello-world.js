'use strict';

const helloWorld = require('../hello-world');

function hello(req, res) {
    const name = req.swagger.params.name.value || 'stranger';
    res.json({message: helloWorld(name)});
}

module.exports = {
    hello
};
