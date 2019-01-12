// routes文件夹---goods.js
const express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Goods = require('../models/goods');

//连接MongoDB数据库
mongoose.connect('mongodb://localhost:27017/project', { useNewUrlParser: true });

mongoose.connection.on('connected', function() { //连接成功
    console.log("mongdb connected success");
})
mongoose.connection.on('error', function(error) { //连接异常
    console.log("mongdb connected fail", error);
})
mongoose.connection.on('disconnected', function() { //连接断开
    console.log("mongdb connected disconnected");
})

//查询商品列表数据+分页+排序
router.get('/list', function(req, res, next) {
    //地址示例： http://localhost:3000/goods?pageSize=8&page=2&sort=1
    let sort = req.param("sort"); //获取请求的排序参数
    let page = parseInt(req.param("page"));
    let pageSize = parseInt(req.param("pageSize"));
    let priceLevel = req.param('priceLevel');
    let skip = (page - 1) * pageSize;
    let params = {};
    let priceGt, priceLte;
    if (priceLevel != 'all') {
        switch (priceLevel) {
            case '0':
                priceGt = 0;
                priceLte = 100;
                break;
            case '1':
                priceGt = 100;
                priceLte = 500;
                break;
            case '2':
                priceGt = 500;
                priceLte = 1000;
                break;
            case '3':
                priceGt = 1000;
                priceLte = 5000;
                break;
        }
        params = {
            salePrice: {
                $gt: priceGt,
                $lte: priceLte
            }
        }
    }


    let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
    goodsModel.sort({ 'salePrice': sort });

    goodsModel.exec((err, doc) => {
        if (err) {
            res.json({ //res.json发送一个json的响应。这个方法和将一个对象或者一个数组作为参数传递给res.send()方法的效果相同
                status: '1',
                msg: err.message
            });
        } else {
            res.json({
                status: '0',
                msg: '',
                result: {
                    count: doc.length,
                    list: doc
                }
            })
        }
    })
})

//加到购物车
router.post("/addCart", (req, res, next) => {
    var userId = '100000077';
    let productId = req.body.productId;
    var User = require('../models/user');

    User.findOne({ userId: userId }, (err1, userDoc) => {
        if (err1) {
            res.json({
                status: "1",
                msg: err1.message
            })
        } else {
            if (userDoc) {
                let goodsItem = '';
                userDoc.cartList.forEach((item) => {
                    if (item.productId == productId) {
                        goodsItem = item;
                        item.productNum++;
                    }
                });
                if (goodsItem) {
                    userDoc.save((err) => {
                        if (err) {
                            res.json({
                                status: "1",
                                msg: err.message
                            })
                        } else {
                            res.json({
                                status: '0',
                                msg: '',
                                result: 'success'
                            })
                        }
                    })
                } else {
                    Goods.findOne({ productId: productId }, (err2, goodsdoc) => {
                        if (err2) {
                            res.json({
                                status: "1",
                                msg: err2.message
                            })
                        } else {
                            if (goodsdoc) {
                                goodsdoc.productNum = 1; //商品数量为1
                                goodsdoc.checked = 1; //商品被选中了
                                userDoc.cartList.push(goodsdoc); //商品信息加到用户信息中去
                                userDoc.save((err3) => {
                                    if (err3) {
                                        res.json({
                                            status: "1",
                                            msg: err3.message
                                        })
                                    } else {
                                        res.json({
                                            status: '0',
                                            msg: '',
                                            result: 'success'
                                        })
                                    }
                                })
                            }
                        }
                    })
                };
            }
        }

    })
})
module.exports = router;