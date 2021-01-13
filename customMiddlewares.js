module.exports = {
    //-------- Check User session is logged in or not -------
    checkUserSession: function(req,res,next){
        if(req.session.userId == null){
            throw new appError(401," Your Session is Expired please login back..");
        } else {
            next();
        }
    }
}

