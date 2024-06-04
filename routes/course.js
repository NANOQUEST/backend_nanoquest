import express from 'express';
import { getAllCourses, getCourseById, addCourse,deleteAllCourses, getPaidCourses,getSubCourses } from '../controllers/course.js';

const router = express.Router();

// Route to get all courses
router.get('/getallcourses', getAllCourses);

// Route to get a course by ID
router.get('/getcoursebyid/:id', getCourseById);

// Route to add a new course
router.post('/addcourse', addCourse);

router.post('/addcourses', addCourse);

router.delete('/deleteallcourses', deleteAllCourses);

router.get('/getpaidcourses',getPaidCourses);

router.get('/getsubcourses/:id',getSubCourses);
export default router;
