import Course from "../models/course.js";
import PaidCourses from "../models/paidcourses.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getAllCourses = asyncHandler(async (request, response) => {
    const courses = await Course.find().select("category imgUrl _id");
    return response
        .status(200)
        .send(new ApiResponse(200, courses, "Courses fetched successfully"));
});

// Controller function to get a course by ID
export const getCourseById = async (req, res) => {
    const { id } = req.params;
    try {
        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller function to add a new course
export const addCourse = async (req, res) => {
    const course = req.body;

    try {
        const newCourse = await Course.create(course);
        res.status(201).json(newCourse);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const addCourses = async (req, res) => {
    const courses = req.body;

    try {
        const newCourses = await Course.insertMany(courses);
        res.status(201).json(newCourses);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteAllCourses = async (req, res) => {
    try {
        await Course.deleteMany({});
        res.status(200).json({ message: "All courses deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPaidCourses = async (req, res) => {
    try {
        const { email } = req.query;

        const paidCourses = await PaidCourses.findOne({ email });

        if (!paidCourses) {
            return res.status(404).json({
                message: "No paid courses found for the provided email",
            });
        }

        const subcourseIds = paidCourses.course_ids.map((id) => id.toString());

        const courseNames = [];
        const courses = await Course.find();

        for (const course of courses) {
            for (const subcourse of course.courses) {
                if (subcourseIds.includes(subcourse._id.toString())) {
                    courseNames.push(subcourse.course);
                }
            }
        }

        console.log("Course Names:", courseNames);
        res.json({ courseNames });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getSubCourses = asyncHandler(async (request, response) => {
    const { id } = request.params;
    const category = await Course.findById(id);
    if (!category) {
        throw new ApiError(404, "Category not found");
    }
    return response
        .status(200)
        .send(
            new ApiResponse(200, category, "SubCourses fetched successfully")
        );
});
