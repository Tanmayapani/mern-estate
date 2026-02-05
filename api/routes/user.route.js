import express from 'express';
import { test, updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js'; 

const router = express.Router();

router.get('/test', test);

router.post('/update/:id', verifyToken, updateUser); // We add the verifyToken middleware here to protect this route

export default router;