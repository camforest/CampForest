import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UserState = {
  userId: number,
  nickname: string,
  profileImage: string,
  similarUsers: number[],
  isLoggedIn: boolean
}

const initialState: UserState = {
  userId: 0,
  nickname: '',
  profileImage: '',
  similarUsers: [],
  isLoggedIn: false
}

const userSlice = createSlice({
  name: 'userStore',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ userId: number; nickname: string; profileImage: string; similarUsers: number[]}>) => {
      state.userId = action.payload.userId;
      state.nickname = action.payload.nickname;
      state.profileImage = action.payload.profileImage;
      state.similarUsers = action.payload.similarUsers;
      state.isLoggedIn = true;
    },
    clearUser: (state) => {
      state.userId = 0;
      state.nickname = '';
      state.profileImage = '';
      state.isLoggedIn = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;