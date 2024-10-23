import express from "express";
import {
    getAllSkills,
    getSkillById,
    addSkill,
    deleteAllSkills,
    getPaidCourses,
} from "../controllers/skill.js";

const router = express.Router();

router.route("/").get(getAllSkills).post(addSkill).delete(deleteAllSkills);

// Route to get subcourses
router.get("/:id", getSkillById);

// Route to get paid courses
router.get("/paid", getPaidCourses);

export default router;
