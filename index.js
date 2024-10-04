import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import crypto from "crypto";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
// Importing routes
import userRoutes from "./routes/auth.js";
import courseRoutes from "./routes/course.js";
import enrollRoutes from "./routes/enroll.js";
import contactusRoutes from "./routes/contact.js";
import users from "./models/auth.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// CORS configuration
const allowedOrigins = [
    "http://localhost:3000",
    "https://www.nanoquesttech.in",
    "https://llp-qxsy.onrender.com",
    "http://localhost:5000",
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

// Routes
app.use("/user", userRoutes);
app.use("/course", courseRoutes);
app.use("/enroll", enrollRoutes);
app.use("/contactus", contactusRoutes);

// Razorpay order creation endpoint
app.post("/order", async (req, res) => {
    try {
        const razorpay = new Razorpay({
            key_id: "rzp_live_nFbyXwX5uLy23R",
            key_secret: "8lUfuF1BFP3U6i0PdlnMiUmt",
        });
        const options = req.body;
        const order = await razorpay.orders.create(options);
        if (!order) {
            return res.status(500).send("Error creating order");
        }
        res.json(order);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating order");
    }
});

// Razorpay order validation endpoint
app.post("/order/validate", async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;

    const sha = crypto.createHmac("sha256", "1VJT94EBUNQOwP0anlz8C6OV");
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const signature = sha.digest("hex");

    if (signature !== razorpay_signature) {
        return res.status(400).json({ msg: "Transaction is not legit!" });
    }

    res.json({
        msg: "success",
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
    });
});

// Retrieve user profile endpoint
app.get("/user/profile", async (req, res) => {
    const { email } = req.query;

    try {
        const user = await users.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
});

// Connection to MongoDB
mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
