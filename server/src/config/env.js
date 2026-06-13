import dotenv from "dotenv";
import {z} from "zod";
dotenv.config();

// creating zod object to validate env Schema
const envSchema = z.object({
    PORT: z.coerce.number(),
    MONGO_URI: z.string()
})

// parsing env for correct format
const parsed = envSchema.safeParse(process.env);


if(!parsed.success){
    console.log(parsed.error.format());
}

export default parsed.data;
