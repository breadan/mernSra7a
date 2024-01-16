import { userModel } from "../database/models/user.model.js";



var isAdmin = async function(req, res, callback) {
    const user = await userModel.findOne({ 'userId': req.user.user.role }, 'role', function(err, data) {
        if(err) {
            return callback(err, false);
        } else {
            if(data.user.user.role === undefined || data.user.user.role === 'admin') {
                return callback(null, false);
            } else {
                if(data.user.user.role === 'admin') {
                    return callback(null, true);
                }
            }
        }
    });
    };
    export default isAdmin