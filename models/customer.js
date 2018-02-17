const mongoose = require('mongoose');

const Schema = mongoose.Schema;
// TODO cargos should reference objectIds
const CustomerSchema = Schema({
  name: { type: String, required: true },
  phoneNum: { type: Number, required: true },
  cargos: [{ type: Number, ref: 'Cargo' }],
});
const Customer = mongoose.model('Customer', CustomerSchema);

// TODO error handling
module.exports = {
  find: Customer.find,
  findById: Customer.findById,
  create: (newCustomer) => {
    Customer.create(newCustomer)
      .then(res => console.log(res))
      .catch(err => console.error(err));
  },
  findCargosOfCustomer: _id => Customer.findById({ _id }).then(x => x.cargos),
  Customer,
};
