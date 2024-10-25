import mongoose, { Schema, Document } from 'mongoose';

// User Model
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  role: 'staff' | 'manager' | 'admin';
  venues: mongoose.Types.ObjectId[];
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['staff', 'manager', 'admin'], required: true },
  venues: [{ type: Schema.Types.ObjectId, ref: 'Venue' }],
});

export const UserModel = mongoose.model<IUser>('User', UserSchema);

export interface IVenue extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  address: string;
  contacts: mongoose.Types.ObjectId[];
}

const VenueSchema: Schema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  contacts: [{ type: Schema.Types.ObjectId, ref: 'Contact' }],
});

export const VenueModel = mongoose.model<IVenue>('Venue', VenueSchema);