const express = require("express");
const router = express.Router();
const db = require("../db/db");
var crypto = require('crypto');
const jwt = require('jsonwebtoken');



var user;
router.post("/saveTeacherList", (req, res, next) => {
    var salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6';
    var repass = salt + '' + req.body.password;
    var encPassword = crypto.createHash('sha1').update(repass).digest('hex');
    // console.log(encPassword);
    console.log(req.body);
    db.executeSql("INSERT INTO `teacherlist`(`firstname`,`lastname`,`qualification`,`contact`,`whatsapp`,`email`,`password`,`address`,`gender`)VALUES('" + req.body.firstname + "','" + req.body.lastname + "','" + req.body.qualification + "','" + req.body.contact + "','" + req.body.Whatsapp + "','" + req.body.email + "','" + encPassword + "','" + req.body.address + "','" + req.body.gender + "');", function (data, err) {
        if (err) {
            console.log(err);

        } else {
            // console.log(res)
            // console.log(err);
            // res.json("success");
            for (let i = 0; i < req.body.rights.length; i++) {
                for (let j = 0; j < req.body.rights[i].selsubjects.length; j++) {
                    db.executeSql("INSERT INTO `subrightstoteacher`(`teacherid`, `stdid`, `subid`, `updateddate`) VALUES (" + data.insertId + "," + req.body.rights[i].stdid + "," + req.body.rights[i].selsubjects[j].subid + ",null)", function (data1, err) {
                        if (err) {
                            console.log(err);
                        }
                        else { }
                    })
                }
            }
            res.json("success");
        }
    });

});



router.post("/SaveStudentList", (req, res, next) => {
    var salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6';
    var repass = salt + '' + req.body.password;
    var encPassword = crypto.createHash('sha1').update(repass).digest('hex');
    db.executeSql("INSERT INTO `studentlist`(`firstname`,`middlename`,`lastname`,`email`,`password`,`gender`,`dateofbirth`,`contact`,`parents`,`fname`, `mname`, `mnumber`, `pactive`, `mactive`, `cactive`, `batchtime`, `cmmitfee`,`address`,`city`,`pincode`,`standard`,`grnumber`,`transport`,`propic`,`schoolname`)VALUES('" + req.body.firstname + "','" + req.body.middlename + "','" + req.body.lastname + "','" + req.body.email + "','" + encPassword + "','" + req.body.gender + "',CURRENT_TIMESTAMP," + req.body.contact + "," + req.body.parents + ",'" + req.body.fname + "','" + req.body.mname + "'," + req.body.mnumber + "," + req.body.pactive + "," + req.body.mactive + "," + req.body.cactive + ",'" + req.body.batchtime + "','" + req.body.cmmitfee + "','" + req.body.address + "','" + req.body.city + "'," + req.body.pincode + ",'" + req.body.standard + "','" + req.body.grnumber + "'," + req.body.transport + ",'" + req.body.profile + "','" + req.body.schoolname + "');", function (data, err) {
        if (err) {
            console.log(err)
        } else {

            res.json("success");
        }
    });

});

router.post("/SaveVisitorDetails", (req, res, next) => {
    var salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6';
    var repass = salt + '' + req.body.password;
    var encPassword = crypto.createHash('sha1').update(repass).digest('hex');
    db.executeSql("INSERT INTO `visitorreg`( `firstname`, `middlename`, `lastname`, `email`, `password`, `gender`, `contact`, `mothername`, `wappnumber`, `address`, `city`, `pincode`, `standard`, `propic`, `subject`, `school`, `qualification`, `fatherCont`, `motherCont`, `percentage`,`createddate`,`isactive`) VALUES ('" + req.body.firstname + "','" + req.body.middlename + "','" + req.body.lastname + "','" + req.body.email + "','" + req.body.password + "','" + req.body.gender + "'," + req.body.contact + ",'" + req.body.mname + "'," + req.body.wapp + ",'" + req.body.address + "','" + req.body.city + "'," + req.body.pincode + "," + req.body.stdid + ",'" + req.body.profile + "'," + req.body.subid + ",'" + req.body.schoolname + "','" + req.body.lastqulification + "'," + req.body.parents + ",'" + req.body.mnumber + "'," + req.body.percentage + ",CURRENT_TIMESTAMP,false)", function (data, err) {
        if (err) {
            console.log(err);
        }
        else {
            return res.json(data);
        }
    })

});


let secret = 'prnv';
router.post('/UserLogin', (req, res, next) => {
    restart1();
    const body = req.body;
    console.log(body);
    var salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6';
    var repass = salt + '' + body.password;
    var encPassword = crypto.createHash('sha1').update(repass).digest('hex');
    if (body.role == 'Teacher') {
        db.executeSql("select * from teacherlist where email='" + req.body.email + "';", function (data, err) {
            console.log(data);
            if (data != null ) {
                db.executeSql("select * from teacherlist where email='" + req.body.email + "' and password='" + encPassword + "';", function (data, err) {
                    console.log(data);
                    if (data != null) {

                        module.exports.user = {
                            username: data[0].email, password: data[0].password
                        }
                        let token = jwt.sign({ username: data[0].email, password: data[0].password },
                            secret,
                            {
                                expiresIn: '1h' // expires in 24 hours
                            }
                        );
                        console.log("token=", token);
                        data[0].token = token;

                        res.cookie('auth', token);
                        res.json(data);
                    }
                    else {
                        return res.json(2);
                    }
                });
            }
            else {
                return res.json(1);
            }
        });
    }
    else {
      
        db.executeSql("select * from studentlist where email='" + req.body.email + "';", function (data, err) {
            // console.log(data);
            if (data !=  null) {
                db.executeSql("select * from studentlist where email='" + req.body.email + "' and password='" + encPassword + "';", function (data, err) {
                    // console.log(data);
                    if (data != null) {
                        module.exports.user = {
                            username: data[0].email, password: data[0].password
                        }
                        let token = jwt.sign({ username: data[0].email, password: data[0].password },
                            secret,
                            {
                                expiresIn: '1h' // expires in 24 hours
                            }
                        );
                        console.log("token=", token);
                        data[0].token = token;

                        res.cookie('auth', token);
                        res.json(data);
                    }
                    else {
                        return res.json(2);
                    }
                });
            }
            else {
                return res.json(1);
            }
        });
    }
});
function restart1(){
    setTimeout(function () {
        // When NodeJS exits
        console.log("restart ing");
        process.on("exit", function () {

            require("child_process").spawn(process.argv.shift(), process.argv, {
                cwd: process.cwd(),
                detached : true,
                stdio: "inherit"
            });
        });
        process.exit();
    }, 1000);
};



const auth = () => {
    return (req, res, next) => {
        next()
    }
}


module.exports = router;