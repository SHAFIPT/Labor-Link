import { IBooking } from "../../controllers/entities/bookingEntity";
import Stripe from "stripe";

export interface IPaymnetRepository{
    paymentSuccess(bookingId: string, laborId: string, userId: string): Promise<Stripe.PaymentIntent>

    updateWebhook(event: Stripe.Event, sig: string): Promise<IBooking>;

}