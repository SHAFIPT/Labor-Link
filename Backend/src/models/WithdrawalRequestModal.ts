import mongoose, { Schema } from "mongoose";

const WithdrawalRequestSchema = new Schema({
  laborerId: { type: Schema.Types.ObjectId, ref: "Labor", required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
  processedAt: { type: Date },
  paymentMethod: { type: String, required: true },
  paymentDetails: { type: String }
});

const WithdrawalRequest = mongoose.model("WithdrawalRequest", WithdrawalRequestSchema);
export default WithdrawalRequest;
