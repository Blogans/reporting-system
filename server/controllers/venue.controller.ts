import { Request, Response } from 'express';
import { VenueModel } from '../models';

export const testDBConnection = async (_req: Request, res: Response) => {
  try {
    // Try to create a test venue
    const testVenue = await VenueModel.create({
      name: 'Test Venue',
      address: '123 Test St',
      contacts: []
    });

    // Fetch it back
    const venues = await VenueModel.find();
    
    // Delete the test venue
    await VenueModel.findByIdAndDelete(testVenue._id);

    res.json({
      message: 'Database connection successful',
      testVenue,
      venueCount: venues.length,
      connectionStatus: 'Connected'
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      message: 'Database test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      connectionStatus: 'Failed'
    });
  }
};