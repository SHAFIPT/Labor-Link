import Booking from "../../models/BookingModal";
import { IPaymnetRepository } from "../../repositories/interface/IPaymentRepository";
import { IBooking } from "../../controllers/entities/bookingEntity";
import Stripe from "stripe";
import { BaseRepository } from "../../repositories/BaseRepository/BaseRepository";
import Labor from "../../models/LaborModel";
import { IWallet } from "controllers/entities/withdrawalRequstEntity";
import WithdrawalRequest from "../../models/WithdrawalRequestModal";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
});

export default class PaymnetRepository extends BaseRepository<IBooking> implements IPaymnetRepository {
    
    constructor() {
        super(Booking)
    }

    async paymentSuccess(bookingId: string, laborId: string, userId: string): Promise<any>  {
    try {

      const foundBooking = await this.findOne({ bookingId });

      if (!foundBooking) {
        throw new Error('booking is not found...')
      }


      const estimatedCost = foundBooking.quote.estimatedCost;
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: "dsglkd;s",
              },
              unit_amount: estimatedCost * 100,
            },
            quantity: 1,
          },
        ],
        success_url: `http://localhost:5173/reviewRating?bookingId=${bookingId}`,
        cancel_url: "http://localhost:5173/userProfilePage",
        metadata: {
          bookingId,
          laborId,
          userId,
        },
      });

      if (!session) {
        throw new Error('error in payment setinging ')
      }

      return session;

    } catch (error) {
      console.error("Error in pymentsuccess :", error);
      throw error;
    }
  }
  async findLabor(bookingId: string): Promise<IBooking | null> {
    try {

        const booking = await this.findOne({ bookingId }); 
        
        if (!booking) {
        return null;
        }

        return await booking.populate("laborId userId");

    } catch (error) {
      console.error("Error in fetch labor :", error);
      throw error;
    }
    }

     async updateWebhook(event: Stripe.Event, sig: string): Promise<IBooking> {
        try {
          console.log("Processing Stripe event:", event.type);
          
            if (event.type === "checkout.session.completed") {
                const session = event.data.object as Stripe.Checkout.Session;
                const metadata = session.metadata || {};
                const { bookingId, laborId, userId } = metadata;

                if (!bookingId || !laborId || !userId) {
                    throw new Error("Missing metadata in session");
                }

                const booking = await Booking.findOne({ bookingId });
                if (!booking) {
                    throw new Error("Booking not found");
                }

                const estimatedCost = booking.quote.estimatedCost;
                const commissionAmount = 100; // Adjust commission logic as needed
                const laborAmount = estimatedCost - commissionAmount;

                // Update booking with payment details
                const updatedBooking = await Booking.findOneAndUpdate(
                    { bookingId },
                    {
                        $set: {
                            paymentStatus: "paid",
                            paymentDetails: {
                                totalAmount: estimatedCost,
                                commissionAmount,
                                laborEarnings: laborAmount,
                                transactionId: session.payment_intent as string,
                            },
                        },
                    },
                    { new: true }
                );

                if (!updatedBooking) {
                    throw new Error("Failed to update booking with payment details");
                }

                // Update labor wallet
                const updatedLabor = await Labor.findByIdAndUpdate(
                    laborId,
                    {
                        $inc: { "wallet.balance": laborAmount },
                        $push: {
                            "wallet.transactions": {
                                amount: laborAmount,
                                type: "credit",
                                description: `Earnings from booking ${bookingId}`,
                                bookingId: booking._id,
                                originalAmount: estimatedCost,
                                commissionAmount: commissionAmount,
                                createdAt: new Date(),
                            },
                        },
                    },
                    { new: true }
                );

                if (!updatedLabor) {
                    throw new Error("Failed to update labor wallet");
                }

                return updatedBooking;
            }

            throw new Error(`Unhandled event type: ${event.type}`);
        } catch (error) {
            console.error("Error processing webhook:", error);
            throw new Error("Webhook processing failed");
        }
    }
    
    async withdrowalRequests(laborId: string): Promise<IWallet | null> {
      try {

        return await WithdrawalRequest.findOne({
          laborerId :laborId,
          status :"pending"
        })
        
      } catch (error) {
           console.error("Error fetch withdrowal requst..:", error);
            throw new Error("fetch withdrowal requst..:");
      }
    }
}