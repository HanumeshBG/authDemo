module.exports = {
    //------------------------------- Update leavecounts Table -------------
    updateLeavecountTable : function (category, numDays, selUId) {
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
    },
    
    //------------------------------- Update leavestatuscount Table -------------
    updateLeaveStatusCountTable: function (status, selUId, numberofleave) {
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
                } else if (status == 'approved') {
                    statuscount = result[0].approvedleavecount + numberofleave;
                    statusname = 'approvedleavecount';
                } else {
                    statuscount = result[0].rejectedleavecount + numberofleave;
                    statusname = 'rejectedleavecount';
                }
                var selectQuery1 = "UPDATE leavestatuscount SET " + statusname + "='" + statuscount + "' WHERE id ='" + selUId + "';";
                db.query(selectQuery1, function (err, result1) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("LeaveStatuscount database updated successfully.")
                    }
                });
            }
        });
    }
    
}