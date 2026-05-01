const store_id = process.env.SSLCOMMERZ_STORE_ID || "testbox";
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD || "qwerty";
const is_live = process.env.SSLCOMMERZ_IS_SANDBOX !== "true";

const baseURL = is_live 
  ? "https://securepay.sslcommerz.com" 
  : "https://sandbox.sslcommerz.com";

export interface SSLCommerzPaymentData {
  total_amount: number;
  currency: string;
  tran_id: string;
  success_url: string;
  fail_url: string;
  cancel_url: string;
  ipn_url: string;
  shipping_method: string;
  product_name: string;
  product_category: string;
  product_profile: string;
  cus_name: string;
  cus_email: string;
  cus_add1: string;
  cus_city: string;
  cus_postcode: string;
  cus_country: string;
  cus_phone: string;
  ship_name: string;
  ship_add1: string;
  ship_city: string;
  ship_postcode: string;
  ship_country: string;
  multi_card_name?: string;
}

export async function initPayment(data: SSLCommerzPaymentData) {
  const payload = new URLSearchParams({
    store_id,
    store_passwd,
    ...data,
    total_amount: data.total_amount.toString(),
  });

  const response = await fetch(`${baseURL}/gwprocess/v4/api.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: payload.toString(),
  });

  const apiResponse = await response.json();
  return apiResponse;
}

export async function validateTransaction(val_id: string) {
  const url = new URL(`${baseURL}/validator/api/validationserverAPI.php`);
  url.searchParams.append("val_id", val_id);
  url.searchParams.append("store_id", store_id);
  url.searchParams.append("store_passwd", store_passwd);
  url.searchParams.append("format", "json");

  const response = await fetch(url.toString(), {
    method: "GET",
  });

  const data = await response.json();
  return data;
}
