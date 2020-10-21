var numDays;
var oneday = 24 * 60 * 60 * 1000;

var totalLeaveCounts = {
    totalSickLeave: 0,
    totalCasualLeave: 0,
    totalPersonalLeave: 0,
    totalOtherLeave: 0,
    totalLeave: 21,
    cfSickLeave: 0,
    cfCasualLeave: 0,
    cfPersonalLeave: 0,
    cfOtherLeave: 0,
    totalMaternityLeave: 0,

    set totalSickLeave1(totalSickLeave) {
        this.totalSickLeave = totalSickLeave;
    },

    get totalSickLeave1() {
        return this.totalSickLeave;
    },

    set totalCasualLeave1(totalCasualLeave) {
        this.totalCasualLeave = totalCasualLeave;
    },

    get totalCasualLeave1() {
        return this.totalCasualLeave;
    },

    set totalPersonalLeave1(totalPersonalLeave) {
        this.totalPersonalLeave = totalPersonalLeave;
    },

    get totalPersonalLeave1() {
        return this.totalPersonalLeave;
    },

    set totalOtherLeave1(totalOtherLeave) {
        this.totalOtherLeave = totalOtherLeave;
    },

    get totalOtherLeave1() {
        return this.totalOtherLeave;
    },

    set cfSickLeave1(cfSickLeave) {
        this.cfSickLeave = cfSickLeave;
    },

    get cfSickLeave1() {
        return this.cfSickLeave;
    },

    set cfCasualLeave1(cfCasualLeave) {
        this.cfCasualLeave = cfCasualLeave;
    },

    get cfCasualLeave1() {
        return this.cfCasualLeave;
    },

    set cfPersonalLeave1(cfPersonalLeave) {
        this.cfPersonalLeave = cfPersonalLeave;
    },

    get cfPersonalLeave1() {
        return this.cfPersonalLeave;
    },

    set cfOtherLeave1(cfOtherLeave) {
        this.cfOtherLeave = cfOtherLeave;
    },

    get cfOtherLeave1() {
        return this.cfOtherLeave;
    },

    set totalMaternityLeave1(totalMaternityLeave) {
        this.totalMaternityLeave = totalMaternityLeave;
    },

    get totalMaternityLeave1() {
        return this.totalMaternityLeave;
    }
};

