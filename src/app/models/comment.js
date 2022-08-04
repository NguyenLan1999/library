const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Comment = new Schema({
    content: {type: String},
   
    UserId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    }
    ,{
        timestamps: true,
    }
    )



module.exports = mongoose.model('Comment', Comment);