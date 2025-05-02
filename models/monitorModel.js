const mongoose = require('mongoose');

const monitorSchema = new mongoose.Schema({
    Source: { type: String, required: true },
    Content: { type: String, required: true },
    author: { type: String, required: true },
    "Detection Date": { type: String, required: true },
    Type: { type: String, required: true }
});

module.exports = mongoose.model('Monitor', monitorSchema, 'breaches');