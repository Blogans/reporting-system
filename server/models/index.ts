import mongoose, { Schema, Document } from 'mongoose';

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