import {User} from "../models/user.model.js";

const registerUser = async (req,res) => {
    try{
        const { userName,email,password,course } = req.body;

        if(!userName || !email || !password || !course){
            return res.status(400).json({message: "Fillup all fields!"});
        }
        const existing = await User.findOne({email: email.toLowerCase()});

        if(existing){
            return res.status(400).json({messafe: "Already existing user!"});
        }

        const user = await User.create({
            userName,
            email: email.toLowerCase(),
            password,
            course,
            loggedIn: false,
        });
        res.status(201).json({ 
            message: "User registered for course successfully!",
            user: {id: user._id,email: user.email, userName: user.userName,course: user.course}
        });
    }catch(error){
        res.status(500).json({message: "Internal server error",error:error.message});
    }
}

export{
    registerUser
}