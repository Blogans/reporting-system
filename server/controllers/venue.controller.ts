import { Request, Response } from 'express';
import { VenueModel, ContactModel, UserModel } from '../models';
import mongoose from 'mongoose';
import { IVenue } from '../models/index.js';

export async function getVenuesForUser(userId: string) {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return VenueModel.find({ _id: { $in: user.venues } });
}

export const getAllVenues = async (req: Request, res: Response) => {
  try {
    if (req.session.userRole === 'staff') {
      const venues = await getVenuesForUser(req.session.userId!);
      return res.json(venues);
    }
    const venues = await VenueModel.find();
    res.json(venues);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching venues', error });
  }
};

export const createVenue = async (req: Request, res: Response) => {
  try {
    const newVenue = new VenueModel(req.body);
    const savedVenue = await newVenue.save();
    res.status(201).json({
      message: 'Venue created successfully',
      venue: savedVenue,
    });
  } catch (error) {
    res.status(400).json({ message: 'Error creating venue', error });
  }
};


export const getVenueById = async (req: Request, res: Response) => {
  try {
    let venue: IVenue | null = null;
    if (req.session.userRole === 'staff') {
      const userVenues = await getVenuesForUser(req.session.userId!);
      const foundVenue = userVenues.find(v => v._id.toString() === req.params.id);
      if (foundVenue) {
        venue = foundVenue;
      }
    } else {
      venue = await VenueModel.findById(req.params.id);
    }
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }
    res.json(venue);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching venue', error });
  }
};

export const updateVenue = async (req: Request, res: Response) => {
  try {
    const updatedVenue = await VenueModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedVenue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    res.json({
      message: 'Venue updated successfully',
      venue: updatedVenue,
    });
  } catch (error) {
    res.status(400).json({ message: 'Error updating venue', error });
  }
};

export const deleteVenue = async (req: Request, res: Response) => {
  try {
    const deletedVenue = await VenueModel.findByIdAndDelete(req.params.id);
    if (!deletedVenue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    await UserModel.updateMany(
      { venues: deletedVenue._id },
      { $pull: { venues: deletedVenue._id } }
    );

    res.json({ message: 'Venue deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting venue', error });
  }
};

export const addContactToVenue = async (contactId: string, venueId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const venue = await VenueModel.findById(venueId).session(session);
    const contact = await ContactModel.findById(contactId).session(session);

    if (!venue || !contact) {
      throw new Error('Venue or Contact not found');
    }

    if (!venue.contacts.includes(contact._id)) {
      venue.contacts.push(contact._id);
      await venue.save();
    }

    await session.commitTransaction();
    session.endSession();

    return venue;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const removeContactFromVenue = async (contactId: string, venueId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const venue = await VenueModel.findById(venueId).session(session);

    if (!venue) {
      throw new Error('Venue not found');
    }

    venue.contacts = venue.contacts.filter(id => !id.equals(contactId));
    await venue.save();

    await session.commitTransaction();
    session.endSession();

    return venue;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const getContactsForVenue = async (venueId: string) => {
  const venue = await VenueModel.findById(venueId).populate('contacts');
  return venue ? venue.contacts : [];
};

export const addContactToVenueController = async (req: Request, res: Response) => {
  try {
    const { venueId, contactId } = req.params;
    const result = await addContactToVenue(contactId, venueId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: 'Error adding contact to venue', error });
  }
};

export const removeContactFromVenueController = async (req: Request, res: Response) => {
  try {
    const { venueId, contactId } = req.params;
    const result = await removeContactFromVenue(contactId, venueId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: 'Error removing contact from venue', error });
  }
};

export const getContactsForVenueController = async (req: Request, res: Response) => {
  try {
    const { venueId } = req.params;
    const contacts = await getContactsForVenue(venueId);
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contacts for venue', error });
  }
};