// enroll.js
import express from "express";
import {
    enrollCourse,
    getEnrolledCourses,
    clearCart,
    removeCourse,
    createPaidCourses,
} from "../controllers/enroll.js";
import { getPaidCourses } from "../controllers/skill.js";

const router = express.Router();

router.post("/enroll", enrollCourse);
router.get("/enrolledcourses", getEnrolledCourses);
router.delete("/clearcart", clearCart);
router.delete("/removecourse", removeCourse);
router.post("/createpaidcourses", createPaidCourses);
router.get("/getpaidcourses", getPaidCourses);
export default router;
