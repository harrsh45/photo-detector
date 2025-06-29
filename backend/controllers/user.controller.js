import userModel from '../model/user.model.js'
import * as userService from '../services/user.services.js'
import {validationResult} from 'express-validator'


export const createUserController = async (req,res)=>{
    const errors=validationResult(req)
    
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})

    }
    try{
        const user =await userService.createUser(req.body)

        const token=await user.generateJWT()
        res.status(201).json({user,token})
    }
    catch(err){
        res.status(400).send(err.message)

    }
}
export const loginController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Extract username and password from request body
        const { username, password } = req.body;

        // Find user by username and include password for verification
        const user = await userModel.findOne({ username }).select('+password');

        if (!user) {
            return res.status(401).json({
                errors: 'Invalid credentials'
            })
        }

        const isMatch = await user.isValidPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                errors: 'Invalid credentials'
            })
        }

        const token = await user.generateJWT();

        delete user._doc.password;

        res.status(200).json({ user, token });


    } catch (err) {

        console.log(err);

        res.status(400).send(err.message);
    }
}

export const logoutController = async (req, res) => {
    try {

        const token = req.cookies?.token || req.headers.authorization.split(' ')[ 1 ];

        redisClient.set(token, 'logout', 'EX', 60 * 60 * 24);

        res.status(200).json({
            message: 'Logged out successfully'
        });


    } catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }
}

export const getCurrentUserController = async (req, res) => {
    try {
        // User is already attached to req by the auth middleware
        const user = await userModel.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server error' });
    }
};