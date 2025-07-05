import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
    name: {type:String, require:true},
    email: {type:String, require:true, unique:true},
    password: {type:String, require:true, unique:true},
    role: {type:String, require:true,
        enum: ["admin", "mentor", "mentee"],
        default: "mentee"
    },

     bio: { type: String, default: "" },
  skills: { type: [String], default: [] },
  goals: { type: [String], default: [] }
  
}, {
    timestamps: true,
    minimize: false 
  }
);

const AuthModel = mongoose.model.users || mongoose.model("users", authSchema);

export default AuthModel;