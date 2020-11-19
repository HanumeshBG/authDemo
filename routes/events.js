var eventId;
var numberDays;
var selUId;
var category;
//var status;
var numberofleave = 1;
exports.eventsRender = function (req, res) {

    var events = [];
    var sql = "SELECT * FROM leaves";
    db.query(sql, function (err, data) {
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                var temp = {
                    id: data[i].lid,
                    title: data[i].holiday_reason,
                    start: new Date(data[i].start_date).toLocaleString(),
                    end: new Date((data[i].end_date).getTime() + (1 * 24 * 60 * 60 * 1000)).toLocaleString(),
                    allDay: true 
                }
                events.push(temp);
            }
            res.send(events);
        } else {
            console.log("No events")
        }
    });

};

//----------------- Get Leave details --------------
exports.userEvents = function (req, res) {
    eventId = req.query.lid;
    
        var sql = "SELECT * FROM leaves WHERE lid ='" + eventId +"';";
        db.query(sql, function (err, results) {
            if (err) {
                console.log(err);
            } else {
                numberDays = results[0].number_days;
                selUId = results[0].id;
                category = results[0].category;
               // status = result[0].status;
                res.render('editleave', { leave: results });
            }
        });
};

//------------------------- Update Leave --------------------
exports.editLeave = function (req, res) {
     var eventId = req.query.lid;
     var selUId = req.body.selectedUser;
     var status = req.body.l_status;
     var category = req.body.l_category;
     var sdate = req.body.l_sdate;
     var edate = req.body.l_edate;
     var file = req.body.files;
     var oneday = 24 * 60 * 60 * 1000;
     var numDays = Math.round(Math.abs((new Date(sdate) - new Date(edate)) / oneday)) + 1;
     var selectsql = "SELECT * FROM users;";
     var selectQueryNumDays = "SELECT number_days FROM leaves WHERE lid ='" + eventId + "';";
     
    //Calculate days difference function
    function calculateDaysDiff(sql, callback) {
        db.query(sql, function (err, result2) {
            if (err) {
                console.log(err);
            } else {
                return callback(numDays - result2[0].number_days);
            }
        });
    };
    
     // function to get users lists
     function getUsers(sql, callback) {
         db.query(sql, function (err, result) {
             return callback(result);
         });
    }; 

        calculateDaysDiff(selectQueryNumDays, function (result3) {
            var daysDiff = result3;
            var leaveDetails = {
                status: status,
                category: category,
                start_date: sdate,
                end_date: edate,
                full_name: req.body.full_name,
                holiday_reason: req.body.l_reason,
                description: req.body.l_description,
                number_days: numDays,
                files:file
            }

            var sql = "UPDATE leaves SET ? WHERE lid ='" + eventId + "';";

            db.query(sql, leaveDetails, function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Leave updated successfully")
                    updateLeavecountTable(category, daysDiff, selUId);
                    if (status != 'applied') {
                        updateLeaveStatusCountTable(status, selUId, numberofleave);
                    }
                    getUsers(selectsql, function (result1) {
                        res.render('applyleave', { Uname: result1 });
                    });
                }
            });
        })
}; 
//-------------------- Delete leave ------------------------------
exports.delete = function (req, res) {
    var status = 'applied';
    var selectquery = "DELETE FROM leaves WHERE lid='" + eventId + "';";
    db.query(selectquery, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            updateLeavecountTable(category, -(numberDays), selUId);
            updateLeaveStatusCountTable(status, selUId, -(numberofleave));
            res.redirect("/home/dashboard");
        }

    });
};

