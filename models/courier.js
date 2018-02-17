const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CourierSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  cargos: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Cargo' }],
    required: true,
  },
});

const Courier = mongoose.model('Courier', CourierSchema);

const own = (courierId, cargoId) =>
  Courier.findByIdAndUpdate(courierId, {
    $addToSet: {
      cargos: cargoId,
    },
  });

module.exports = {
  findById: x => Courier.findById(x),
  find: x => Courier.find(x),
  create: x => Courier.create(x),
  own,
};
