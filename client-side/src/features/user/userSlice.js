import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {
      id_user: "",
      store_name: "",
      username: "",
      email: "",
      phone_number: "",
    },
  },
  reducers: {
    setUser: (state, action) => {
      //   console.log("action", action);
      state.user = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