//------------------- Retrieve leave based on status --------------
exports.statusList = function (req, res) {
    var status;
    var statusId = req.body.statusId;
    if (statusId == 'appliedLeaves') {
        status = 'applied';
    } else if (statusId == 'approvedLeaves') {
        status = 'approved';
    } else {
        status = 'rejected';
    }
    
    var sql = "SELECT * FROM leaves WHERE status= '" + status + "';";
    db.query(sql, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
};

//------------------- Retrieve leave based on user clicked --------------
exports.userLeaveList = function (req, res) {
    var userId = req.body.userId;
    var sql = "SELECT * FROM leaves WHERE id = '" + userId + "';";
    db.query(sql, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
};

//----------------------- Retive leave counts ----------------
exports.checkLeaveAvailability = function (req, res) {
    var selectedUser = req.body.selectedUser;
   
    var sql = "SELECT * FROM leavecounts WHERE uid = '" + selectedUser + "'; ";
    db.query(sql, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    }); 
};

//----------------------- Retive leave counts based on status----------------
exports.loadLeaveStatusCount = function (req, res) {

    var sqlquery = "SELECT COUNT(id) as count, status FROM leaves GROUP BY status";
    db.query(sqlquery, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
};

//----------------------- Retive leave counts basd on user----------------
exports.loadLeaveUserCount = function (req, res) {
  
    var sqlquery = "SELECT id,count(id) AS total FROM leaves GROUP BY id;";
    db.query(sqlquery, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
};

//----------------Reject leave by admin ---------------------
exports.rejectLeave = function (req, res) {
    updateLeavecountTable(category, -(numberDays), selUId);  
};

//--------------- Bulk approve leaves ------------------------
exports.bulkUpdate = function (req, res) {
    var lid = req.body.ApprovalLeave;
    var status = req.body.status;
    lid = JSON.parse(lid);
    var sqlQuery = "UPDATE leaves SET status = '" + status + "' WHERE lid IN (" + lid + ");";
    db.query(sqlQuery, lid, function (err, result) {
        if (err) {
            console.log(err);
        } else {
          
                var squery = "SELECT id, number_days,category FROM leaves WHERE lid IN (" + lid + ");";
                db.query(squery, function (err, result1) {
                    if (err) {
                        console.log(err);
                    } else {
                        for (var i = 0; i < result1.length; i++) {
                            updateLeaveStatusCountTable(status, result1[i].id, numberofleave);
                            if (status == 'rejected') {
                                updateLeavecountTable(result1[i].category, -(result1[i].number_days), result1[i].id);
                            }
                        }
                        res.send("Leaves "+ status + " successfully..");
                    }
                });
        }
    });
};

//--------------------------------- Admin Setting page -------------------
exports.adminSetting = function (req, res) {
        if (req.method == 'POST') {
            var setting = {
                tslcount: req.body.tsickcount,
                cfslcount: req.body.cfsickcount,
                tclcount: req.body.tcasualcount,
                cfclcount: req.body.cfcasualcount,
                tplcount: req.body.tpersonalcount,
                cfplcount: req.body.cfpersonalcount,
                tolcount: req.body.tothercount,
                cfolcount: req.body.cfothercount,
                maternitycount: req.body.tmaternitycount
            };
            var sqlquery = "UPDATE adminSetting SET ? ;";
            db.query(sqlquery, setting, function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Admin Settings updated sucessfully...");
                    res.render('adminSetting');
                }
            });
        } else {
            res.render("adminSetting");
        }
};

//------------------------- Get values from the admin settings ---------------
exports.getValues = function (req, res) {
    var selquery = "SELECT * FROM adminSetting";
    db.query(selquery, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
};

//--------------------------- Retrieve leave Details page ------------------
exports.leaveDetails = function (req, res) {
        var selquery = "SELECT * FROM adminsetting";
        db.query(selquery, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                res.render("leaveDetails", { leaveCountDetails:result });
            }
        });
};

//------------------------ Retrieve Leave details for all users --------------
exports.loadLeavesDetails = function (req, res) {
    var selquery = "SELECT a.id,a.first_name,a.last_name,b.appliedleavecount,b.approvedleavecount,b.rejectedleavecount FROM users a inner join leavestatuscount b on a.id=b.id";
    db.query(selquery, function (err, result) {
        if (err) {
            console.log(err);
        } else {
           res.send(result)
        }
    });
};

//----------------------- Retrieve Leave Details of Clicked(Selected) person -------------
exports.leaveDetailsView = function (req, res) {
    var selectedUser = req.query.id;
   
        var sql = "SELECT * FROM leavecounts WHERE uid ='" + selectedUser + "';";
        db.query(sql, function (err, results) {
            if (err) {
                console.log(err);
            } else {
                res.render('leaveDetailsPerson', { leavedetailforuser: results });
            }
        });
}

//-------------------- Retrieve gender  -------------------
exports.getGender = function (req, res) {
    var selectedUser = req.body.userid;
        var sql = "SELECT * FROM users WHERE id ='" + selectedUser + "';";
        db.query(sql, function (err, results) {
            if (err) {
                console.log(err);
            } else {
                res.send(results);
            }
        });
}

//-------------- update leaveCounts table -------------------
function updateLeavecountTable(category, numDays, selUId) {
    var selectQuery = "SELECT total," + category + " FROM leavecounts WHERE uid ='" + selUId + "';";
    db.query(selectQuery, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            var leavecount = 0;
            var totalcount = 0;
            if (category == 'sick') {
                leavecount = result[0].sick + numDays;
            } else if (category == 'casual') {
                leavecount = result[0].casual + numDays;
            } else if (category == 'personal') {
                leavecount = result[0].personal + numDays;
            } else if (category == 'other') {
                leavecount = result[0].other + numDays;
            } else {
                leavecount = result[0].maternity + numDays;
            }

            if (category == 'maternity') {
                totalcount = result[0].total;
            } else {
                totalcount = result[0].total + numDays;
            }

            var selectQuery1 = "UPDATE leavecounts SET " + category + "='" + leavecount + "', total ='" + totalcount + "' WHERE uid ='" + selUId + "';";
            db.query(selectQuery1, function (err, result1) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Leavecounts database updated successfully.")
                }
            });
        }
    });
};

//------------------------------- Update leavestatuscount Table -------------
function updateLeaveStatusCountTable(status, selUId, numberofleave) {
    var selectQuery = "SELECT * FROM leavestatuscount WHERE id ='" + selUId + "';";
    db.query(selectQuery, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            var statuscount;
            var statusname;
            if (status == 'applied') {
                statuscount = result[0].appliedleavecount + numberofleave;
                statusname = 'appliedleavecount';
            } else if(status == 'approved') {
                statuscount = result[0].approvedleavecount + numberofleave;
                statusname = 'approvedleavecount';
            } else {
                statuscount = result[0].rejectedleavecount + numberofleave;
                statusname = 'rejectedleavecount';
            }
            var selectQuery1 = "UPDATE leavestatuscount SET "+ statusname +"='" + statuscount + "' WHERE id ='" + selUId + "';";
            db.query(selectQuery1, function (err, result1) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("LeaveStatuscount database updated successfully.")
                }
            });
        }
    });
};
