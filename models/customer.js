const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const CustomerSchema = Schema({
  name: { type: String, required: true },
  phoneNum: { type: Number, required: true },
  cargos: [{ type: Schema.Types.ObjectId, ref: 'Cargo' }],
});
const Customer = mongoose.model('Customer', CustomerSchema);

module.exports = {
  create: newCustomer => Customer.create(newCustomer),
  findCargosOfCustomer: _id => Customer.findById({ _id }).then(x => x.cargos),
  deleteCargo: (customerId, cargoId) =>
    Customer.findById(customerId).then((x) => {
      const toDelete = x.cargos.indexOf(cargoId);
      console.log(x)
      x.cargos.splice(toDelete, 1);
      x.save();
    }),
  addCargo: (query) => {
    Customer.findById({ _id: query.ownerId }).then((model) => {
      if (model.cargos) {
        model.cargos.push(query.cargoId);
        model.save();
      } else {
        model.cargos = [query.cargoId];
        model.save();
      }
    });
    // .then(x => console.log(x));
  },
  Customer,
};
