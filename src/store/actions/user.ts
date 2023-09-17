import { UserState, simpleUserDataType, userDataType } from "../reducers/user";

// 更新登录状态
export const updateToken = (state: UserState, action: { payload: string; }) => {
  state.token = action.payload
};

// 更新用户简单个人信息
export const updateSimpleUserData = (state: UserState, action: { payload: simpleUserDataType }) => {
  state.simpleUserData = action.payload
};

// 更新用户个人信息
export const updateUserData = (state: UserState, action: { payload: userDataType }) => {
  state.userData = action.payload
};

// 更新数据加载状态
export const updateLoading = (state: UserState, action: { payload: boolean }) => {
  state.isLoading = action.payload
};

// 首页返回参数
export const updateListParm = (state: UserState, action: { payload: string }) => {
  state.listParm = action.payload;
};