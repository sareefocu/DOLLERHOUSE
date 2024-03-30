import mongoose from "mongoose";
import constants from "./constants.js";

const connection = mongoose.connect(constants.connectionUrl)

export default connection ;