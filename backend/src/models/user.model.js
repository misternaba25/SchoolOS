import mongoose, {Schema} from "mongoose"
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        username:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, //Remove white spaces
            minlength: 6,
            maxlength:25
        },

        password: {
            type: String,
            required: true,
            minlenght: 6,
            maxlenght: 30
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, //Remove white spaces
        }
    },
    {
        timestamps: true
    }
)

//password hash
userSchema.pre("save", async function () {
    if(!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 12)
})

//compare password with hash

userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password)
}

export const User = mongoose.model('User', userSchema)