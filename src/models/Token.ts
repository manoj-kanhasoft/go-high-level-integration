import mongoose, { Document, Schema } from 'mongoose';

export interface IToken extends Document {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  locationId?: string;
  companyId?: string;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TokenSchema: Schema = new Schema(
  {
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    locationId: { type: String },
    companyId: { type: String },
    userId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IToken>('Token', TokenSchema); 