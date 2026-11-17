import type { PaymentMethod, PaymentMethodId } from '../types/checkout'

/*
  Demo payment methods. None of them is connected to a real provider.

  To connect a real provider later, keep this list as the menu the customer
  sees and add the provider's own component for the chosen id (for example a
  hosted card form). Card numbers should never pass through this app.
*/

export const PAYMENT_METHODS: ReadonlyArray<PaymentMethod> = [
  {
    id: 'card',
    label: 'Credit / Debit Card',
    description: 'Pay by card through a secure payment provider.',
    availableIn: 'all',
    demoNote:
      'In the real store a secure payment provider would show its own card form here. This demo does not ask for any card details.',
  },
  {
    id: 'paypal',
    label: 'PayPal',
    description: 'Pay with your PayPal account.',
    availableIn: 'all',
    demoNote:
      'In the real store you would be sent to PayPal to approve the payment. Nothing is connected in this demo.',
  },
  {
    id: 'bank-transfer',
    label: 'Bank Transfer',
    description: 'Send the payment from your bank. The order ships once it arrives.',
    availableIn: ['AF', 'AE', 'SA', 'QA', 'TR', 'PK', 'IN', 'EG', 'DE', 'FR', 'ES', 'IT', 'NL', 'SE', 'NO', 'IE', 'GB'],
    demoNote:
      'In the real store you would receive the bank details after placing the order. No account details are shown in this demo.',
  },
  {
    id: 'cash-on-delivery',
    label: 'Cash on Delivery',
    description: 'Pay the courier in cash when the parcel arrives.',
    availableIn: ['AF', 'AE', 'SA', 'QA', 'PK', 'IN', 'EG', 'NG', 'TR'],
    demoNote:
      'In the real store availability would depend on the seller and your address. Nothing is arranged in this demo.',
  },
]

export function getPaymentMethod(id: PaymentMethodId): PaymentMethod {
  const method = PAYMENT_METHODS.find((candidate) => candidate.id === id)
  if (!method) throw new Error(`Unknown payment method: ${id}`)
  return method
}

/** Whether a method is offered for the delivery country. Unknown country: only "all" methods. */
export function isPaymentAvailable(method: PaymentMethod, countryCode: string): boolean {
  return method.availableIn === 'all' || method.availableIn.includes(countryCode)
}
