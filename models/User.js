import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['artist', 'client', 'admin'], default: 'client' },
  artworks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artwork' }],
  commissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Commission' }]
}, { timestamps: true });

export default mongoose.model('User', userSchema);