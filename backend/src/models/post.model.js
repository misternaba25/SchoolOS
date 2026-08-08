import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
    {
        name:{
            type: String,
            required: true,
            trim: true,
        },
        description:{
            type: String,
            required: true,
        },
        age:{
            type: Number,
            required: true,
            min: 1,
            max: 130
        }
    },
    {
        timestamps: true
    }
)

export const Post = mongoose.model('Post', postSchema)