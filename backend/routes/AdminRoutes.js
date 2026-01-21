const router=require('express').Router()

const { getAdminStats } = require('../controllers/StatsController');
const verifyToken = require('../middlewares/VerifyToken');

// ...
router.get('/admin/stats', verifyToken, getAdminStats);

module.exports = router;