var leaveCounts = {
    sick: 0,
    casual: 0,
    personal: 0,
    other: 0,
    total: 0,
    set sick1(sick) {
        this.sick = sick;
    },

    get sick1() {
        return this.sick;
    },
    set casual1(casual) {
        this.casual = casual;
    },

    get casual1() {
        return this.casual;
    },
    set personal1(personal) {
        this.personal = personal;
    },

    get personal1() {
        return this.personal;
    },
    set other1(other) {
        this.other = other;
    },

    get other1() {
        return this.other;
    },
    set total1(total) {
        this.total = total;
    },
    get total1() {
        return this.total;
    }
};
$(document).ready(function () {
    
    checkAdmin(function () {
        //on load dashboard
        $('#dashboard').each(onloadDashboard);

        //on load functions of edit leave
        $('.edit-leave').each(user_handler);

        //on load adminSetting
        $('#adminSetting').each(setvalue);

        //on load of profile page
        $('#userProfile').each(userProfile);  
     
    });

    //on load of leave details page
    $('#leaveDetails').each(usersleavedetails);

    //on load of leave details person page
    $('#leaveDetailsPerson').each(leavedetailview);

    //selectng id from dropdown based on Name selected in apply leave page
    $('#sel1').on('change', function () {
        var selectval = $('option:selected', this).attr('id');
        $('#selectedUser').val(selectval);
        hideShowMaternity(selectval);
    });

    //on change function for category
    $('#l_category').on('change', function () {
        if ($("#l_category input[type = 'radio']:checked").val() == 'maternity') {
            $('#spanForMaternityDays').text(totalLeaveCounts.totalMaternityLeave);
            $('#divForMaternityLabel').show();
            $('#l_files').attr('required', '');
            addDaysToEndDate();
        } else {
            $('#l_files').removeAttr('required');
            $('#divForMaternityLabel').hide();
        }
    }); 

    //adding no of days automatically to end date if maternity category selected
    $('#startdate').on('change', function () {
        var selectedCategory = $("#l_category input[type = 'radio']:checked").val();
 
        if (selectedCategory == 'maternity') {
            addDaysToEndDate();        
        }
    });
    // Function to add number of days to end date on selcting maternity category
    function addDaysToEndDate() {
        var startDate = $('#startdate').val();
        var noDaysInseconds = oneday * (totalLeaveCounts.totalMaternityLeave - 1);
        var newEndDate = new Date(Date.parse(startDate) + noDaysInseconds);
        var edate = convertDate(newEndDate);
        $("#enddate").val(edate);

    };

    //validating from and to date
    $('#enddate').on('change', function () {
        var startDate = $('#startdate').val();
        var endDate = $('#enddate').val();
        numDays = Math.round(Math.abs((new Date(startDate) - new Date(endDate)) / oneday)) + 1;

        if (startDate == "") {
            alert("Please enter start date first");
            $('#enddate').val("");
        }
        else if (Date.parse(startDate) > Date.parse(endDate)) {
            alert("End date should be greater than or equal to start date");
            $('#enddate').val("");
        } else {
            var selectedUser = $('#selectedUser').val();
            var selectedCategory = $("#l_category input[type = 'radio']:checked").val();
            var leaveCount = {
                selectedUser: selectedUser,
                selectedCategory: selectedCategory
            };
            if (selectedCategory == 'maternity') {
                if (numDays > totalLeaveCounts.totalMaternityLeave) {
                    alert('Applied leave must be less than or equal to ' + totalLeaveCounts.totalMaternityLeave + ' days');
                    addDaysToEndDate();
                }
            } else {
                $.post('/home/leave/checkLeaveAvailability', leaveCount, function (data) {
                    leaveCounts.sick = data[0].sick;
                    leaveCounts.casual = data[0].casual;
                    leaveCounts.persoal = data[0].personal;
                    leaveCounts.other = data[0].other;
                    leaveCounts.total = data[0].total;
                });
            }
        }
    });

    //user validation against db
    $('#user_name').on('change', function () {
        var userName = $('#user_name').val();
        $.post('/signup/checkuser', { username: userName }, function (data) {
            if (data == true) {
                $('#userVerification').html("User name already exists.");
                $('#userVerification').addClass('userexit');
                $('#user_name').val("");
            } else {
                $('#userVerification').html("User name is available.");
                $('#userVerification').addClass('useravilable');
            };
        });

    });

    //Generate dynamic leave table based on status clicked
    $('#statusList li').on('click', function () {
        $('#dashboard_searchOptions').css('display', 'block');
        $('#main_searchStatus').css('display', 'none');
        $('#main_searchUser').css('display', 'inline');
        var statusId = $(this).attr('id');
        var data1 = $('#adminValue').val();
        if (statusId == 'appliedLeaves' && data1 == 1) {
            $('#bulkUpdateStatus').css('display', 'block');
        } else {
            $('#bulkUpdateStatus').css('display', 'none');
        }
        $.post("/dashboard/leave/status", { statusId: statusId }, function (data) {
            dynamicLeaveTable(data); 
        }); 
    });

    //Generate dynamic leave table based on user clicked
    $('#usersList li').on('click', function () {
        $('#dashboard_searchOptions').css('display', 'block');
        $('#bulkUpdateStatus').css('display', 'none');
        $('#main_searchUser').css('display', 'none');
        $('#main_searchStatus').css('display', 'inline');
        var userId = $(this).attr('id');
        $.post("/dashboard/leave/user", { userId: userId }, function (data) {
            dynamicLeaveTable(data);
        });
    });

    //check number of leaves available before submit form
    //on applying leave
    $('#leaveForm').on('submit', function () {

        var selectedCategory = $("#l_category input[type = 'radio']:checked").val();
        var Cstatus;
        if (selectedCategory == 'sick') {
            Cstatus = displayPrompt(selectedCategory, leaveCounts.sick, totalLeaveCounts.totalSickLeave, leaveCounts.total);
        } else if (selectedCategory == 'casual') {
            Cstatus = displayPrompt(selectedCategory, leaveCounts.casual, totalLeaveCounts.totalCasualLeave, leaveCounts.total);
        } else if (selectedCategory == 'personal') {
            Cstatus = displayPrompt(selectedCategory, leaveCounts.personal, totalLeaveCounts.totalPersonalLeave, leaveCounts.total);
        } else if (selectedCategory == 'other'){
            Cstatus = displayPrompt(selectedCategory, leaveCounts.other, totalLeaveCounts.totalOtherLeave, leaveCounts.total);
        } else {
            Cstatus = true;
        }
        return Cstatus;
    });

    //on editing leave
    $('#editLeaveForm').on('submit', function () {
        
        var selectedCategory = $("#l_category input[type = 'radio']:checked").val();
        var selectedStatus = $("#l_status input[type = 'radio']:checked").val();
        var Cstatus;
        if (selectedCategory == 'sick') {
            Cstatus = displayPrompt(selectedCategory, leaveCounts.sick, totalLeaveCounts.totalSickLeave, leaveCounts.total);
        } else if (selectedCategory == 'casual') {
            Cstatus = displayPrompt(selectedCategory, leaveCounts.casual, totalLeaveCounts.totalCasualLeave, leaveCounts.total);
        } else if (selectedCategory == 'personal') {
            Cstatus = displayPrompt(selectedCategory, leaveCounts.personal, totalLeaveCounts.totalPersonalLeave, leaveCounts.total);
        } else if (selectedCategory == 'other') {
            Cstatus = displayPrompt(selectedCategory, leaveCounts.other, totalLeaveCounts.totalOtherLeave, leaveCounts.total);
        } else {
            Cstatus = true;
        }
        if (selectedStatus == 'rejected') {
            $.get('/home/applyleave/edit/reject', function () {
                alert("Leave Reject successfully..");
            });
        } 
        return Cstatus;
    });

    //select multiple checkbox at time
    $(document).on('click', '.selectAll', function () {
        var table = $(this).closest('table');
        table.find(':checkbox').not(this).prop('checked', this.checked);
    });

    //Update leave from dashboard(Bulk)
    $('.bulkUpdateStatus').on('click', function () {
        var status = $(this).val();
        var selectedApprovalLeave = [];
        $.each($("input[type='checkbox'][name='leave']:checked"), function () {
            selectedApprovalLeave.push($(this).val());
        });
        
        if (selectedApprovalLeave.length <= 0) {
            alert("Please select atleast one item from the list.")
        } else {
            selectedApprovalLeave = JSON.stringify(selectedApprovalLeave);
            var selCheck = { ApprovalLeave: selectedApprovalLeave, status:status };
            $.post('/home/dashboard/bulkUpdateLeaves', selCheck , function (data) {
                alert(data)
            }); 
        }
    });

    //Search function for the table based on user
    $('#userSearchInput').on('keyup', function () {
 //      searchTable($(this));
        multisearch();
   });

    //search function for the table based on status
    $('#statusSearchInput').on('change', function () {
        multisearch();
    });

    //search function for the table based on category
    $('#categorySearchInput').on('change', function () {
        multisearch();
    });

    //search function for the table based on from and to date
    $('.searchDate').on('change', function () {
        multisearch();
    });

    //image preview
    var fileTypes = ['jpg', 'jpeg', 'png'];  //acceptable file types
    $("input:file").change(function (evt) {
        var parentEl = $("#displayArea");
        var tgt = evt.target || window.event.srcElement,
            files = tgt.files;

        // FileReader support
        if (FileReader && files && files.length) {
            var fr = new FileReader();
            var extension = files[0].name.split('.').pop().toLowerCase();
            fr.onload = function (e) {
                success = fileTypes.indexOf(extension) > -1;
                if (success)
                    $(parentEl).append('<img src="' + fr.result + '" class="preview"/>');
            }
            fr.onloadend = function (e) {
                console.debug("Load End");
            }
            fr.readAsDataURL(files[0]);
        }
    });

 });


    //Remove and add attrubute based on value on loading the page
