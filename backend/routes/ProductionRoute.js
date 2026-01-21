const { produceIceCream, getProducts, updateSellingPrice } = require('../controllers/ProductionController');
const verifyToken = require('../middlewares/VerifyToken');

const router = require('express').Router()

// Make Ice Cream (Action)
router.post('/production/produce', verifyToken, produceIceCream);

// View Finished Stock (List)
router.get('/products', verifyToken, getProducts);
router.put('/product/update_price/:id', verifyToken, updateSellingPrice);
module.exports = router