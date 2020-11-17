const PORT = process.env.PORT || 8000;
const NODE_ENV = process.env.NODE_ENV || 'production';
const DATABSASE_URL = process.env.DATABSASE_URL || 'postgresql://angelovazquez@localhost/roost';
const TEST_DATABSASE_URL = process.env.TEST_DATABSASE_URL || 'postgresql://angelovazquez@localhost/roost';


module.exports = { PORT, NODE_ENV, DATABSASE_URL, TEST_DATABSASE_URL}
