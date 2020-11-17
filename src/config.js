const PORT = process.env.PORT || 8000;
const NODE_ENV = process.env.NODE_ENV || 'production';
const API_URL = process.env.API_URL || 'postgresql://angelovazquez@localhost/roost';
const TEST_API_URL = process.env.TEST_API_URL || 'postgresql://angelovazquez@localhost/roost';


module.exports = { PORT, NODE_ENV, API_URL, TEST_API_URL}
