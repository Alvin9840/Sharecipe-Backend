const { default: mongoose } = require('mongoose');
const { create } = require('./User');

const postSchema = new mongoose.Schema({
    postText: {
        type: String,
        required: true
    },
    createdAt: String,
    imageUrl: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        require: true
    }

});

module.exports = mongoose.model('post', postSchema);