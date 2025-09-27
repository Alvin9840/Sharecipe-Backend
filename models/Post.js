const { default: mongoose } = require('mongoose');

const postSchema = new mongoose.Schema({
    postText: {
        type: String,
        required: true
    },
    createdAt: String,
    imageUrl: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId, ref: 'user',
        require: true
    },

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }]
});

module.exports = mongoose.model('post', postSchema);