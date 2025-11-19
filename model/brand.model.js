const mongoose = require("mongoose")

const brandSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        unique : true,
        minlength : 3,
        maxlength : 50
    },
    slug : {
        type : String,
        required : true,
        unique : true
    }, 
    image : {
        type : String,
        default : null
    },
    status : {
        type : Boolean,
        default : true
    }

},
    {
        timestamps : true
    }
)

module.exports = mongoose.model("Brand", brandSchema)