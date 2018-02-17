const mongoose = require('mongoose');

const Schema = mongoose.Schema;
// TODO ObjectID instead of number
const CustomerSchema = Schema({
  name: { type: String, required: true },
  phoneNum: { type: Number, required: true },
  cargos: [{ type: Schema.Types.ObjectId, ref: 'Cargo' }],
});
const Customer = mongoose.model('Customer', CustomerSchema);

module.exports = {
  create: (newCustomer) => {
    Customer.create(newCustomer);
  },
  findCargosOfCustomer: _id => Customer.findById({ _id }).then(x => x.cargos),
  deleteCargo: (customerId, cargoId) =>
    Customer.findById({ _id: customerId }).then((x) => {
      const toDelete = x.cargos.indexOf(cargoId);
      x.cargos.splice(toDelete, 1);
      x.save();
    }),
    addCargo: (query) => {Customer.findByIdAndUpdate()},
  Customer,
};
