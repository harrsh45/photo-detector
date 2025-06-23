import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
    fileUrl: {
        type: String,
        required: true
    },
    isAIGenerated: {
        type: Boolean,
        default: false
    },
    tags: {
        type: [String],
        default: []
    },
    type: {
        type: String,
        enum: ['image', 'video'],
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
});

const Media = mongoose.model('media', mediaSchema);

export default Media;