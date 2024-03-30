import mongoose from "mongoose";

const RefSchema6 = new mongoose.Schema({
    refId: String,
    mainId: String,
    supporterId: String,
    misseduser: String,
    leval: {
        type: Number,
        default: 0,
    },
    setleval: {
        type: Number,
        default: 0,
    },
    uid: Number,
    referred: {
        type: [String],
        default: [],
    },
    nextRefIndex: {
        type: Number,
        default: 0,
    },
    missedusers: [{
        uid: Number,
        refId: String,
        mainId: String,
        supporterId: String,
        depthleval: Number,
        status: String,
        createdAt: Date
    }],
    nextRefIdsToBeSkipped: {
        type: [String],
        default: [],
    },
}, {
    timestamps: true,
});

const ref2000 = mongoose.model('ref2000', RefSchema6);
export default ref2000;