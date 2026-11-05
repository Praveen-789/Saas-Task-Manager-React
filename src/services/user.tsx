import API from "./api";

export const getUsers = async (search = "", page = 1, limit = 5) => {
  const res = await API.get("/user/getUsers", {
    params: { name: search, page, limit },
  });

  return res.data;
};

