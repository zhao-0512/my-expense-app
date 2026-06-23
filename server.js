require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./User');
const Expense = require('./Expense');

const app = express();
app.use(express.json());
app.use(express.static('public'));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB 連線成功！'))
  .catch(err => console.error('❌ 連線失敗：', err));

app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).json({ message: '🎉 註冊成功！' });
  } catch (err) {
    res.status(500).json({ message: '註冊失敗', error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: '帳號或密碼錯誤' });
    }
    res.status(200).json({ message: '✅ 登入成功！' });
  } catch (err) {
    res.status(500).json({ message: '伺服器錯誤', error: err.message });
  }
});

app.post('/api/expenses', async (req, res) => {
  try {
    const { username, type, category, item, amount } = req.body;
    const newExpense = new Expense({ username, type, category, item, amount });
    await newExpense.save();
    res.status(201).json({ message: '✅ 記帳成功！' });
  } catch (err) {
    res.status(500).json({ message: '記帳失敗', error: err.message });
  }
});

app.get('/api/expenses/:username', async (req, res) => {
  try {
    const expenses = await Expense.find({ username: req.params.username });
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ message: '讀取失敗', error: err.message });
  }
});

// ==========================================
// 👇 新增：刪除單筆記帳紀錄的 API 👇
app.delete('/api/expenses/:id', async (req, res) => {
  try {
    const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
    if (!deletedExpense) {
      return res.status(404).json({ message: '找不到該筆紀錄' });
    }
    res.status(200).json({ message: '✅ 刪除成功！' });
  } catch (err) {
    res.status(500).json({ message: '刪除失敗', error: err.message });
  }
});
// 👆 結束 👆
// ==========================================

// === 作業要求的 /api/accounts 安全攔截 ===
app.get('/api/accounts', (req, res) => {
    res.status(401);
    return res.send(`
        <script>
            alert("未登入安全攔截：請先登入帳號！");
            window.location.href = "/";
        </script>
    `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`伺服器運作中 : http://localhost:${PORT}`));
