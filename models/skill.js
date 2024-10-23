import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
    category: { type: String, required: true },
    imgUrl: { type: String },
    skills: [
        {
            name: { type: String, required: true },
            items: [
                {
                    title: { type: String, required: true },
                    description: { type: String, required: true },
                    price: { type: Number, required: true },
                },
            ],
        },
    ],
});

const Skills = mongoose.model("skill", skillSchema);

export default Skills;
