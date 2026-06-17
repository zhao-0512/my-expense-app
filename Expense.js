const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  username: { type: String, required: true },
  type: { type: String, required: true },     // 收入 或 支出
  category: { type: String, required: true }, // 旅遊、交通、伙食、其他...
  item: { type: String, required: true },     // 消費項目
  amount: { type: Number, required: true },   // 金額
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Expense', expenseSchema);