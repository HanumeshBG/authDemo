//-------------------------Sign up call -----------------
var activeuserName;
var numberofleave = 1;
exports.signup = function (req, res) {
    var message = '';
    if (req.method == 'POST') {
        var fname = req.body.first_name;
        var lname = req.body.last_name;
        var mobnum = req.body.mob_no;
        var uname = req.body.user_name;
        var psw = req.body.password;
        var gender = req.body.gender;
        console.log(gender);

        var sqlquery = "INSERT INTO users(first_name, last_name, mob_no, user_name, password,gender) VALUES ('" + fname + "','" + lname + "','" + mobnum + "','" + uname + "','" + psw + "','" + gender + "');";
        db.query(sqlquery, function (err, result) {
            if (err) {
                console.log(err)
            } else {
                var selectQuery = "SELECT id, first_name, last_name,user_name from users where user_name='" + uname + "';";
                db.query(selectQuery, function (err, result1) {
                    if (err) {
                        console.log(err);
                    } else {
                        if (result1.length > 0) {
                            req.session.userId = result1[0].id;
                            req.session.user = result1[0];
                            res.redirect("/home/dashboard");
                            var sqlquery1 = "INSERT INTO leavecounts(uid, sick, casual, personal, other,maternity,total) VALUES ('" + result1[0].id + "','" + 0 + "','" + 0 + "','" + 0 + "','" + 0 + "','" + 0 + "','" + 0 + "');";
                            db.query(sqlquery1, function (err, result2) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log('Leavecount table upated sucessfully..');
                                    var sqlquery2 = "INSERT INTO leavestatuscount(id, appliedleavecount, approvedleavecount, rejectedleavecount) VALUES ('" + result1[0].id + "','" + 0 + "','" + 0 + "','" + 0 + "');";
                                    db.query(sqlquery2, function (err, result3) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            console.log('Leavecount table upated sucessfully..');
                                        }
                                    });
                                }
                            });
                        } else {
                            message = "Wrong Credential";
                            res.render("index", { message: message });
                        }
                    }
                  
                });
         
            }
        });

    } else {
        res.render("signup");
    }
};

//----------------- Login call --------------------------
exports.login = function (req, res) {
    var message = "";
    var sess = req.session;
    if (req.method == "POST") {
        var name = req.body.user_name;
        var psw = req.body.password;

        var selectQuery = "SELECT id, first_name, last_name,user_name from users where user_name='" + name + "' and password = '" + psw + "';";
        db.query(selectQuery, function (err, result) {
            if (result.length > 0) {
                req.session.userId = result[0].id;
                req.session.user = result[0];
                activeuserName = result[0].user_name;
                console.log(result[0]);
                res.redirect("/home/dashboard");
            } else {
                message = "Wrong Credential";
                res.render("index", {message:message});
            }
        });
    } else {
        res.render("index");
    }
};
//------------------- Logout ------------------------------
exports.logout = function (req, res) {
    req.session.destroy(function (err) {
        res.render("index");
    });
};

//------------------- Dashboard --------------------------
exports.dashboard = function (req, res) {
    var userId = req.session.userId;
    var user = req.session.user;
    var id = req.query.id;
        var sql = "SELECT * FROM users ;";
        db.query(sql, function (err, result) {
            res.render("dashboard", { activeuserName: activeuserName, users: result });
        });
};

//----------------- Profile -----------------
exports.profile = function (req, res) {
    var userId = req.session.userId;
    var sql = "SELECT * FROM users where id = '" + userId + "';";
    db.query(sql, function(err, result) {
        res.render("profile", { data: result });
    });
};

//------------------- Apply Leave -------------
exports.applyleave = function (req, res) {
    var userId = req.session.userId;
    var user = req.session.user;
    var selectsql = "SELECT * FROM users;";

    // function to get users lists
    function getUsers(sql, callback) {
        db.query(sql, function (err, result) {
          return callback(result);
        });
    }; 
        if (req.method == "POST") {
            var status = req.body.l_status;
            var category = req.body.l_category;
            var sdate = req.body.l_sdate;
            var edate = req.body.l_edate;
            var name = req.body.full_name;
            var hreason = req.body.l_reason;
            var desc = req.body.l_description;
            var selUId = req.body.selectedUser;
            var files1 = req.files.uploadfiles;

            var oneday = 24 * 60 * 60 * 1000;
            var numDays = Math.round(Math.abs((new Date(sdate) - new Date(edate)) / oneday)) + 1;
            var sqlquery = "INSERT INTO leaves(id, full_name, holiday_reason , status, category, start_date, end_date, description,number_days,files) VALUES('" + selUId + "','" + name + "', '" + hreason + "', '" + status + "', '" + category + "', '" + sdate + "', '" + edate + "', '" + desc + "', '" + numDays + "', '" + files1.name + "'); ";


            files1.mv('public/images/uploadImages/'+files1.name, function(err) {
                if (err)
                  return res.status(500).send(err);

                db.query(sqlquery, function (err, result) {
                    if (err) {
                            console.log(err);
                    } else {
                        message = "leave applied successfully"
                     //   updateLeavecountTable(category, numDays, selUId);
                     //   updateLeaveStatusCountTable(status,selUId, numberofleave);

                     cf.updateLeavecountTable(category, numDays, selUId);
                     cf.updateLeaveStatusCountTable(status,selUId, numberofleave);
                        getUsers(selectsql, function (result) {
                        res.render("applyleave", { Uname: result });
                        });
                    }
                });
            });
        } else {
            getUsers(selectsql, function (result) {
                res.render("applyleave", { Uname: result });
            });
            
        }
    
};

//----------------- Get Users List ----------------
exports.usersList = function (req, res) {
    var selectQuery = "SELECT * FROM users;";
    db.query(selectQuery, function (err, result) {
        res.send(result);
        console.log(result);
    });
};

//----------------- check user avilable ----------------- 
exports.checkuser = function (req, res) {
    var username = req.body.username;
    var selectQuery = "SELECT * FROM users WHERE user_name='" + username + "';";
    db.query(selectQuery, function (err, result) {
    if (err) {
        console.log(err);
    } else {
        if (result.length > 0) {
            res.send(true);
        } else {
            res.send(false);
        }
    }
    });
}; 

//---------------------------- Check Admin login ------------------
exports.isAdmin = function (req, res) {
    console.log(activeuserName);
    var selectsql = "SELECT * FROM adminSetting;";
    var isadmin;
    if (activeuserName.toUpperCase() == 'ADMIN') {
    //    res.send("1");
        isadmin = 1;
    } else {
      //  res.send("0"); 
        isadmin = 0;
    }
    db.query(selectsql, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            res.send({ result: result, isAdmin: isadmin});
        }
    });
};
