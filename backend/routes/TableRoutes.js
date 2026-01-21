const router = require('express').Router();
const verifyToken = require('../middlewares/VerifyToken');
const { addTable, getTables, verifyPasscode, placeTableOrder, getLiveOrders, updateOrderStatus, getPublicMenu, getOrderStatus } = require('../controllers/TableController');

// ...

// ADMIN ROUTES (Protected)
router.post('/table/add', verifyToken, addTable);
router.get('/tables', verifyToken, getTables); // For generating QR codes
router.get('/table/orders/live', verifyToken, getLiveOrders); // For Kitchen View
router.put('/table/order/status', verifyToken, updateOrderStatus); // For confirming

// CUSTOMER ROUTES (Public - No Token Needed)
router.post('/table/verify', verifyPasscode);
router.post('/table/order/place', placeTableOrder);
router.get('/table/menu/list', getPublicMenu);
router.get('/table/order/status/:orderId', getOrderStatus);

module.exports = router;
// ...