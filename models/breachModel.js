const mongoose = require('mongoose');

const breachSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true,
        lowercase: true
    },
    
    password: {
        type: String,
        required: true
    },

    domain: {
        type: String,
        required: true  // يمكن جعله true إذا أردت جعله إلزامي
    }
});

module.exports = mongoose.model('Breach', breachSchema, 'stolen_logs');
