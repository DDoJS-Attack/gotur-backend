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
    cargos: new Schema.Types.ObjectId(cargoId),
  },
});

const deliver = (courrierId, cargoId) => CourrierSchema.findByIdAndUpdate(courrierId, {
  $pull: {
    cargos: new Schema.Types.ObjectId(cargoId),
  },
});


module.exports = {
  findById: Courrier.findById,
  find: Courrier.find,
  create: Courrier.create,
  own,
  deliver,
};
