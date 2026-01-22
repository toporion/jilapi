const { produceIceCream, getProducts, updateSellingPrice, updateProductDetails } = require('../controllers/ProductionController');
const fileUploader = require('../middlewares/FileUploader');
const verifyToken = require('../middlewares/VerifyToken');

const router = require('express').Router()

// Make Ice Cream (Action)
router.post('/production/produce', verifyToken, produceIceCream);

// View Finished Stock (List)
router.get('/products', getProducts);
router.put('/product/update_price/:id', verifyToken, updateSellingPrice);
router.put('/product/update/:id', verifyToken, fileUploader.single('image'), updateProductDetails);
module.exports = router