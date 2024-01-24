export type INotifCard = {
  transaction_time: string;
  transaction_status: "capture"|"settlement"|"pending"|"deny"|"cancel"|"expire"|"failure"|"refund"|"partial_refund"|"authorize";
  transaction_id: string;
  status_message: string;
  status_code: string;
  signature_key: string;
  payment_type: string;
  order_id: string;
  merchant_id: string;
  masked_card: string;
  gross_amount: string;
  fraud_status: "accept"|"deny";
  eci: string;
  currency: string;
  channel_response_message: string;
  channel_response_code: string;
  card_type: string;
  bank: string;
  approval_code: string;
}