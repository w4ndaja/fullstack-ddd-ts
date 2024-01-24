export type INotifBriVa = {
  va_numbers: Vanumber[];
  transaction_time: string;
  transaction_status: "capture"|"settlement"|"pending"|"deny"|"cancel"|"expire"|"failure"|"refund"|"partial_refund"|"authorize";
  transaction_id: string;
  status_message: string;
  status_code: string;
  signature_key: string;
  settlement_time: string;
  payment_type: string;
  payment_amounts: any[];
  order_id: string;
  merchant_id: string;
  gross_amount: string;
  fraud_status: "accept"|"deny";
  currency: string;
};

interface Vanumber {
  va_number: string;
  bank: string;
}
