import express from 'express';
import connection from './src/config/connection.js';
import logHelper from './src/helpers/logHelper.js';
import constants from './src/config/constants.js';
import userRouter from './src/routes/user_route.js';
import planRouter from './src/routes/plan_route.js';
import cors from 'cors'
import profitRouter from './src/routes/profit_route.js';
import rewardRouter from './src/routes/reward_route.js';
import teamRouter from './src/routes/team_route.js';
import profileUploadRouter from './src/routes/profile_route.js';
import morgan from 'morgan';
import planModel from './src/models/plan_model.js';
import rewardModel from './src/models/reward_model.js';
import profileModel from './src/models/profile_model.js';
import userModel from './src/models/user_model.js';
import teamModel from './src/models/team_model.js';
const logger = logHelper.getInstance({appName: constants.app_name});
const app = express();
app.use(cors())
app.use(express.json());
app.use(
    express.urlencoded({
      extended: true,
    })
  )
app.use(morgan('dev'));
app.use(express.static('/public'));
app.get('/' , (req, res) => {
    res.send({message:"welcome to home page"})
})

app.use('/user' , userRouter);
app.use('/plan' , planRouter);
app.use('/profit' , profitRouter);
app.use('/reward' , rewardRouter);
app.use('/team' , teamRouter);
app.use('/profile' , profileUploadRouter)
app.delete("/delete" , async (req , res)=>{
    try {
        await teamModel.deleteMany({__v:0})
        //0x7a343ff69ae56cb8bf799dcbedacfe41a1434162
        res.send("delete")
    } catch (error) {
        console.log(error);
    }
})
app.listen(3100 , async () => {
    try {
        await connection
        console.log(JSON.stringify({
            message: 'connection established to database',
            port:3100,
            appName: constants.app_name
        }));
    } catch (error) {
        logger.error({
            message: "error connecting to database",
            errors:error.message,
        })
        throw error;
    }
    console.log(`i am listening on ${3100}`)
})