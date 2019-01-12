var express = require('express');
var router = express.Router();
require('./../util/util')

var User = require('./../models/user');
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});
router.get('/test', function(req, res, next) {
    res.send('test');
});
router.post('/login', function(req, res, next) {
    var param = {
        userName: req.body.userName,
        userPwd: req.body.userPwd,
    }
    User.findOne(param, (err, doc) => {
        if (err) {
            res.json({
                status: '1',
                msg: '账号或者密码错误'
            })
        } else {
            if (doc != null) {
                res.cookie("userId", doc.userId, {
                    path: '/',
                    maxAge: 1000 * 60 * 60
                });
                res.cookie("userName", doc.userName, {
                    path: '/',
                    maxAge: 1000 * 60 * 60
                });
                // req.session.user = doc;
                res.json({
                    status: '0',
                    msg: '',
                    result: {
                        userName: doc.userName,
                        userPwd: doc.userPwd
                    }
                })
            } else {
                res.json({
                    status: '1',
                    msg: '账号或者密码错误'
                })
            }
        }


    })
});

// 登出
router.post('/logout', (req, res, next) => {
    res.cookie("userId", '', {
        path: '/',
        maxAge: -1
    });
    res.cookie("userName", '', {
        path: '/',
        maxAge: -1
    });
    res.json({
        status: '0',
        msg: 'success',
        result: ''
    })
})

router.get('/checkLogin', (req, res, next) => {
        if (req.cookies.userId) {
            res.json({
                status: '0',
                msg: '',
                result: req.cookies.userName || ''
            })
        } else {
            res.json({
                status: '1',
                msg: '未登录',
                result: ''
            })
        }
    })
    //查询用户购物车数据
router.get('/cartList', (req, res, next) => {
    var userId = req.cookies.userId;
    User.findOne({ userId: userId }, (err, doc) => {
        if (err) {
            res.json({
                status: '1',
                msg: err.message,
                result: ''
            })
        } else {
            if (doc) {
                res.json({
                    status: '0',
                    msg: '',
                    result: doc.cartList
                })
            }
        }
    })
})

//购物车删除
router.post("/cartDel", (req, res, next) => {
    let userId = req.cookies.userId;
    let productId = req.body.productId;
    User.update({ userId: userId }, {
        $pull: {
            'cartList': { 'productId': productId }
        }
    }, (err, doc) => {
        if (err) {
            res.json({
                status: '1',
                msg: err.message,
                result: ''
            })
        } else {
            if (doc) {
                res.json({
                    status: '0',
                    msg: '',
                    result: 'success'
                })
            }
        }
    })
})

//购物车商品数量加减
router.post("/cartEdit", (req, res, next) => {
    let userId = req.cookies.userId;
    let productId = req.body.productId;
    let productNum = req.body.productNum;
    let checked = req.body.checked;

    User.update({ "userId": userId, "cartList.productId": productId }, {
        "cartList.$.productNum": productNum, //更新子文档，即users--cartList
        "cartList.$.checked": checked,
    }, (err, doc) => {
        if (err) {
            res.json({
                status: '1',
                msg: err.message,
                result: ''
            })
        } else {
            if (doc) {
                res.json({
                    status: '0',
                    msg: '',
                    result: 'success'
                })
            }
        }
    })
})

//购物车设置全选或全不选
router.post('/editCheckAll', (req, res, next) => {
        let userId = req.cookies.userId;
        let checkAll = req.body.checkAll ? '1' : '0';
        User.findOne({ userId: userId }, (err, user) => {
            if (err) {
                res.json({
                    status: '1',
                    msg: err.message,
                    result: ''
                })
            } else {
                if (user) {
                    user.cartList.forEach(item => {
                        item.checked = checkAll;
                    });
                    user.save((err2, doc) => {
                        if (err2) {
                            res.json({
                                status: '1',
                                msg: err2.message,
                                result: ''
                            })
                        } else {
                            if (doc) {
                                res.json({
                                    status: '0',
                                    msg: '',
                                    result: 'success'
                                })
                            }
                        }
                    })
                }
            }
        })
    })
    //查询用户地址
router.get("/addressList", (req, res, next) => {
    let userId = req.cookies.userId;
    User.findOne({ userId: userId }, (err, doc) => {
        if (err) {
            res.json({
                status: '1',
                msg: err.message,
                result: ''
            })
        } else {
            if (doc) {
                res.json({
                    status: '0',
                    msg: '',
                    result: doc.addressList
                })
            }
        }
    })
})

