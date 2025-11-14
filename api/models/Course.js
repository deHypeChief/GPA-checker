import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  creditHours: {
    type: Number,
    required: true,
    min: 1
  },
  level: {
    type: Number,
    required: true,
    min: 100
  },
  semester: {
    type: String,
    required: true,
    enum: ['First', 'Second']
  },
  session: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Compound index to ensure unique course per session/level
courseSchema.index({ code: 1, session: 1, level: 1 }, { unique: true });

export default mongoose.model('Course', courseSchema);

