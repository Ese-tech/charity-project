import express from 'express';
import { createDonation, createSponsorship, getImpactStats } from '../controllers/charityController';

const router = express.Router();

// Public routes for donations and sponsorships
router.post('/donations', createDonation);
router.get('/donations/impact-stats', getImpactStats);
router.post('/sponsorships', createSponsorship);

export default router;