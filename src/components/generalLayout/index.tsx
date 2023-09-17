// 'use client'; // 如果是在 Pages Router 中使用，则不需要加这行
import { NextPage } from "next";
import { ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FloatButton, Layout, message } from "antd";
import { Content } from "antd/lib/layout/layout";
import { CaretUpOutlined } from '@ant-design/icons';
import HeaderComp from "../header";
import FooterComp from "../footer";
import useHttpRequest from "@/utils/request";
import { AppState } from "@/store/store";
import "./index.scss";

interface GeneralLayoutProps {
  children: ReactNode;
}
 
const GeneralLayout: NextPage<GeneralLayoutProps> = ({children}) => {
  const token = useSelector((state: AppState) => state.user.token);
  const simpleUserData = useSelector((state: AppState) => state.user.simpleUserData)
  const dispatch = useDispatch();
  // 获取用户信息
  const { isLoading, adornUrl, httpRequest } = useHttpRequest();
  const getUserData = (loginname: string) => {
    httpRequest({
      url: adornUrl(`/api/v1/user/${loginname}`),
      method: 'get',
    })
      .then(({ data }) => {
        dispatch({
          type: 'user/updateUserData',
          payload: data.data,
        });
      })
      .catch((e) => {
        message.error('请求失败');
        console.error(e);
      });
  };

  // 加载中状态设置
  useEffect(() => {
    dispatch({
      type: 'user/updateLoading',
      payload: isLoading,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  // 根据登录态判断是否需要获取用户信息
  useEffect(() => {
    if (token && simpleUserData?.loginname) {
      getUserData(simpleUserData.loginname);
    } else {
      dispatch({
        type: 'user/updateUserData',
        payload: {},
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simpleUserData, token]);
  
  return (
    <Layout className="components-layout-index">
      <HeaderComp/>
      <Content className="site-layout">{children}</Content>
      <FooterComp />
      <FloatButton.BackTop
        className="back-top-btn"
        visibilityHeight={200}
        target={() => document.getElementById('root') ?? window}
      >
        <CaretUpOutlined />
      </FloatButton.BackTop>
    </Layout>
  );
}
 
export default GeneralLayout;