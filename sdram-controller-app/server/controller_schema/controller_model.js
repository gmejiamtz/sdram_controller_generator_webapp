const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const controller_schema = new Schema({
    datasheet: { type: Buffer, required: true }
});

const Datasheet = mongoose.model('Datasheet',controller_schema);
module.exports = Datasheet;