//切换默认地址
router.post("/setDefault", (req, res, next) => {
    let userId = req.cookies.userId;
    let addressId = req.body.addressId;
    if (!addressId) {
        res.json({
            status: '1003',
            msg: 'addressId is null',
            result: ''
        })
    } else {
        User.findOne({ userId: userId }, (err, doc) => {
            if (err) {
                res.json({
                    status: '1',
                    msg: err.message,
                    result: ''
                })
            } else {
                if (doc) {
                    var addressList = doc.addressList;
                    addressList.forEach(item => {
                        if (item.addressId == addressId) {
                            item.isDefault = true;
                        } else {
                            item.isDefault = false;
                        }
                    })
                    doc.save((err2, doc2) => {
                        if (err2) {
                            res.json({
                                status: '1',
                                msg: err2.message,
                                result: ''
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

    }
})

//删除地址
router.post('/delAddress', (req, res, next) => {
    let userId = req.cookies.userId;
    let addressId = req.body.addressId;
    User.update({ userId: userId }, {
        $pull: {
            'addressList': { 'addressId': addressId }
        }
    }, (err, doc) => {
        if (err) {
            res.json({
                status: '1',
                msg: err.message,
                result: ''
            })
        } else {
            if (doc) {
                res.json({
                    status: '0',
                    msg: '',
                    result: 'success'
                })
            }
        }
    })
})

//生成订单
router.post('/payMent', (req, res, next) => {
    let userId = req.cookies.userId;
    let orderTotal = req.body.orderTotal;
    let addressId = req.body.addressId;
    User.findOne({ userId: userId }, (err, doc) => {
        if (err) {
            res.json({
                status: '1',
                msg: err.message,
                result: ''
            })
        } else {
            if (doc) {
                let address = '',
                    goodList = '';
                //获取当前用户的地址信息
                address = doc.addressList.filter(item => addressId == item.addressId)
                goodList = doc.cartList.filter(item => item.checked == '1') //购买商品获取

                let platform = '622';
                let r1 = Math.floor(Math.random() * 10);
                let r2 = Math.floor(Math.random() * 10);
                let sysDate = new Date().Format('yyyyMMddhhmmss');
                let createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
                let orderId = platform + r1 + sysDate + r2;

                let order = {
                    orderId: orderId,
                    orderTotal: orderTotal,
                    addressInfo: address,
                    goodList: goodList,
                    orderStatus: '1',
                    createDate: createDate
                }
                doc.orderList.push(order);
                doc.save((err2, doc2) => {
                    if (err2) {
                        res.json({
                            status: '1',
                            msg: err2.message,
                            result: ''
                        })
                    } else {
                        if (doc2) {
                            res.json({
                                status: '0',
                                msg: '',
                                result: {
                                    orderId: order.orderId,
                                    orderTotal: order.orderTotal
                                }
                            })
                        }
                    }
                });

            }
        }
    })
})

//根据订单id查询订单信息
router.get("/orderDetail", (req, res, next) => {
    let userId = req.cookies.userId;
    let orderId = req.param("orderId");
    User.findOne({ userId: userId }, (err, doc) => {
        if (err) {
            res.json({
                status: '1',
                msg: err.message,
                result: ''
            })
        } else {
            if (doc) {
                let orderList = doc.orderList;
                if (orderList.length > 0) {
                    let orderTotal = 0;
                    orderList.forEach(item => {
                        if (item.orderId == orderId) { orderTotal = item.orderTotal; }
                    })
                    if (orderTotal > 0) {
                        res.json({
                            status: '0',
                            msg: '',
                            result: {
                                orderId: orderId,
                                orderTotal: orderTotal
                            }
                        })
                    } else {
                        res.json({
                            status: '123123',
                            msg: '',
                            result: '无此订单'
                        })
                    }

                } else {
                    res.json({
                        status: '123124',
                        msg: '',
                        result: '当前用户未创建订单'
                    })
                }

            }
        }
    })
})

//用户购物车商品数量
router.get('/getCartCount', (req, res, next) => {
    if (req.cookies && req.cookies.userId) {
        let userId = req.cookies.userId;
        User.findOne({ userId: userId }, (err, doc) => {
            if (err) {
                res.json({
                    status: '1',
                    msg: err.message,
                    result: ''
                })
            } else {
                if (doc) {
                    let cartCount = 0;
                    doc.cartList.map(item => {
                        cartCount += parseInt(item.productNum);
                    })
                    res.json({
                        status: '0',
                        msg: '',
                        result: cartCount
                    })
                }
            }
        })
    }
})
module.exports = router;