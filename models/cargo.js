const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// enum helper
const States = ['INITIAL', 'ASSIGNED', 'ONWAY', 'DELIVERY'];
const StatusEnum = {
  INITIAL: 0,
  ASSIGNED: 1,
  ONWAY: 2,
  DELIVERY: 3,
};
const CargoSchema = Schema(
  {
    sourceAddress: { type: String, required: true },
    destinationAddress: { type: String, required: true },
    sourceLoc: {
      type: [Number],
      required: true,
      index: '2dsphere',
    },
    destinationLoc: {
      type: [Number],
      required: true,
      index: '2dsphere',
    },
    name: { type: String, required: true },
    courier: { type: Schema.Types.ObjectId, ref: 'Courier', default: null },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    times: {
      type: [],
      required: true,
      default: [
        { status: 'ASSIGNED', date: null },
        { status: 'ONWAY', date: null },
        { status: 'DELIVERY', date: null },
      ],
    },
    status: {
      type: String,
      default: States[0],
      required: true,
    },
    price: Number,
    weigth: Number,
  },
  {
    timestamps: true,
  },
);

const Cargo = mongoose.model('Cargo', CargoSchema);

const updateStatusHelper = (id, statusCode, courierId) => {
  if (courierId) {
    return Cargo.updateOne(
      { _id: id, 'times.Status': States[statusCode] },
      {
        $set: {
          courier: courierId,
          status: States[statusCode],
          'times.$.date': new Date(),
        },
      },
    );
  }
  return Cargo.updateOne(
    { _id: id, 'Times.Status': States[statusCode] },
    {
      $set: {
        Status: States[statusCode],
        'Times.$.Date': new Date(),
      },
    },
  );
};
module.exports = {
  StatusEnum,
  create: () => Cargo.create(),
  find: query => Cargo.find(query),
  findManyById: ids => Cargo.find({ _id: { $in: ids.map(Schema.Types.ObjectId) } }),
  findCustomerCargos: customerId => Cargo.find({ customer: customerId }),
  findCourierCargos: courierId => Cargo.find({ couirer: courierId }),
  findById: id => Cargo.findById(id),
  remove: id => Cargo.remove(id),
  updateStatus: (id, statusCode) => updateStatusHelper(id, statusCode),
  ownCargo: (id, courierId) => updateStatusHelper(id, StatusEnum.ASSIGNED, courierId),
  relaseCargo: id =>
    Cargo.updateOne({ _id: id }, { $set: { status: States[StatusEnum.INITIAL], courier: null } }),
  insert: newCargo => Cargo.insert(newCargo),
  findAvailebleNearest: (loc, distance) =>
    Cargo.find({
      sourceLoc: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [loc.longitude, loc.latitude],
          },
          $maxDistance: distance,
        },
      },
      status: States[StatusEnum.Default],
    }),
  Cargo,
};
