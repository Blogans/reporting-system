import express from 'express';
import { UserModel } from '../models';
import { getVenuesForUser } from './venue.controller';
import { ObjectId } from 'mongodb';

export const getAllUsers = async (_req: express.Request, res: express.Response) => {
    try {
        const users = await UserModel.find();

        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const getMyUser = async (req: express.Request, res: express.Response) => {
    try {
        const { userId } = req.session;

        if (!userId) {
            return res.status(401).json({ message: 'Not logged in' });
        }

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;

        const deletedUser = await UserModel.findByIdAndDelete(id);

        return res.json(deletedUser);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const updateUser = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const { username, email, role } = req.body;

    if (!username && !email && !role) {
      return res.status(400).json({ message: 'No update fields provided' });
    }

    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (username) {
        const existingUser = await UserModel.findOne({  username });
        if (existingUser) {
          return res.status(400).json({ message: 'Username already exists' });
        }
        user.username = username;
    }
    if (email) {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: 'Email already exists' });
        }
        user.email = email;
    }
    
    if (role) user.role = role;

    await user.save();

    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    return res.status(200).json({
      message: 'User updated successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Error in updateUser:', error);
    return res.status(400).json({ message: 'Error updating user', error: error });
  }
};

export const getUserById = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;

        const user = await UserModel.findById(id);

        if (!user) {
            return res.sendStatus(404);
        }

        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const getUserVenues = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;

        const venues = await getVenuesForUser(id);

        return res.status(200).json(venues);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const addVenueToUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id, venueId } = req.params;

        const user = await UserModel.findById(id);

        if (!user) {
            return res.sendStatus(404);
        }

        if (user.venues.find((venue: ObjectId) => venue.toHexString() === venueId)) {
            return res.status(400).json({ message: 'User already has this venue' });
        }
        
        user.venues.push(new ObjectId(venueId));

        await user.save();

        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const removeVenueFromUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id, venueId } = req.params;

        const user = await UserModel.findById(id);

        if (!user) {
            return res.sendStatus(404);
        }

        user.venues = user.venues.filter((venue: ObjectId) => venue.toHexString() !== venueId);

        await user.save();

        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}
