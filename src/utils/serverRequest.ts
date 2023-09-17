import axios from "axios";

// 处理请求链接
export const adornUrl = (actionName: string) => {
  return process.env.NEXT_PUBLIC_API_BASE_URL + actionName;
};

// 请求方法创建
export const httpRequest = axios.create({
  timeout: 1000 * 60,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
});

// 请求拦截
httpRequest.interceptors.request.use((config: any) => {
  return config;
});

// 响应拦截
httpRequest.interceptors.response.use(
  (response) => {
    if (response && response.status === 403) {
      // 403, token失效
      console.error('登录失败');
    } else if (response && response.status !== 200) {
      // 403, token失效
      console.error('请求失败');
    }
    return response;
  },
  (error: any) => {
    return Promise.reject(error);
  },
);