import { Meteor } from 'meteor/meteor';
import '/imports/MongoDBCollection.js';
import { rejects } from 'assert';
import { format } from 'util';


// function mqttGet(){
//mqtt
var mqtt = require('mqtt');
var PORT = "1919";
var userName = 'jnadtechmqtt';
var userPasswd = 's123';
var options = {
    port: PORT,
    username: userName,
    password: userPasswd,
};

//order and bash
const _SingleOrDouble = ['套餐', '單點'];
var fs = require('fs');
var exec = require('child_process').exec;
var MeteorEach = [];
var Cart = [];
let TotalMoney = 0;
let CartCount = 0;
var _UserOrder;
var CARTTmpArray;
let array = [];

var client = mqtt.connect('mqtt://jnadtechmqtt.com', options);

client.on('connect', function () {
    client.subscribe('Im1798');
});

client.on('message', function (topic, message) {
    let mqttData = message.toString();
    // console.log("mqttData: " + mqttData);
    let mqttPromise = new Promise((resolve, reject) => {
        // mqttData
        if (String(mqttData) != "") {
            console.log("mqtt_success");
            resolve(mqttData);
        } else {
            console.log("mqtt_no");
            reject('No');
        }
    })

    mqttPromise.then((value) => {
        console.log("then: " + value);
        var OrderPromise = new Promise((resolve, reject) => {
            _UserOrder = Mongo_UserOrder.find({
                '_id': value
            }).fetch();

            if (_UserOrder) {
                //    console.log("success");
                resolve('yes');
            } else {
                //    console.log('Fail');
                reject("db_notFound_err");
            }
        });

        OrderPromise.then((value) => {
            _UserOrder.forEach((_UserOrderElem, _UserOrderIndex) => {
                CARTTmpArray = _UserOrderElem.foodlist;
            });

            CARTTmpArray.forEach(function (elem, index) {
                Cart.push(elem);
            });

            Cart.reverse();

            Cart.forEach(function (elem, index) {
                let _elem0 = elem;
                CartCount++;
                if (_elem0.type == "single") {
                    const SSF = Mongo_ShopSingleFood.find({
                        '_id': _elem0.foodid
                    }).fetch();

                    SSF.forEach(function (SSFelem, SSFindex) {
                        const SSM = Mongo_ShopSingleMenu.find({
                            '_id': SSFelem.SingleMenu_id
                        }).fetch();

                        SSM.forEach(function (SSMelem, SSMindex) {
                            const _elem0_FSid = _elem0.foodsauceid.split(',');
                            let _sauce = "";
                            _elem0_FSid.forEach(function (FSidelem, FSidindex) {
                                const FS = Mongo_FoodSauce.find({
                                    '_id': FSidelem
                                }).fetch();

                                FS.forEach(function (FSelem, FSindex) {
                                    _sauce += FSelem.zh;
                                    if (FSidindex < (_elem0_FSid.length - 1)) {
                                        _sauce += ',';
                                    };
                                });

                            });
                            MeteorEach.push({
                                SingleOrDouble: 1, // 1=單點 ,0=套餐
                                head: CartCount + '.' + _SingleOrDouble[1],
                                catena: "" + SSMelem.zh + "系列",
                                name: "" + _elem0.foodname,
                                sauce: "" + _sauce,
                                // money: "NT$ " + SSFelem.money,
                                money: SSFelem.money,
                                path: index
                            });
                            // console.log("單點" + JSON.stringify(MeteorEach));
                            TotalMoney += parseInt(SSFelem.money);
                        });
                    });
                } else {
                    const _elem0_df = _elem0.df; // 主餐
                    const _elem0_dv = _elem0.dv; // 副餐
                    const _elem0_dd = _elem0.dd; // 飲品 濃湯
                    const _elem0_st = _elem0.st; // 原味 糖 冰塊

                    // 主食 主食甜品 價錢 
                    const First_SDF = Mongo_ShopDoubleFood.find({
                        '_id': _elem0_df.objid
                    }).fetch();

                    First_SDF.forEach(function (FSDFelem, FSDFindex) {
                        const First_SSF = Mongo_ShopSingleFood.find({
                            '_id': FSDFelem.Sigleid
                        }).fetch();

                        First_SSF.forEach(function (FSSFelem, FSSFindex) {
                            const First_SSM = Mongo_ShopSingleMenu.find({
                                '_id': FSSFelem.SingleMenu_id
                            }).fetch();

                            First_SSM.forEach(function (FSSMelem, FSSMindex) {
                                // 副餐
                                const Second_SSF = Mongo_ShopSingleFood.find({
                                    '_id': _elem0_dv.dvobjid
                                }).fetch();

                                Second_SSF.forEach(function (SSSFelem, SSSFindex) {
                                    const Second_FS = Mongo_FoodSauce.find({
                                        '_id': _elem0_dv.sauceid
                                    }).fetch();

                                    Second_FS.forEach(function (SFSelem, SFSindex) {
                                        // 飲品
                                        const dirnkName = Mongo_ShopSingleFood.find({
                                            '_id': _elem0_dd.singlefoodid
                                        }).fetch();

                                        dirnkName.forEach(function (DNelem, DNindex) {
                                            let TmpSauce = " (";

                                            _elem0_st.forEach(function (STelem, STindex) {
                                                const drink_sauce = Mongo_FoodSauce.find({
                                                    '_id': STelem.sauceid
                                                }).fetch();

                                                drink_sauce.forEach(function (Dselem, Dsindex) {
                                                    TmpSauce += Dselem.zh;
                                                    if (STindex < (_elem0_st.length - 1)) {
                                                        TmpSauce += ',';
                                                    };
                                                });
                                            });

                                            TmpSauce += ')';

                                            MeteorEach.push({
                                                SingleOrDouble: 0, // 1=單點 ,0=套餐
                                                head: CartCount + '.' + _SingleOrDouble[0],
                                                meal: _elem0_df.title,
                                                first: FSSFelem.zh + '(' + _elem0_df.sauce + ')',
                                                second: SSSFelem.zh + '(' + SFSelem.zh + ')',
                                                drink: DNelem.zh + TmpSauce,
                                                // money: "NT$ " + _elem0_df.money,
                                                money: _elem0_df.money,
                                            });
                                            TotalMoney += parseInt(_elem0_df.money);
                                        });
                                    });
                                });
                            });
                        });
                    });
                }
            });


            var userInfo = Mongo_UserInfo.find({
                'order': {
                    $elemMatch: {
                        //   'user_order_id': 'brsdmyk7H6iafNy4u'
                        'user_order_id': mqttData
                    }
                }
            }).fetch();

            // console.log(userInfo);
            // console.log(userInfo[0].user_school_mail_id);
            // console.log(userInfo[0].import.phone);
            // console.log("----------");

            array[2] = "電話 : " + userInfo[0].import.phone + "\n";
            array[3] = "學號 : " + userInfo[0].user_school_mail_id + "\n";
            array[4] = "--------------\n";

            for (var i = 0; i < MeteorEach.length; i++) {
                if (MeteorEach[i]['SingleOrDouble'] == 1) {
                    array.push(MeteorEach[i]['head'] + "\n");
                    array.push(MeteorEach[i]['name'] + "\n");
                    array.push(MeteorEach[i]['sauce'] + "\n");
                    array.push("NT：" + MeteorEach[i]['money'] + "\n");
                    array.push("--------------\n");
                } else if (MeteorEach[i]['SingleOrDouble'] == 0) {
                    // meal
                    array.push(MeteorEach[i]['head'] + "\n");
                    array.push(MeteorEach[i]['meal'] + "\n");
                    array.push(MeteorEach[i]['first'] + "\n");
                    array.push(MeteorEach[i]['second'] + "\n");
                    array.push("NT：" + MeteorEach[i]['money'] + "\n");
                    array.push("--------------\n");
                } else {
                    console.log("Error");
                }
            }
            array.push("總價 NT：" + TotalMoney + "\n");
            let foodlist = array;
            let myDate = new Date();
            let time = myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds() +
                ":" + myDate.getMilliseconds();

            foodlist = String(foodlist).replace(/,/g, "");
            // console.log(foodlist);

            //   let filename = "12334"
            let filename = mqttData;
            // let path = "/Users/apple/" + filename + ".txt"
            //For Mac
            // let path = "/Users/apple/Program/meteor/1798_printer/tmp/" + filename + ".txt"
            // /Users/apple / Program / meteor / 1798 _printer
            //For ubuntu
            // let path = "/home/bigrain/Programs/1798_printer/tmp/" + filename + ".txt"
            let path = "/home/bigrain/Programs/1798_printer/tmp/" + filename + "_" + time + ".txt"

            fs.writeFile(path, foodlist, function (err) {
                if (err) {
                    return console.log(err);
                };
                // 這邊應該可以直接導向不用在經過腳本，他應該可以直接下腳本。
                // let cmd = "cat " + path + "|" + "grep 學號";
                // let cmd = "cat " + path;
                // # cat menu_a | paps--left - margin=1 --font = 'Microsoft JhengHei UI' | lp
                let cmd = "cat " + path + "| paps --left-margin=1 --font='Microsoft JhengHei UI' | lp"
                exec(cmd, function (error, stdout, stderr) {
                    if (error) {
                        console.error('error: ' + error);
                        return;
                    }
                    console.log('stdout: ' + stdout);
                    console.log('stderr: ' + typeof stderr);
                });
                // console.log('Hello World > helloworld.txt');
            });


        }, (reason) => {
            console.log("reason: " + reason);
        });
    }, (error) => {
        console.log("error: " + error);
    });

});

