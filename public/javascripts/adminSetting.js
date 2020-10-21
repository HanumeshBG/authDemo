 $(document).ready(function () {
    

    //sick leave validation
    $('#cfsickcount input').on('change', function () {
        var tslcount = $('#tsickcount input').val();
        var cfslcount = $('#cfsickcount input').val();
        var id = $('#cfsickcount input');
        checkCflGreaterThanTl(tslcount, cfslcount, id);
    });

    // Casual leave validation
    $('#cfcasualcount input').on('change', function () {
        var tclcount = $('#tcasualcount input').val();
        var cfclcount = $('#cfcasualcount input').val();
        var id = $('#cfcasualcount input');
        checkCflGreaterThanTl(tclcount, cfclcount, id);
    });

    //personal leave validation
    $('#cfpersonalcount input').on('change', function () {
        var tplcount = $('#tpersonalcount input').val();
        var cfplcount = $('#cfpersonalcount input').val();
        var id = $('#cfpersonalcount input');
        checkCflGreaterThanTl(tplcount, cfplcount, id);
    });

    //Other leave validation
    $('#cfothercount input').on('change', function () {
        var tolcount = $('#tothercount input').val();
        var cfolcount = $('#cfothercount input').val();
        var id = $('#cfothercount input');
        checkCflGreaterThanTl(tolcount, cfolcount, id);
    });

    // Check Carryfarword leave count is lesser than total leave count
    function checkCflGreaterThanTl(tcount, cfcount, id) {
        if (tcount < cfcount) {
            alert("Carry forward leaves count should be less than total leave count.");
            $(id).val("");
        }
    };

});

