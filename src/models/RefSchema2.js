import mongoose from "mongoose";

const RefSchema2 = new mongoose.Schema({
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

const ref100 = mongoose.model('ref100', RefSchema2);
export default ref100;