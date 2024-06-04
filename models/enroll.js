import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
    email: { type: String, required: true },
    course_id: { type: String, required: true },
    course_name:{type:String,required:true},
    course_price:{type:String,required:true}
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

export default Enrollment;