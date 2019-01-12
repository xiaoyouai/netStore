//good.js
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
    'productId': String,
    'productName': String,
    'salePrice': Number,
    'productImage': String,
    'productNum': Number,
    'checked': String
});

//上面是定义一个schema,schema是mongoose里会用到的一种数据模式，可以理解为表结构的定义；
//每个schema会映射到mongodb中的一个collection，它不具备操作数据库的能力

module.exports = mongoose.model('Good', productSchema);
//对上面定义的productSchema生成一个Good的model并导出,model是由schema生成的模型，可以对数据库的操作,
//注意，这里写成Goods，数据库里对应的collections要写成goods,必须要加s，Goods才会自动去找到goods进行关联,
//('Good', productSchema);也可以写成('Good', productSchema,'goods')指定关联