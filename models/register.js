import mongoose from "mongoose";

const registerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  skill: { type: String,required:true },
});

const Register = mongoose.model('Register', registerSchema);

export default Register;