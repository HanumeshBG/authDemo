var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var routes = require('./routes');
var users = require('./routes/users');
var events = require('./routes/events');
var connection = require("./config");
var session = require('express-session');
const fileUpload = require('express-fileupload');
const path = require('path');
var $ = require('jquery');
var moment = require('moment');

global.db = connection;

//middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(express.static(__dirname + '/public'));// To connect external static files.
app.use(express.static(path.join(__dirname,'public')));// To connect external static files.
app.set("view engine", "ejs");
app.set('views', path.join(__dirname,'/views'));// to access views from outside the root folder
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 600000 }
}));
app.use(fileUpload());

//routes
app.get("/", routes.index);
app.get("/events", events.eventsRender);
app.get("/signup", users.signup);// call for signup page
app.post("/signup", users.signup); //Post call for signup
app.get("/login", routes.index); // Call for login page
app.post("/login", users.login);// call for login page
app.get("/home/dashboard", users.dashboard);//call for dashboard after login
app.get("/home/profile", users.profile);//call for profile page
app.get("/logout", users.logout);//Call for log out
app.get("/home/applyleave", users.applyleave);// Call for leave form
app.post("/home/applyleave", users.applyleave);// Post Call for leave form
app.get("/home/setting", events.adminSetting);//call Admin setting page 
app.post("/home/setting", events.adminSetting);//Post method for admin setting
app.get("/home/leaveDetails", events.leaveDetails);//Get request for leaveDetails page

app.get("/home/users", users.usersList);
app.get("/home/applyleave/edit", events.userEvents);// Get method for edit leaves
app.post("/home/applyleave/edit", events.editLeave);//post method to update leave
app.post("/signup/checkuser", users.checkuser);//check user availablity
app.post("/isAdmin", users.isAdmin); //Check admin login
app.post("/dashboard/leave/status", events.statusList); //Retrieve leaves based on status
app.post("/dashboard/leave/user", events.userLeaveList); //Retrieve leaves based on user
app.post('/home/leave/checkLeaveAvailability', events.checkLeaveAvailability); //check leave availability
app.get('/home/dashboard/loadstatus', events.loadLeaveStatusCount); //To load total leave count based on status.
app.get('/home/dashboard/loaduser', events.loadLeaveUserCount); //To load total leave count based on user.
app.get('/home/applyleave/edit/reject', events.rejectLeave);//reject leave by admin.
app.get('/home/applyleave/edit/delete', events.delete);//delete applied leave.
app.post('/home/dashboard/bulkUpdateLeaves', events.bulkUpdate);//Bulk approve leaves
app.get('/home/leaveDetails/view', events.leaveDetailsView);//Call to leave details of select person
app.post('/home/leaveDetails/onload', events.loadLeavesDetails);// call to load the leave detials for all the users on loading page
app.post('/home/leave/gender', events.getGender);//Call to get gender

app.listen(3010, function (req, res) {
    console.log('Server started..');
});
