import axiosInstance from './axiosInstance';

export const generatePaymentLink = async (subscriptionId: string) => {
  const response = await axiosInstance.post<{ data: { paymentLinkUrl: string } }>(
    `/payments/generate-link/${subscriptionId}`
  );
  return response.data.data; // Extracting data from { success, data, message }
};

export const getMyPaymentHistory = async () => {
  const response = await axiosInstance.get('/payments/history/my-history');
  return response.data.data; // Extracting data from { success, data, message }
};
