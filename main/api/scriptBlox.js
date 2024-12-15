const { Router } = require('express');

const router = Router();

router.get('/fetch', async (req, res, next) => {
    try {
        const { page } = req.query;
        
        if (!page)
            throw { message: 'Bad Request', code: 400 };

        if (isNaN(page))
            throw { message: 'Bad Request', code: 400 };

        const response = await fetch('https://scriptblox.com/api/script/fetch', {
            params: {
                q: '',
                page: parseInt(page)
            }
        });

        res.status(200).json({
            message: 'OK',
            data: await response.json()
        });
    } catch (err) {
        next(err);
    }
});

router.get('/search', async (req, res, next) => {
    try {
        const { q, page, max } = req.query;

        if (!q || !page || !max)
            throw { message: 'Bad Request', code: 400 };
        
        if (isNaN(page) || isNaN(max))
            throw { message: 'Bad Request', code: 400 };

        const response = await fetch(`https://scriptblox.com/api/script/search?q=${q}&page=${page}&max=${max}`);

        res.status(200).json({
            message: 'OK',
            data: await response.json()
        });
    } catch (err) {
        next(err);
    }
});

router.get('/script/:slug', async (req, res, next) => {
    try {
        const { slug } = req.params;

        if (!slug)
            throw { message: 'Bad Request', code: 400 };

        const response = await fetch(`https://scriptblox.com/api/script/${slug}`);

        res.status(200).json({
            message: 'OK',
            data: await response.json()
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;