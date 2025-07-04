import AuthModel from "../models/authSchema.js";
import jwt from "jsonwebtoken";

const users = async (req, res)=> {
try{
    const {id} = req.params;
    const userData = await AuthModel.findById (id).select ("-password");
    if (!userData){
        return res.status(404).json ({message:"User not found"});     
    }
    return res.status(200).json ({userData});
}catch (error){
    console.log(error)
    return res.status(500).json ({message:"Server error"});
}
}



const editProfile = async(req, res) => {
    try{
        const {id} = req.params;

        const  {name, email, bio, skills, goals} = req.body;

        const user = await AuthModel.findById(id);
        if(!user){
            return res.status(404).json ({message:"User not found"});
        }
        user.name = name || user.name;
        user.email = email || user.email;
        user.bio = bio || user.bio;
        user.skills = skills || user.skills;
        user.goals = goals || user.goals;

        await user.save();

        return res.status(200).json ({message: "Profile updated successfully"});
    
    }catch (error) {
        console.log(error)
        return res.status(500).json ({message: "Server error"});
    }

}

export {users, editProfile};