const { Router } = require('express');

const router = Router();

const roblox = require('./roblox');
const scriptBlox = require('./scriptBlox');

router.use('/roblox', roblox);

router.use('/scriptBlox', scriptBlox);

module.exports = router;