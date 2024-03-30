import mongoose from "mongoose";

const RefSchema4 = new mongoose.Schema({
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

const ref500 = mongoose.model('ref500', RefSchema4);
export default ref500;