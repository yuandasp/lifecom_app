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
    contentUser: [],
  },
  reducers: {
    setUser: (state, action) => {
      //   console.log("action", action);
      state.user = action.payload;
    },
    setContentUser: (state, action) => {
      state.contentUser = action.payload;
    },
  },
});

export const { setUser, setContentUser } = userSlice.actions;

export default userSlice.reducer;
