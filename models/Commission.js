import mongoose from 'mongoose';

const revisionSchema = new mongoose.Schema({
  description: String,
  images: [String],
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const commissionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  artist: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  budget: { type: Number, required: true },
  deadline: { type: Date },
  status: {
    type: String,
    enum: ['draft', 'pending', 'in_progress', 'revision', 'completed', 'cancelled'],
    default: 'draft'
  },
  tags: [String],
  references: [String],
  revisions: [revisionSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Middleware untuk update timestamp
commissionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Static methods
commissionSchema.statics.findByArtist = function(artistId) {
  return this.find({ artist: artistId }).populate('client', 'username avatar');
};

commissionSchema.statics.findByClient = function(clientId) {
  return this.find({ client: clientId }).populate('artist', 'username skills');
};

// Indexes
commissionSchema.index({ client: 1 });
commissionSchema.index({ artist: 1 });
commissionSchema.index({ status: 1 });
commissionSchema.index({ createdAt: -1 });

export default mongoose.model('Commission', commissionSchema);