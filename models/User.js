const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({});
UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });


module.exports = mongoose.model('User', UserSchema);