var user_handler = function () {
    hideOrShowOptions();
    var data1 = $('#adminValue').val();
    var selectval = $('#userid').attr('data-test-value');
        //Add and remove radio button
        $("input[type='radio']").removeAttr("checked");
        var Cvalue = $('#l_c').attr('data-test-value');
        $("input[type='radio'][value='" + Cvalue + "']").attr('checked', true);
        var Svalue = $('#l_s').attr('data-test-value');
        $("input[type='radio'][value='" + Svalue + "']").attr('checked', true);

        //Load start date
        var sdate = $('#l_s_d').attr('data-test-value');
        var date1 = convertDate(sdate);
        $("#startdate").attr('value', date1);
        // $("#startdate").val(date);

        //Load end date
    var edate = $('#l_e_d').attr('data-test-value');
        var date2 = convertDate(edate);
        $("#enddate").attr('value', date2);
            if (data1 == 1) {
                $('#rejected').removeAttr('disabled');
                $('#approved').removeAttr('disabled');
            }
    //Load file
    var file = $('#l_l_files').attr('data-test-value');
    $('#l_files').val(file);

        //make all li element disable
        $("#l_category input[type = 'radio']").prop('disabled', true);
        $("input[type='radio'][value='" + Cvalue + "']").prop('disabled', false);

        // Check status is approved or rejected to hide update button
        if (Svalue == 'rejected' || Svalue == 'approved') {
            $('#leaveUpdateBtn').hide();
            $('#leaveDeleteBtn').hide();
        }

    //Hide or show Maternity category based on gender
    hideShowMaternity(selectval);

    };

    //Convert date format
    function convertDate(str) {
        var date = new Date(str),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
    };

    //check admin login 
  function checkAdmin(callback) {
      $.post('/isAdmin', function (data) {
          totalLeaveCounts.totalSickLeave = data.result[0].tslcount;
          totalLeaveCounts.totalCasualLeave = data.result[0].tclcount;
          totalLeaveCounts.totalPersonalLeave = data.result[0].tplcount;
          totalLeaveCounts.totalOtherLeave = data.result[0].tolcount;
          totalLeaveCounts.cfSickLeave = data.result[0].cfslcount;
          totalLeaveCounts.cfCasualLeave = data.result[0].cfclcount;
          totalLeaveCounts.cfPersonalLeave = data.result[0].cfplcount;
          totalLeaveCounts.cfOtherLeave = data.result[0].cfolcount;
          totalLeaveCounts.totalMaternityLeave = data.result[0].maternitycount;
          $('#adminValue').val(data.isAdmin);
          return callback();    
        });
}; 

