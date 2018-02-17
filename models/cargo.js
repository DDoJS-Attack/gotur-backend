const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CargoSchema = Schema(
  {
    SourceAdress: { type: String, required: true },
    DestinationAdress: { type: String, required: true },
    SourceLoc: {
      type: [Number],
      required: true,
      index: '2d',
    },
    DestinationLoc: {
      type: [Number],
      required: true,
      index: '2d',
    },
    Note: { type: String, required: true },
    Courier: { type: Schema.Types.ObjectId, ref: 'Courier', default: null },
    Owner: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    OwnTime: { type: Date, default: null },
    PickTime: { type: Date, default: null },
    DeliverTime: { type: Date, default: null },
    Status: {
      type: String,
      enum: ['Waiting', 'OnWay', 'Delivired'], // TODO Cases
      default: 'Waiting',
    },
    Price: Number,
    Weigth: Number,
  },
  {
    timestamps: true,
  },
);

const Cargo = mongoose.model('Cargo', CargoSchema);

module.exports = {
  find: Cargo.find,
  findById: Cargo.findById,
  remove: Cargo.remove,
  create: (newCargo) => {
    Cargo.create(newCargo);
  },
  Cargo,
};
