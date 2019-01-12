//models---user.js
const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    "userId": String,
    "userName": String,
    "userPwd": String,
    "orderList": Array,
    "cartList": [{
        'productId': String,
        'productName': String,
        'salePrice': Number,
        'productImage': String,
        "checked": String,
        "productNum": Number
    }],
    "addressList": [{
        "addressId": String,
        "userName": String,
        "streetName": String,
        "postCode": String,
        "tel": Number,
        "isDefault": Boolean,
    }]
});

module.exports = mongoose.model("User", userSchema);