//hide or show  header options based on login type(admin or user)
function hideOrShowOptions() {
    var data1 = $('#adminValue').val();
    if (data1 == 1) {
        $('#homeSettingBtn').css('display', 'block');
        $('#homeApplyLeaveBtn').css('display', 'none');
        $('#homeProfileLeaveBtn').css('display', 'none');
    } 
};

//creating dynamic table
function dynamicLeaveTable(data) {
    var table = "<table id='leaveTable' class='dynamicTable'><thead><tr><th><input type='checkbox' class='selectAll'></th><th>Full Name</th><th>Reason</th><th>Date From</th><th>Date To</th><th>Status</th><th>Category</th><th></th></tr></thead><tbody id='leaveTableBody'>";
    for (var i = 0; i < data.length; i++) {
        var start_date = convertDate(data[i].start_date);
        var end_date = convertDate(data[i].end_date);
        table += "<tr><td><input type='checkbox' name='leave' value='" + data[i].lid + "'></td><td class='name' data-name='" + data[i].full_name + "'>" + data[i].full_name + "</td><td>" + data[i].holiday_reason + "</td> <td>" + start_date + "</td> <td>" + end_date + "</td> <td class='status' data-status='" + data[i].status + "'>" + data[i].status + "</td> <td class='category' data-category='" + data[i].category +"'>" + data[i].category + "</td> <td><a href='/home/applyleave/edit?lid="+ data[i].lid + "'> Edit </a></td></tr >"; 
    }
    table += "</tbody></table>";
    $("#calendar").html(table); 
};

