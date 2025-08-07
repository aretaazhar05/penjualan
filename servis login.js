const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// DB connect
mongoose.connect('mongodb://localhost:27017/tokopedia_clone', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Model
const User = mongoose.model('User', new mongoose.Schema({
  email: String,
  password: String,
}));

// Register
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hash });
  await user.save();
  res.send({ message: 'User terdaftar' });
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).send({ message: 'User tidak ditemukan' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).send({ message: 'Password salah' });

  const token = jwt.sign({ id: user._id }, 'secret-key');
  res.send({ message: 'Login sukses', token });
});

app.listen(3000, () => console.log('Server jalan di http://localhost:3000'));
