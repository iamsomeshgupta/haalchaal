import mongoose ,{Schema,models} from "mongoose";
const UserSchema=new Schema({
    username:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true,
        select:false,
    },
},
{
    timestamps:true,
});

// Reuse existing model in dev to avoid model overwrite errors
export default models.User || mongoose.model("User", UserSchema);