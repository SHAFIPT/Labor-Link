import Stripe from "stripe";
import { IPaymnetRepository } from "../../repositories/interface/IPaymentRepository";
import { IPaymentService } from "../../services/interface/IPaymnetService";
import { IBooking } from "controllers/entities/bookingEntity";

export default class PaymentService implements IPaymentService{
    private paymentRepository: IPaymnetRepository
    

    constructor(paymentRepository: IPaymnetRepository) {
        this.paymentRepository = paymentRepository
    }

    async pymentSuccess(
    bookingId: string,
    laborId: string,
    userId: string
  ): Promise<Stripe.PaymentIntent> {
    try {
      const paymnetStripeMethod = await this.paymentRepository.paymentSuccess(
        bookingId,
        laborId,
        userId
      );

      return paymnetStripeMethod;
    } catch (error) {}
    }
    
    async updateWebhook(event: Stripe.Event, sig: string): Promise<IBooking> {
        return this.paymentRepository.updateWebhook(
            event,
            sig
        )
    }
}