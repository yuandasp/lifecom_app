import { createSlice } from "@reduxjs/toolkit";

export const contentSlice = createSlice({
  name: "content",
  initialState: {
    contents: [],
    likes: [],
    contentDetail: {},
  },
  reducers: {
    setContent: (state, action) => {
      state.contents = action.payload;
    },
    setContentDetail: (state, action) => {
      state.contentDetail = action.payload;
    },
  },
});

export const { setContent, setLikes, setContentDetail } = contentSlice.actions;

export default contentSlice.reducer;
