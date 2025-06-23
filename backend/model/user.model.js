import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        require:true,
        unique:true,
        lowercase:true,
        minLength:[3,"Username must be at least 3 charachters long"],
        maxLength:[50,"Username must be less than 50 charachters long"]

    },
    password:{
        type:String,
        select:false,
    }
})

userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}

userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateJWT = function () {
    return jwt.sign(
        { 
            id: this._id,
            username: this.username 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
}


const User = mongoose.model('user', userSchema);

export default User;