const { Router } = require('express');

const router = Router();

router.get('/avatar-headshot', async (req, res, next) => {
    try {
        const { userIds } = req.query;

        if (!userIds)
            throw { message: 'Bad Request', code: 400 };
        
        const response = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userIds}&size=100x100&format=Png&isCircular=false`);

        res.status(200).json({
            message: 'OK',
            data: await response.json()
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;