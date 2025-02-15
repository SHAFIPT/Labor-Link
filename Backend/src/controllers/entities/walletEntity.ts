
import { Types } from 'mongoose';

export interface WalletTransaction {
    amount: number;
    type: 'credit' | 'debit';
    description: string;
    bookingId?: Types.ObjectId;
    originalAmount?: number;
    commissionAmount?: number;
    createdAt: Date;
}

export interface Wallet {
    balance: number;
    transactions: WalletTransaction[];
}