import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Form, Input, message, Select } from 'antd';
import { TinyMCE } from 'tinymce';
import ClientQtCode from '@/components/clientQrCode';
import PageWrapper from '@/components/pageWrapper';
import UserInfo from '@/components/userInfo';
import { topicTypeList } from '@/constant';
import { Editor } from '@tinymce/tinymce-react';
import useHttpRequest from '@/utils/request';
import { changeLtGt } from '@/utils';
import PageHeader from '@/components/pageHeader';
import { AppState } from '@/store/store';
import './index.scss';

interface NextPageProps {
  id: string;
}

const AddOrEditTopic: NextPage<NextPageProps> = ({ id }) => {
  const token = useSelector((state: AppState) => state.user.token);
  const dispatch = useDispatch();
  // 富文本初始配置项
  const init: Parameters<TinyMCE['init']>[0] & {
    selector?: undefined;
    target?: undefined;
  } = {
    height: 500, //富文本高度
    width: '100%', //富文本宽度
    // language_url: './tinymce-langs/zh_CN.js', //中文包
    language: 'zh_CN', //中文
    browser_spellcheck: true, // 拼写检查
    branding: false, // 去水印
    elementpath: true, //禁用编辑器底部的状态栏
    statusbar: true, // 隐藏编辑器底部的状态栏
    paste_data_images: true, // 是否允许粘贴图像
    menubar: false, // 隐藏最上方menu
    fontsize_formats: '14px 16px 18px 20px 24px 26px 28px 30px 32px 36px', //字体大小
    font_formats:
      '微软雅黑=Microsoft YaHei,Helvetica Neue;PingFang SC;sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun;serifsans-serif;Terminal=terminal;monaco;Times New Roman=times new roman;times', //字体
    file_picker_types: 'image',
    images_upload_credentials: false,
    plugins: [
      'advlist autolink lists link image charmap print preview anchor',
      'searchreplace visualblocks code fullscreen',
      'insertdatetime media table paste code help wordcount',
    ],
    toolbar:
      'fontselect fontsizeselect link lineheight forecolor backcolor bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | image quicklink h2 h3 blockquote table numlist bullist preview fullscreen',
  };
  const [form] = Form.useForm();
  const [content, setContent] = useState('');
  const history = useRouter();

  // 数据获取
  const { isLoading, adornUrl, httpRequest } = useHttpRequest();
  const getData = () => {
    httpRequest({
      url: adornUrl(`/api/v1/topic/${id}`),
      method: 'get',
      params: {
        mdrender: true,
        accesstoken: token,
      },
    })
      .then(({ data }) => {
        data.data.content = changeLtGt(data.data.content);
        setContent(data.data.content);
        form.setFieldsValue({
          topic_id: data.data.id,
          title: data.data.title,
          content: data.data.content,
          tab: data.data.tab,
        });
      })
      .catch((e) => {
        message.error('请求失败');
        console.error(e);
      });
  };
  useEffect(() => {
    if (id !== '0') getData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 返回
  const goback = () => {
    if (id === '0') {
      dispatch({
        type: 'global/updateListParm',
        payload: history.query?.listParm,
      });
      history.push('/');
    } else if (history.query?.userName) {
      history.push({
        pathname: `/detail`,
        query: {
          id: id,
          userName: history.query?.userName ?? '',
        },
      });
    } else {
      history.push({
        pathname: `/detail`,
        query: {
          id: id,
          listParm: history.query?.listParm ?? '',
        },
      });
    }
  };

  // 添加或修改请求
  const { isLoading: IsSubmitLoading, httpRequest: submitHttpRequest } =
    useHttpRequest();
  const onFinish = (values: any) => {
    submitHttpRequest({
      url: adornUrl(
        `/api/v1/topics${
          location.pathname.includes('add-topic') ? '' : '/update'
        }`,
      ),
      method: 'post',
      data: {
        topic_id: id,
        title: values.title,
        content: values.content,
        tab: 'dev',
        accesstoken: token,
      },
    })
      .then(({ data }) => {
        if (data?.success) {
          message.success(
            location.pathname.includes('add-topic') ? '发布成功' : '修改成功',
          );
          goback();
        }
      })
      .catch((e) => {
        message.error(
          location.pathname.includes('add-topic') ? '发布失败' : '修改失败',
        );
        console.error(e);
      });
  };

  return (
    <PageWrapper
      right={
        <>
          <UserInfo isTopicsRepliesList={false} />
          <ClientQtCode />
        </>
      }
    >
      <Card
        size="small"
        className="edit-card"
        loading={isLoading}
        cover={
          <PageHeader
            className="site-page-header"
            onBack={goback}
            title="发布话题"
          />
        }
      >
        <Form
          className="edit-topic-form"
          layout="vertical"
          wrapperCol={{ offset: 0, span: 24 }}
          form={form}
          onFinish={onFinish}
        >
          <Form.Item
            name="tab"
            label="版块"
            rules={[
              {
                required: true,
                message: '请选择版块',
                type: 'string',
              },
            ]}
          >
            <Select style={{ width: 214 }}>
              {topicTypeList
                .filter((item) => !['all', 'good'].includes(item.key))
                .map((opt) => {
                  return (
                    <Select.Option value={opt.key} key={opt.key}>
                      {opt.name}
                    </Select.Option>
                  );
                })}
            </Select>
          </Form.Item>
          <Form.Item
            name="title"
            label="标题"
            rules={[
              {
                required: true,
                message: '请输入标题',
                type: 'string',
              },
            ]}
          >
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item
            name="content"
            label="内容"
            getValueFromEvent={() => {
              return form.getFieldValue('content');
            }}
            getValueProps={(value) => {
              return value;
            }}
            rules={[
              {
                required: true,
                message: '请输入内容',
              },
            ]}
          >
            {(id === '0' || content) && (
              <Editor
                apiKey="mh2f2ffdlr2zzaky3yk52tx8rtxrxnbt1a6p7p7jx96hy70r"
                init={init}
                value={content}
                onEditorChange={(v) => {
                  setContent(v);
                  form.setFieldsValue({
                    content: v,
                  });
                }}
              ></Editor>
            )}
          </Form.Item>
          <Form.Item className="is-last-item">
            <Button loading={IsSubmitLoading} type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </PageWrapper>
  );
};

export async function getServerSideProps(ctx: any) {
  return { props: { id: ctx.params.id } }
}

export default AddOrEditTopic;