//display the message prompt based on leave available
function displayPrompt(category, appliedLeaveCount, availableLeave, total) {
    
    if ((appliedLeaveCount + numDays) > availableLeave || total > totalLeaveCounts.totalLeave) {
        if (!confirm("You have applied more than " + availableLeave + " " + category + " leaves. would you countinue to apply?. If yes you will under go loss of pay.")) {
           return false;
        }
    }
    return true;
}; 

var onloadDashboard = function () {
    hideOrShowOptions();
  //call to get total leavecounts for status
    $.get('/home/dashboard/loadstatus', function (data) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].status == 'applied') {
                $('#appliedLeavesCount').text(data[i].count);
            } else if (data[i].status == 'approved') {
                $('#approvedLeavesCount').text(data[i].count);
            } else {
                $('#rejectedLeavesCount').text(data[i].count);
            }
        }
    });

    //call to get total leavecounts for users
    $.get('/home/dashboard/loaduser', function (data) {
        for (var i = 0; i < data.length; i++) {
            $('#userTotalLeaveCount' + data[i].id).text(data[i].total);
        }
    });
};

//on load function for admin setting
var setvalue = function () {
    hideOrShowOptions();
    $('#tsickcount input').val(totalLeaveCounts.totalSickLeave);
    $('#cfsickcount input').val(totalLeaveCounts.cfSickLeave);
    $('#tcasualcount input').val(totalLeaveCounts.totalCasualLeave);
    $('#cfcasualcount input').val(totalLeaveCounts.cfCasualLeave);
    $('#tpersonalcount input').val(totalLeaveCounts.totalPersonalLeave);
    $('#cfpersonalcount input').val(totalLeaveCounts.cfPersonalLeave);
    $('#tothercount input').val(totalLeaveCounts.totalOtherLeave);
    $('#cfothercount input').val(totalLeaveCounts.cfOtherLeave);
    $('#tmaternitycount input').val(totalLeaveCounts.totalMaternityLeave);
};

//on load function for leave details page
var usersleavedetails = function () {
    $.post("/home/leaveDetails/onload", function (data1) {
        dynamicLeaveTable1(data1);
    });
};

//Dynamic table generation function for leavedetails
function dynamicLeaveTable1(data1) {
    var table = "<table id='leaveDetailsTable' class='dynamicTable'><thead><tr><th>Name</th><th>Total Applied Leave</th><th>Total Approved Leave</th><th>Total Rejected Leave</th><th></th></tr></thead><tbody id='leaveDetailsTableBody'>";
    for (var i = 0; i < data1.length; i++) {
        table += "<tr><td>" + data1[i].first_name + ' ' + data1[i].last_name + "</td><td>" + data1[i].appliedleavecount + "</td> <td>" + data1[i].approvedleavecount + "</td> <td>" + data1[i].rejectedleavecount + "</td> <td><a href='/home/leaveDetails/view?id=" + data1[i].id + "'> View </a></td></tr >";
    }
    table += "</tbody></table>";
    $("#leavesDetailsTableDiv").html(table);
};

