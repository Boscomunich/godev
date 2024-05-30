import express from 'express';
import { initProject, getAllProject } from '../controllers/Project';

const router = express.Router();

router.route('/').get(getAllProject)
router.route('/project').post(initProject)

export default router