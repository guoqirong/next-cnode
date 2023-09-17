import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { updateListParm, updateLoading, updateSimpleUserData, updateToken, updateUserData } from "../actions/user";

// Type for our state
export interface UserState {
  token: string;
  simpleUserData: simpleUserDataType | undefined;
  userData: userDataType | undefined;
  isLoading: boolean;
  listParm: string;
}

export interface simpleUserDataType {
  id: string,
  loginname: string,
  avatar_url: string,
}

export interface userDataType {
  avatar_url: string;
  create_at: string;
  githubUsername: string;
  loginname: string;
  recent_replies: recentDataItemType[];
  recent_topics: recentDataItemType[];
  score: number;
}

export interface recentDataItemType {
  author: {
    avatar_url: string;
    loginname: string;
  };
  id: string;
  last_reply_at: string;
  title: string;
}

// Initial state
const initialState: UserState = {
  token: '',
  simpleUserData: undefined,
  userData: undefined,
  isLoading: false,
  listParm: '',
};

// Actual Slice
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {

    // 数据更新actions
    updateToken,
    updateSimpleUserData,
    updateUserData,
    updateLoading,
    updateListParm,

    // Special reducer for hydrating the state. Special case for next-redux-wrapper
    extraReducers: {
      [HYDRATE]: (state: any, action: { payload: any }) => {
        return {
          ...state,
          ...action.payload.user,
        };
      },
    },

  } as any,
});

export default userSlice.reducer;