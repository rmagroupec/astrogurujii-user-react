import axios from "axios";

const API_BASE_URL = "https://admin.astrogurujii.com";

export const call_initiate = async (payload: {
  astrologer_id: string;
  call_type: string;
  fb_channel_id: string;
  kundli?: any;
}) => {
  const token = localStorage.getItem("token");
  
  const response = await axios.post(
    `${API_BASE_URL}/user_api/call_initiate`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  
  return response.data;
};