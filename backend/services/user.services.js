import userModel from "../model/user.model.js";
export const createUser = async({username,password})=>{
    if(!username||!password)
    {
        throw new Error('Email and password are required')
    }
    const hashedPassword=await userModel.hashPassword(password)

    const user=await userModel.create({username,password:hashedPassword})

    return user
}

export const getAllUsers=async()=>
{
    const users=await userModel.find({
        _id:{$ne:userId}
    })
    return users
}