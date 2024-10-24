import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import users from "../models/user.js";
import { configuremail, sendLoginMail } from "./common.js";
import Register from "../models/register.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getUserProfile = asyncHandler(async (request, response) => {
    const { id } = request.user;
    const user = await users.findById(id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return response.status(200).json(new ApiResponse(200, user, "User found"));
});

export const signup = asyncHandler(async (request, response) => {
    const { name, email, password } = request.body;
    if ([name, email, password].some((val) => !val?.trim())) {
        throw new ApiError(400, "Name, email and password are required");
    }
    const existingUser = await users.findOne({ email });
    if (existingUser) {
        throw new ApiError(400, "User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await users.create({
        name,
        email,
        password: hashedPassword,
    });

    const token = jwt.sign(
        { email: newUser.email, id: newUser._id },
        "deargshvdnj",
        { expiresIn: "1h" }
    );

    return response.status(200).json(
        new ApiResponse(
            200,
            {
                name: newUser.name,
                id: newUser._id,
                token,
            },
            "Signup successful"
        )
    );
});

export const login = asyncHandler(async (request, response) => {
    const { email, password } = request.body;
    if ([email, password].every((val) => !val)) {
        throw new ApiError(400, "Email and password are required");
    }
    const user = await users.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid credentials");
    }
    const token = jwt.sign({ email: user.email, id: user._id }, "deargshvdnj", {
        expiresIn: "1h",
    });

    return response.status(200).json(
        new ApiResponse(
            200,
            {
                name: user.name,
                id: user._id,
                token,
            },
            "Login successful"
        )
    );
});

export const forgotpassword = async (req, res) => {
    const { email } = req.body;
    try {
        const oldUser = await users.findOne({ email });
        if (!oldUser) {
            return res.json({ success: false, message: "User Does Not Exist" });
        }
        const secret = "deargshvdnj" + oldUser.password;
        const token = jwt.sign({ id: oldUser._id }, secret, {
            expiresIn: "1d",
        });
        const link = `https://llp-qxsy.onrender.com/user/resetpassword/${oldUser._id}/${token}`;
        console.log(link);
        // Using the configured mail transporter and sendLoginMail function
        const transporter = await configuremail();
        const response = await sendLoginMail(transporter, req.body.email, link);
        return res.status(200).json({
            success: true,
            message: "Reset password email sent successfully",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Something went wrong...",
        });
    }
};

export const resetpassword = async (req, res) => {
    const { id, token } = req.params;
    try {
        const oldUser = await users.findOne({ _id: id });
        console.log("Old user:", oldUser);

        if (!oldUser) {
            return res.status(404).json({
                success: false,
                message: "User Not Exists!",
                status: "Not Verified",
            });
        }

        const secret = "deargshvdnj" + oldUser.password; // Verify if this is the correct secret
        const verify = jwt.verify(token, secret);
        const email = verify.email;

        if (req.method === "POST") {
            const { password } = req.body;
            console.log("New password:", password);

            if (!password) {
                return res
                    .status(400)
                    .json({ success: false, message: "Password is required" });
            }

            const encryptedPassword = await bcrypt.hash(password, 12);
            await users.updateOne(
                { _id: id },
                { $set: { password: encryptedPassword } }
            );

            return res.send(
                "<script>alert('Do you want to Login?'); window.location.href='https://llp-qxsy.onrender.com/user/login';</script>"
            );
        } else {
            return res.render("index", { email: email, status: "Verified" });
        }
    } catch (err) {
        console.log("Error:", err);
        return res.send("Not verified");
    }
};

export const userRegister = asyncHandler(async (request, response) => {
    const { name, mobile, skill } = request.body;
    const res = await Register.create({ name, mobile, skill });
    return response
        .status(200)
        .json(new ApiResponse(200, null, "Registered successfully"));
});
