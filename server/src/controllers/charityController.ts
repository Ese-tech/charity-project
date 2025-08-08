import { Request, Response } from 'express';
import Donation, { IDonation } from '../models/Donation';
import Sponsorship, { ISponsorship } from '../models/Sponsorship';

// @desc    Process a new donation
// @route   POST /api/donations
// @access  Public
export const createDonation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount, type, category, firstName, lastName, email, phone, paymentMethod } = req.body;

    // Basic validation
    if (!amount || !type || !category || !firstName || !lastName || !email || !paymentMethod) {
      res.status(400).json({ message: 'Please enter all required fields for donation.' });
      return;
    }

    const donation: IDonation = await Donation.create({
      amount,
      type,
      category,
      firstName,
      lastName,
      email,
      phone,
      paymentMethod,
      isCompleted: true, // Assuming success for this demo
    });

    res.status(201).json({
      message: 'Donation processed successfully!',
      donationId: donation._id,
      amount: donation.amount,
      email: donation.email,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: `Failed to process donation: ${error.message}` });
    } else {
      res.status(500).json({ message: 'Failed to process donation: Server error.' });
    }
  }
};

// @desc    Create a new child sponsorship
// @route   POST /api/sponsorships
// @access  Public
export const createSponsorship = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sponsorInfo, monthlyAmount, childId } = req.body;

    // Basic validation
    if (!sponsorInfo || !sponsorInfo.firstName || !sponsorInfo.lastName || !sponsorInfo.email || !monthlyAmount) {
      res.status(400).json({ message: 'Please enter all required fields for sponsorship.' });
      return;
    }

    const sponsorship: ISponsorship = await Sponsorship.create({
      sponsorInfo,
      monthlyAmount,
      childId, // This can be null/undefined if no specific child is selected yet
      isCompleted: true, // Assuming success for this demo
    });

    res.status(201).json({
      message: 'Sponsorship created successfully!',
      sponsorshipId: sponsorship._id,
      monthlyAmount: sponsorship.monthlyAmount,
      sponsorEmail: sponsorship.sponsorInfo.email,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: `Failed to create sponsorship: ${error.message}` });
    } else {
      res.status(500).json({ message: 'Failed to create sponsorship: Server error.' });
    }
  }
};

// @desc    Get overall impact statistics (for frontend display)
// @route   GET /api/donations/impact-stats
// @access  Public
export const getImpactStats = async (req: Request, res: Response): Promise<void> => {
  try {
    // For simplicity, we'll just return mock data or simple counts for now.
    // In a real app, this would involve complex aggregation queries.

    const totalDonationsCount = await Donation.countDocuments();
    const totalSponsorshipsCount = await Sponsorship.countDocuments();

    // Example of simple aggregation for total amount (requires more complex setup for real numbers)
    // const totalDonatedAmountResult = await Donation.aggregate([
    //   { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
    // ]);
    // const totalDonatedAmount = totalDonatedAmountResult.length > 0 ? totalDonatedAmountResult[0].totalAmount : 0;

    res.status(200).json({
      childSponsorship: {
        totalSponsored: `${totalSponsorshipsCount} children`, // Placeholder
        usSponsored: '859,000' // Mocked for now
      },
      disasterRelief: {
        usEmergencies: '14', // Mocked for now
        worldwideEmergencies: '84' // Mocked for now
      },
      totalDonations: {
        amount: `$${totalDonationsCount * 50}`, // Simple calculation for demo
        count: totalDonationsCount,
        average: '$50' // Mocked for now
      }
    });

  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: `Failed to fetch impact stats: ${error.message}` });
    } else {
      res.status(500).json({ message: 'Failed to fetch impact stats: Server error.' });
    }
  }
};