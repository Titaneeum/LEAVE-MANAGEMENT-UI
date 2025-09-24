/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export const GetAllTimeOff = async () => {
  try {
    const response = await axios({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      url: "/time-off-request/all",
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (e) {
    throw e;
  }
};

export const AddTimeOff = async (data: Record<string, any>) => {
  try {
    const response = await axios({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      url: "/time-off-request",
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      data,
    });
    return response.data;
  } catch (e) {
    throw e;
  }
};

export const UpdateTimeOff = async (data: Record<string, any>) => {
  try {
    const response = await axios({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      url: "/time-off-request/26",
      method: "PATCH",
      headers: {
        Accept: "application/json",
      },
      data,
    });
    return response.data;
  } catch (e) {
    throw e;
  }
};

export const DeleteTimeOff = async (id: number) => {
  try {
    const response = await axios({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      url: `/time-off-request/${id}`,
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (e) {
    throw e;
  }
};
