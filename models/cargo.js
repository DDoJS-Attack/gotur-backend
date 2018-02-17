const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const States = ['Default', 'Owned', 'OnWay', 'Delivery'];
const StatusEnum = {
  Default: 0,
  Owned: 1,
  OnWay: 2,
  Delivery: 3,
};
const CargoSchema = Schema(
  {
    SourceAdress: { type: String, required: true },
    DestinationAdress: { type: String, required: true },
    SourceLoc: {
      type: [Number],
      required: true,
      index: '2dsphere',
    },
    DestinationLoc: {
      type: [Number],
      required: true,
      index: '2dsphere',
    },
    Note: { type: String, required: true },
    Courier: { type: Schema.Types.ObjectId, ref: 'Courier', default: null },
    Owner: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    Times: {
      type: [],
      required: true,
      default: [
        { Status: 'Owned', Date: null },
        { Status: 'OnWay', Date: null },
        { Status: 'Delivery', Date: null },
      ],
    },
    Status: {
      type: String,
      default: States[0],
      required: true,
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
  StatusEnum,
  find: query => Cargo.find(query),
  findById: id => Cargo.findById(id),
  remove: id => Cargo.remove(id),
  create: newCargo => Cargo.create(newCargo),
  updateStatus: (id, statusCode, courierId) =>
    Cargo.update(
      { _id: id, 'Times.Status': States[statusCode] },
      {
        $set: {
          Courier: courierId,
          Status: States[statusCode],
          'Times.$.Date': new Date(),
        },
      },
    ),
  findNearest: (loc, distance) =>
    Cargo.find({
      SourceLoc: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [loc.longitude, loc.latitude],
          },
          $maxDistance: distance,
        },
      },
    }),

  Cargo,
};
