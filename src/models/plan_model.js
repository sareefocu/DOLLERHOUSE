import mongoose from "mongoose";
let planSchema = mongoose.Schema({
    wallet_id: { type: String, required: true },
    user_id: { type: String, required: true },
    refferal: { type: String, required: true },
    plan_details: { type: Array, default: [] }
},
    {
        timestamps: true,
    }
);


let planModel = mongoose.model("plan_buyed", planSchema);


planSchema.pre('save', function (next) {
    this.plan_details.forEach(detail => {
        if (!detail.amount) {
            return next(new Error('Amount is required.'));
        }
        // Calculate subamount based on amount
        switch (detail.amount) {
            case 20:
                detail.subamount = 5;
                break;
            case 40:
                detail.subamount = 10;
                break;
            case 100:
                detail.subamount = 30;
                break;
            case 200:
                detail.subamount = 60;
                break;
            case 500:
                detail.subamount = 120;
                break;
            case 1000:
                detail.subamount = 250;
                break;
            case 2000:
                detail.subamount = 500;
                break;
            case 4000:
                detail.subamount = 1000;
                break;
            default:
                detail.subamount = 0;
                break;
        }
    });
    next();
});

export default planModel;