import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { Button, Card, Form, Input, message } from 'antd';
import { setLocalStorage } from '@/utils';
import useHttpRequest from '@/utils/request';
import './index.scss';

const Login: NextPage = () => {
  const { isLoading, adornUrl, httpRequest } = useHttpRequest();
  const history = useRouter();
  const dispatch = useDispatch();

  // 表单提交
  const onFinish = (values: any) => {
    httpRequest({
      url: adornUrl(`/api/v1/accesstoken`),
      method: 'post',
      data: {
        accesstoken: values.token,
      },
    })
      .then(({ data }) => {
        setLocalStorage('loginname', data.loginname);
        setLocalStorage('token', values.token);
        dispatch({
          type: 'user/updateToken',
          payload: values.token,
        });
        dispatch({
          type: 'user/updateSimpleUserData',
          payload: data,
        });
        history.push('/');
      })
      .catch((e) => {
        message.error('登录失败');
        console.error(e);
      });
  };

  // 取消离开登录页面
  const onCancel = () => {
    history.back();
  };

  return (
    <div className="login-wrapper">
      <span className="login-slogan">欢迎来到 CNode 中文社区</span>
      <Card title="token 登录" className="login-card">
        <Form
          className="login-form"
          wrapperCol={{ offset: 0, span: 24 }}
          onFinish={onFinish}
        >
          <Form.Item
            name="token"
            label=""
            rules={[
              {
                required: true,
                message: '请输入token校验',
                type: 'string',
              },
            ]}
          >
            <Input placeholder="accesstoken 登录校验" autoComplete="off" />
          </Form.Item>
          <Form.Item className="is-last-item">
            <Button
              loading={isLoading}
              type="primary"
              htmlType="submit"
              style={{ width: '100%' }}
            >
              登录
            </Button>
            <Button
              style={{ width: '100%' }}
              onClick={onCancel}
            >
              取消
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
