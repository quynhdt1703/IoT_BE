import { deleteAsyncWithToken, getAsyncWithToken } from "../constant/request";

export async function getUser() {
  const url = process.env.REACT_APP_BACK_END + "/users";
  const response = await getAsyncWithToken(url);
  return response?.data || [];
}

export async function deleteUser(idUser) {
  const url = process.env.REACT_APP_BACK_END + "/users/" + idUser;
  const response = await deleteAsyncWithToken(url);
  return response?.data || [];
}
