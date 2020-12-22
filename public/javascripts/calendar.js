
$(document).ready(function () {
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    var calendar = $('#calendar').fullCalendar({
        editable: true,
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        events: "/events",
        defaultView: 'month',
        editable: true,
        height: 550,

        eventClick: function (info) {
            var eventId = info.id;    
            $.get("/home/applyleave/edit?lid=" + eventId, function (leave) {
                alert(leave);
                $('#container1').append(leave);
            }); 
        }
  
    });
 
});