exports.checkUserSession = function(req,res,next){
    if(req.session.userId == null){
        throw new appError(401," Your Session is Expired please login back..");
    } else {
        next();
    }
};
