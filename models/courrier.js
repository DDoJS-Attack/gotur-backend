const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourrierSchema = Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  cargos: [{ type: Schema.Types.ObjectId, ref: 'Cargo' }]
});

