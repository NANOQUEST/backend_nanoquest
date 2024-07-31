import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import users from '../models/auth.js';
import { configuremail, sendLoginMail } from './common.js'; 
import Register from '../models/register.js';
export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await users.findOne({ email });
        if (existingUser) {
            return res.status(404).json({ success: false, message: "User already exists" });
        }
        
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await users.create({ name, email, password: hashedPassword });
        const token = jwt.sign({ email: newUser.email, id: newUser._id }, "deargshvdnj", { expiresIn: '1h' });
        res.status(200).json({ success: true, result: newUser, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Something went wrong..." });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const existingUser = await users.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ success: false, message: "User doesn't exist" });
        }
        
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, "deargshvdnj", { expiresIn: '1h' });
        res.status(200).json({ success: true, result: existingUser, token, name: existingUser.name,user_id:existingUser._id});
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Something went wrong..." });
    }
};

export const forgotpassword = async (req, res) => {
    const { email } = req.body;
    try {
        const oldUser = await users.findOne({ email });
        if (!oldUser) {
            return res.json({ success: false, message: "User Does Not Exist" });
        }
        const secret = "deargshvdnj" + oldUser.password;
        const token = jwt.sign({ id: oldUser._id }, secret, { expiresIn: "1d" });
        const link=`https://llp-qxsy.onrender.com/user/resetpassword/${oldUser._id}/${token}`;
        console.log(link);
        // Using the configured mail transporter and sendLoginMail function
        const transporter = await configuremail();
        const response = await sendLoginMail(transporter, req.body.email,link);
        return res.status(200).json({ success: true, message: "Reset password email sent successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Something went wrong..." });
    }
};

export const resetpassword = async (req, res) => {
    const { id, token } = req.params;
    try {
        const oldUser = await users.findOne({ _id: id });
        console.log("Old user:", oldUser);

        if (!oldUser) {
            return res.status(404).json({ success: false, message: "User Not Exists!", status: "Not Verified" });
        }

        const secret = "deargshvdnj" + oldUser.password; // Verify if this is the correct secret
        const verify = jwt.verify(token, secret);
        const email = verify.email;

        if (req.method === 'POST') {
            const { password } = req.body;
            console.log("New password:", password);

            if (!password) {
                return res.status(400).json({ success: false, message: "Password is required" });
            }

            const encryptedPassword = await bcrypt.hash(password, 12);
            await users.updateOne(
                { _id: id },
                { $set: { password: encryptedPassword } }
            );

            
            return res.send("<script>alert('Do you want to Login?'); window.location.href='https://llp-qxsy.onrender.com/user/login';</script>");
        } else {
            
            return res.render("index", { email: email ,status:"Verified"});
        }
    } catch (err) {
        console.log("Error:", err);
        return res.send("Not verified");
    }
};

export const userRegister=async(req,res)=>{
    const {name,mobile,skill}=req.body;
    try{
        const response=await Register.create({name,mobile,skill});
        res.status(200).json({ success: true, message: "Registered successfully" });
    }
    catch(err){
        res.status(500).json({ success: false, message: "Something went wrong..." });
    }
}


