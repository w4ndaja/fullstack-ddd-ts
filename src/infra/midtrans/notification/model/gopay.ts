export type INotifGopay = {
  transaction_time: string;
  transaction_status: "capture"|"settlement"|"pending"|"deny"|"cancel"|"expire"|"failure"|"refund"|"partial_refund"|"authorize";
  transaction_id: string;
  status_message: string;
  status_code: string;
  signature_key: string;
  settlement_time: string;
  payment_type: string;
  order_id: string;
  merchant_id: string;
  gross_amount: string;
  fraud_status: "accept"|"deny";
  currency: string;
};
