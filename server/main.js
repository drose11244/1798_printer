import { Meteor } from 'meteor/meteor';
import '/imports/MongoDBCollection.js';
import { rejects } from 'assert';
import { format } from 'util';




    // var mqtt = require('mqtt');
    // var PORT = "1919";
    // var userName = 'jnadtechmqtt';
    // var userPasswd = 's123';
    // var options = {
    //     port: PORT,
    //     username: userName,
    //     password: userPasswd,
    // }
    // var client = mqtt.connect('mqtt://jnadtechmqtt.com', options);

    // client.on('connect', function () {
    //     client.subscribe('Im1798');
    // })

    // client.on('message', function (topic, message) {


    //     var mqttData = message.toString();
    //     console.log(mqttData);
    //     var mqttGetData = new Promise(function (resolve, reject) {
    //         if (String(mqttGetData) == null) {
    //             console.log("yes");
    //             resolve(mqttData);

    //         } else {
    //             console.log("no");
    //             reject("data is null")

    //         }
    //     })
    //     mqttGetData.then(function (value) {
    //         console.log("value" + value);
    //     }, function (err) {
    //         console.log("err" + err);
    //     })
    // });
// bash 
    // var exec = require('child_process').exec;
    // var fs = require('fs');

    // let array = [];
    // let filename = "12334"
    // let path = "~/"+filename+".sh"
    // array[0] = "學生名字：糕與森\n"
    // // let NameStd = "學生名字：糕與森";
    // array[1] = "電話 : 0938913383\n";
    // // let phone = "電話 : 0938913383";
    // array[2] = "學號 : 1036011\n"
    // // let number = "學號 : 1036048";
    // array[3] = "--------------\n";
    // // let fielformat = "--------------";

    // // let foodlist = array[0] + "\n" + array[1] + "\n" + array[2] + "\n" + array[3] + "\n";
    // let foodlist = array[0]+ array[1]+ array[2] + array[3];
    // if()


    // fs.writeFile('/Users/apple/helloworld.sh', foodlist, function (err) {
    //     if (err) return console.log(err);
    //     console.log('Hello World > helloworld.txt');
    // });


    
    
    // exec('echo ' + NameStd + '>' + path, function (error, stdout, stderr) {
    //   if (error) {
    //     console.error('error: ' + error);
    //     return;
    //   }
    //   console.log('stdout: ' + stdout);
    //   console.log('stderr: ' + typeof stderr);
    // });

    // exec('echo ' + phone + ' >> ' + path, function (error, stdout, stderr) {
    //     if (error) {
    //         console.error('error: ' + error);
    //         return;
    //     }
    //     console.log('stdout: ' + stdout);
    //     console.log('stderr: ' + typeof stderr);
    // });

    // exec('echo ' + number + ' >> ' + path, function (error, stdout, stderr) {
    //     if (error) {
    //         console.error('error: ' + error);
    //         return;
    //     }
    //     console.log('stdout: ' + stdout);
    //     console.log('stderr: ' + typeof stderr);
    // });

    // exec('echo ' + fielformat + ' >> ' + path, function (error, stdout, stderr) {
    //     if (error) {
    //         console.error('error: ' + error);
    //         return;
    //     }
    //     console.log('stdout: ' + stdout);
    //     console.log('stderr: ' + typeof stderr);
    // });

    // exec('echo ' + foodlist + ' >> ' + path, function (error, stdout, stderr) {
    //     if (error) {
    //         console.error('error: ' + error);
    //         return;
    //     }
    //     console.log('stdout: ' + stdout);
    //     console.log('stderr: ' + typeof stderr);
    // });


//餐點

    const _SingleOrDouble = ['套餐', '單點'];
    var MeteorEach = [];
    var Cart = [];
    let TotalMoney = 0;
    let CartCount = 0;
    var _UserOrder;
    var CARTTmpArray;
       
       var OrderPromise = new Promise((resolve, reject) => {
           _UserOrder = Mongo_UserOrder.find({
               '_id': 'zxa2Nc65yxnppDQfB'
           }).fetch();
           if (_UserOrder) {
               console.log("success");
               resolve('yes');
           } else {
               console.log('Fail');
               reject(no);
           }
       });

        OrderPromise.then((value)=>{
            _UserOrder.forEach((_UserOrderElem, _UserOrderIndex) => {
                CARTTmpArray = _UserOrderElem.foodlist;
                // 放入整個底下Cart.forEach
            });

            CARTTmpArray.forEach(function (elem, index) {
                // console.log(elem);
                Cart.push(elem);
            });

            Cart.reverse();
            // console.log(Cart);

            Cart.forEach(function (elem, index) {
                //可能不需要
                let _elem0 = elem;
                // console.log(_elem0);
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
                                // SingleOrDouble: 1, // 1=單點 ,0=套餐
                                // head: CartCount + '.' + _SingleOrDouble[1],
                                // catena: "" + SSMelem.zh + "系列",
                                name: "" + _elem0.foodname,
                                sauce: "" + _sauce,
                                money: "NT$ " + SSFelem.money,
                                // path: index
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
                                                money: "NT$ " + _elem0_df.money,
                                            });
                                            TotalMoney += parseInt(_elem0_df.money);
                                        });
                                    });
                                });
                            });
                        });
                    });
                };
            });
            console.log(MeteorEach);
        },(reason)=>{
            console.log("reason: " + reason);
        });