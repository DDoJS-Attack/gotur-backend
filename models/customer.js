const mongoose = require('mongoose');

const Schema = { ...mongoose.Schema };

const CustomerSchema = Schema({
  name: { type: String, required: true },
  phoneNum: { type: Number, required: true },
  cargos: [{ type: Schema.Types.ObjectId, ref: 'Cargo' }],
});
const Customer = mongoose.model('Customer', CustomerSchema);

module.exports = { find: Customer.find };
