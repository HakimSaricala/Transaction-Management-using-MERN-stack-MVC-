const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    
    {
    name: {
        type: String,
        require: [true,'add name']
    },
    email: {
        type: String,
        require: [true,'add email'],
        unique: true
    },
    password: {
        type: String,
        require: [true,'add password'],
    },
 
 
}  ,{timestamps : true}); 



module.exports = mongoose.model('User', userSchema);