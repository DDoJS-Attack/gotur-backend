const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CourrierSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  cargos: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Cargo' }],
    required: true,
  },
});

const Courrier = mongoose.model('Courrier', CourrierSchema);

const own = (courrierId, cargoId) => Courrier.findByIdAndUpdate(courrierId, {
  $addToSet: {
    cargos: cargoId,
  },
});



const disOwn = (courrierId, cargoId) => CourrierSchema.findByIdAndUpdate(courrierId, {
  $pull: {
    cargos: new Schema.Types.ObjectId(cargoId),
  },
});

module.exports = {
  findById: (x) => Courrier.findById(x),
  find: (x) => Courrier.find(x),
  create: (x) => Courrier.create(x),
  own,
  disOwn,
};
