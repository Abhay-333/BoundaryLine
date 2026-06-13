import dotenv from "dotenv";
import {z} from "zod";
import { logger } from "../util/Logger.js";
import appConstant from "../constant/app.constant.js";
dotenv.config();

// creating zod object to validate env Schema
const envSchema = z.object({
    PORT: z.coerce.number().default(appConstant.PORT),
    MONGO_URI: z.string(appConstant.MONGO_URI)
})

// parsing env for correct format
const parsed = envSchema.safeParse(process.env);


if(!parsed.success){
    logger.error(parsed.error.format());
}
export default parsed.data;
