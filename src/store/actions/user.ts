import { UserState, simpleUserDataType, userDataType } from "../reducers/user";

// 更新登录状态
export const updateToken = (state: UserState, action: { token: string; }) => {
  state.token = action.token
};

// 更新用户简单个人信息
export const updateSimpleUserData = (state: UserState, action: { simpleUserData: simpleUserDataType }) => {
  state.simpleUserData = action.simpleUserData
};

// 更新用户个人信息
export const updateUserData = (state: UserState, action: { userData: userDataType }) => {
  state.userData = action.userData
};

// 更新数据加载状态
export const updateLoading = (state: UserState, action: { isLoading: boolean }) => {
  state.isLoading = action.isLoading
};