//on load function for leave detail person page
var leavedetailview = function () {
    checkAdmin(function () {
        $('#tnl').text(totalLeaveCounts.totalLeave);
        $('#tncfl').text(totalLeaveCounts.cfCasualLeave + totalLeaveCounts.cfSickLeave + totalLeaveCounts.cfPersonalLeave + totalLeaveCounts.cfOtherLeave);
        $('#tcl').text(totalLeaveCounts.totalCasualLeave);
        $('#tsl').text(totalLeaveCounts.totalSickLeave);
        $('#tpl').text(totalLeaveCounts.totalPersonalLeave);
        $('#tol').text(totalLeaveCounts.totalOtherLeave);
        $('#rcl').text(subtractLeave(totalLeaveCounts.totalCasualLeave, $('#tacl').text()));
        $('#rsl').text(subtractLeave(totalLeaveCounts.totalSickLeave, $('#tasl').text()));
        $('#rpl').text(subtractLeave(totalLeaveCounts.totalPersonalLeave, $('#tapl').text()));
        $('#rol').text(subtractLeave(totalLeaveCounts.totalOtherLeave, $('#taol').text()));
    });
};

//  Calculation for Remaining leave
function subtractLeave(a, b) {
    return a - b;
};

//Function to hide or show maternity option based on gender
function hideShowMaternity(selectval) {
    $.post('/home/leave/gender', { userid: selectval }, function (data) {
        if (data[0].gender == 'Male') {
            $('#li_maternity').hide();
        } else {
            $('#li_maternity').show();
        }
    });
};

//Search function for table
/* function searchTable(id) {
    var input = id.val().toLowerCase();
    $("#leaveTableBody tr").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(input) > -1)
    });
}; */

// function for multiple search
function multisearch() {
    $('#leaveTableBody tr').hide(); //hide all rows
    var uNameFlag = 0;
    var uNameValue = $('#userSearchInput').val();
    var statusFlag = 0;
    var statusValue = $('#statusSearchInput').val();
    var categoryFlag = 0;
    var categoryValue = $('#categorySearchInput').val();
    var dateFlag = 0;
    var sdateArray = $('#startdateSearch').val();
    var sdateValue = new Date(sdateArray);
    var edateArray = $('#enddateSearch').val();
    var edateValue = new Date(edateArray);

    if (Date.parse(sdateArray) > Date.parse(edateArray)) {
        alert("To date should be greater than or equal to From date");
        $('#enddateSearch').val("");
    }

    $('#leaveTableBody tr').each(function () {
        var date = new Date($(this).find('td:eq(3)').text());

        if (uNameValue == '') {   //if no value then display row
            uNameFlag = 1;
        }
        else if ($(this).find('td.name').text().toLowerCase().indexOf(uNameValue) > -1) {
            uNameFlag = 1;       //if value is same display row
        }
        else {
            uNameFlag = 0;
        }
        if (statusValue == '') {
            statusFlag = 1;
        }
        else if (statusValue == $(this).find('td.status').data('status')) {
            statusFlag = 1;
        }
        else {
            statusFlag = 0;
        }
        if (categoryValue == '') {
            categoryFlag = 1;
        }
        else if (categoryValue == $(this).find('td.category').data('category')) {
            categoryFlag = 1;
        }
        else {
            categoryFlag = 0;
        }
        if (sdateValue == '' || edateValue == '' || isNaN(sdateValue) || isNaN(edateValue)) {
            dateFlag = 1;
        }
        else if (sdateValue <= date && date <= edateValue) {
            dateFlag = 1;
        } else {
            dateFlag = 0;
        }

        if (uNameFlag && statusFlag && categoryFlag && dateFlag) {
            $(this).show();  //displaying row which satisfies all conditions
        }
    });
};

