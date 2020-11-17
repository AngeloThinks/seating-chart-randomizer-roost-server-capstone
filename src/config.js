const PORT = process.env.PORT || 8000;
const NODE_ENV = process.env.NODE_ENV || 'production';
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://angelovazquez@localhost/roost';
const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://angelovazquez@localhost/roost';


module.exports = { PORT, NODE_ENV, DATABASE_URL, TEST_DATABASE_URL}
