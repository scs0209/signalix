import { type Document, type Model, model, models, Schema } from 'mongoose';

export interface WatchlistItem extends Document {
  userId: string;
  symbol: string;
  company: string;
  addedAt: Date;
}

const WatchlistSchema = new Schema<WatchlistItem>(
  {
    userId: { type: String, required: true, index: true },
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      maxlength: [10, 'Symbol cannot exceed 10 characters'],
    },
    company: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, 'Company name cannot exceed 100 characters'],
    },
    addedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

// Prevent duplicate symbols per user
WatchlistSchema.index({ userId: 1, symbol: 1 }, { unique: true });

export const Watchlist: Model<WatchlistItem> =
  (models?.Watchlist as Model<WatchlistItem>) || model<WatchlistItem>('Watchlist', WatchlistSchema);
