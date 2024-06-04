import express from 'express';
import {signup,login,resetpassword,forgotpassword} from '../controllers/auth.js';
import { contactus } from '../controllers/contact.js';
const router=express.Router();
router.post('/signup',signup)
router.post('/login',login);
router.post('/contactus',contactus);
router.post('/forgotpassword',forgotpassword)
router.get('/resetpassword/:id/:token',resetpassword);
router.post('/resetpassword/:id/:token',resetpassword);
export default router;