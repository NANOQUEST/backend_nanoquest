// controllers/enroll.js
import Enrollment from '../models/enroll.js';
import PaidCourses from '../models/paidcourses.js';
export const enrollCourse = async (req, res) => {
    const { email, course_id, course_name,course_price } = req.body;

    try {
        await Enrollment.create({ email, course_id, course_name,course_price });
        return res.status(201).json({ success: true, message: "Course added successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Failed to add course" });
    }
};

export const getEnrolledCourses = async (req, res) => {
    const { email } = req.query; 
    try {
        const enrolledCourses = await Enrollment.find({ email });
        return res.status(200).json({ success: true, enrolledCourses });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Failed to fetch enrolled courses" });
    }
};

export const clearCart = async (req, res) => {
    const { email} = req.body; 
    try {
        await Enrollment.deleteMany({ email});
        return res.status(200).json({ success: true, message: "Cart cleared successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Failed to clear cart" });
    }
};

export const removeCourse = async (req, res) => {
    const { email, course_id } = req.query;
    try {
        await Enrollment.deleteOne({ email, course_id });
        return res.status(200).json({ success: true, message: "Course removed successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Failed to remove course" });
    }
};


export const createPaidCourses = async (req, res) => {
  const { email, course_ids,order_id,payment_id} = req.body;

  try {
    
    const createdCourses = await PaidCourses.create({
      email,
      course_ids,
      order_id,
      payment_id,
    });

    res.status(201).json({ success: true, data: createdCourses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create paid courses" });
  }
};


