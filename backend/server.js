const express = require('express');
const session = require('express-session');
const { Pool } = require('pg');
const cors = require('cors');
const multer = require('multer');
const B2 = require('@backblaze/b2');

const app = express();
app.use(express.json());
app.use(cors({ origin: '*', credentials: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false },
}));

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
const upload = multer({ dest: 'uploads/' });
const b2 = new B2({
  applicationKeyId: process.env.B2_KEY_ID,
  applicationKey: process.env.B2_KEY,
});

const products = [
  { id: 1, name: 'Business Card', quantityOptions: { 100: 10, 250: 20 }, sizeOptions: { '3.5x2': 1 }, paperTypeOptions: { Glossy: 1.2, Matte: 1 } },
  { id: 2, name: 'Flyer', quantityOptions: { 50: 15, 100: 25 }, sizeOptions: { '5x7': 1.5 }, paperTypeOptions: { Glossy: 1.2, Matte: 1 } },
];

app.get('/api/products', (req, res) => res.json(products));
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  res.json(product);
});

app.post('/api/calculate-price', (req, res) => {
  const { quantity, size, paperType } = req.body;
  const product = products[0]; // Simplified for demo
  const price = product.quantityOptions[quantity] * product.sizeOptions[size] * product.paperTypeOptions[paperType];
  res.json({ price });
});

app.post('/api/cart', upload.single('file'), async (req, res) => {
  await b2.authorize();
  const uploadUrl = await b2.getUploadUrl({ bucketId: process.env.B2_BUCKET_ID });
  const file = await b2.uploadFile({
    uploadUrl: uploadUrl.data.uploadUrl,
    uploadAuthToken: uploadUrl.data.authorizationToken,
    fileName: req.file.originalname,
    data: require('fs').readFileSync(req.file.path),
  });
  req.session.cart = req.session.cart || [];
  req.session.cart.push({ ...req.body, price: 10, fileUrl: file.data.fileName }); // Simplified
  res.json({ success: true });
});

app.get('/api/cart', (req, res) => res.json(req.session.cart || []));
app.delete('/api/cart/:id', (req, res) => {
  req.session.cart = req.session.cart.filter((_, i) => i !== parseInt(req.params.id));
  res.json({ success: true });
});

app.post('/api/orders', async (req, res) => {
  const { name, email, address } = req.body;
  await pool.query('INSERT INTO orders (name, email, address) VALUES ($1, $2, $3)', [name, email, address]);
  req.session.cart = [];
  res.json({ success: true });
});

app.listen(process.env.PORT || 3000, () => console.log(`Server running on port ${process.env.PORT || 3000}`));