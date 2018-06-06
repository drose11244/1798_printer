import { Meteor } from 'meteor/meteor';
import '/imports/MongoDBCollection.js';



// Ｃollection 對照

// Mongo_UserInfo  		= new Mongo.Collection("UserInfo");
// Mongo_UserNotifi  		= new Mongo.Collection("UserNotifi");
// Mongo_UserOrder  		= new Mongo.Collection("UserOrder");
// // 用戶
// Mongo_Shop  			= new Mongo.Collection("Shop");
// Mongo_ShopFood  		= new Mongo.Collection("ShopFood");
// // 商家
// Mongo_City  			= new Mongo.Collection("City");
// Mongo_Downtown  		= new Mongo.Collection("Downtown");
// // 城市

// Mongo_ShopDoubleFood  	= new Mongo.Collection("ShopDoubleFood");
// // 套餐
// Mongo_ShopSingleMenu  	= new Mongo.Collection("ShopSingleMenu");
// Mongo_ShopSingleFood  	= new Mongo.Collection("ShopSingleFood");
// // 單點
// Mongo_FoodSauce  		= new Mongo.Collection("FoodSauce");

const _SingleOrDouble = ['套餐', '單點'];
var MeteorEach = [];
var Cart = [];
let TotalMoney = 0;
let CartCount = 0;


//看是誰
const _UserOrder = Mongo_UserOrder.find({
    '_id': 'wxMM2QkrnwJPrrEJc'
}).fetch();

_UserOrder.forEach((_UserOrderElem, _UserOrderIndex) => {
    Cart = _UserOrderElem.foodlist;
    // 放入整個底下Cart.forEach
});
// console.log(Cart);

// // const CARTTmpArray = Session.get('CART');
const CARTTmpArray = Cart;
// console.log(CARTTmpArray);

CARTTmpArray.forEach(function (elem, index) {
    Cart.push(elem);
});

Cart.reverse();
// console.log(Cart);

Cart.forEach(function (elem, index) {
    //可能不需要
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
                    money: "NT$ " + SSFelem.money,
                    path: index
                });
                console.log("單點" + JSON.stringify(MeteorEach));
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
                                    path: index
                                });
                                console.log("套餐" + JSON.stringify(MeteorEach));

                                TotalMoney += parseInt(_elem0_df.money);
                            });
                        });
                    });
                });
            });
        });
    };
});
