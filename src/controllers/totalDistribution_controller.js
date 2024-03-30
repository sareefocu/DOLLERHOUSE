import logHelper from "../helpers/logHelper.js"
import constants from "../config/constants.js"
import planModel from "../models/plan_model.js"
const logger = logHelper.getInstance({ appName: constants.app_name })
const totalDistribution = async ( req , res ) => {
    try {
        let allusers = await planModel.find()
        let sum=0
        for(let i=0 ; i<allusers.length ; i++){
            let singleUserSum = allusers[i].plan_details.reduce((acc , curr) => {
                acc += Number(curr.amount)
                return acc
            },0 )
            sum+=singleUserSum
        }
        res.send({status:"ok" , total_distribution:sum})
    } catch (error) {
        logger.error({
            message: "Not able to find total user distribution",
            errors: error.message
        })
    }
}

export default totalDistribution