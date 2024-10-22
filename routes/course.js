import express from "express";
import {
    getAllCourses,
    getCourseById,
    addCourse,
    deleteAllCourses,
    getPaidCourses,
    getSubCourses,
} from "../controllers/course.js";

const router = express.Router();

// Route to get all courses
router.get("/", getAllCourses);

// Route to get a course by ID
router.get("/:id", getCourseById);

// Route to add a new course
router.post("/", addCourse);

// Route to delete all courses
router.delete("/", deleteAllCourses);

// Route to get paid courses
router.get("/paid", getPaidCourses);

// Route to get subcourses
router.get("/subcourses/:id", getSubCourses);

export default router;
