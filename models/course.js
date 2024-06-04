import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  id: Number,
  category:String,
  imgUrl:String,
  courses: [{
    course: String,
    price_in_rupees: Number,
  }],
});

const Course = mongoose.model('Course', courseSchema);

export default Course;
