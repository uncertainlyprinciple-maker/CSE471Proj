import mongoose, {Schema} from "mongoose";

const userSchema = new Schema(
    {
        userName:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            minLength: 1,
            maxLength: 10,

        },
        email:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            minLength: 10,
            maxLength: 30,

        },

         password:{
            type: String,
            required: true,
            minngth: 20,
            maxLength: 10,
        },

        course:{
            type: String,
            required: true,
            minngth: 6,
            maxLength: 10,
        },

    },
    {
        timestamps: true
    }
);

export const User = mongoose.model("User",userSchema);