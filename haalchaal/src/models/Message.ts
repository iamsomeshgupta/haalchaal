import mongoose ,{Schema,models} from "mongoose";
const MessageSchema=new Schema({
    sender:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    receiver:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    content:{
        type:String,
        required:true,
        trim:true,
    },
    seen:{
        type:Boolean,
        default:false,
    }
},{timestamps:true});
export default models.Message||mongoose.model("Message",MessageSchema);