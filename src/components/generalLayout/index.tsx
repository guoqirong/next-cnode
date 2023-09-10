'use client'; // 如果是在 Pages Router 中使用，则不需要加这行
import { FunctionComponent, ReactNode } from "react";
import { FloatButton, Layout } from "antd";
import { Content } from "antd/lib/layout/layout";
import { CaretUpOutlined } from '@ant-design/icons';
import HeaderComp from "../header";
import FooterComp from "../footer";
import "./index.scss";

interface GeneralLayoutProps {
  children: ReactNode;
}
 
const GeneralLayout: FunctionComponent<GeneralLayoutProps> = ({children}) => {
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