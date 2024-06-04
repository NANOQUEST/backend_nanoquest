import mongoose from 'mongoose';

const paidCoursesSchema = new mongoose.Schema({
  email: { type: String, required: true },
  course_ids: [{ type: String, ref: 'Course', required: true }],
  order_id:{type:String},
  payment_id:{type:String}
}, { timestamps: true });

const PaidCourses = mongoose.model('PaidCourses', paidCoursesSchema);

export default PaidCourses;
