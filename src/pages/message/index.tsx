import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Avatar, Button, Card, Empty, List, message } from 'antd';
import ClientQtCode from '@/components/clientQrCode';
import PageWrapper from '@/components/pageWrapper';
import UserInfo from '@/components/userInfo';
import { changeLtGt, formatDate } from '@/utils';
import useEventBus from '@/utils/event-bus';
import useHttpRequest from '@/utils/request';
import { AppState } from '@/store/store';
import { authorType } from '../detail';
import './index.scss';

interface replyType {
  content: string;
  create_at: string;
  id: string;
  ups: string[];
}

interface topicType {
  id: string;
  last_reply_at: string;
  title: string;
}

interface messagesItemType {
  author: authorType;
  create_at: string;
  has_read: boolean;
  id: string;
  reply: replyType;
  topic: topicType;
  type: string;
}

interface messagesType {
  has_read_messages: messagesItemType[];
  hasnot_read_messages: messagesItemType[];
}

const Message: NextPage = () => {
  const token = useSelector((state: AppState) => state.user.token);
  // 列表数据获取
  const { isLoading, adornUrl, httpRequest } = useHttpRequest();
  const [messageData, setMessageData] = useState<messagesType>();
  const getData = () => {
    httpRequest({
      url: adornUrl(`/api/v1/messages`),
      method: 'get',
      params: {
        accesstoken: token,
        mdrender: true,
      },
    })
      .then(({ data }) => {
        data.data.has_read_messages.forEach((item: messagesItemType) => {
          item.reply.content = changeLtGt(item.reply.content);
        });
        data.data.hasnot_read_messages.forEach((item: messagesItemType) => {
          item.reply.content = changeLtGt(item.reply.content);
        });
        setMessageData(data.data);
      })
      .catch((e: any) => {
        message.error('请求失败');
        console.error(e);
      });
  };

  useEffect(() => {
    if (token) {
      getData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // 标记消息已读
  const { httpRequest: readHttpRequest } = useHttpRequest();
  const [event] = useEventBus();
  const readAll = () => {
    readHttpRequest({
      url: adornUrl(`/api/v1/message/mark_all`),
      method: 'post',
      params: {
        accesstoken: token,
      },
    })
      .then(() => {
        event.emit('read-msg');
        getData();
      })
      .catch((e) => {
        message.error('请求失败');
        console.error(e);
      });
  };
  const readOne = (id: string) => {
    readHttpRequest({
      url: adornUrl(`/api/v1/message/mark_one/${id}`),
      method: 'post',
      params: {
        accesstoken: token,
      },
    })
      .then(() => {
        event.emit('read-msg');
        getData();
      })
      .catch((e) => {
        message.error('请求失败');
        console.error(e);
      });
  };

  return (
    <PageWrapper
      right={
        <>
          <UserInfo />
          <ClientQtCode />
        </>
      }
    >
      <>
        <Card
          className="message-card"
          extra={
            messageData?.hasnot_read_messages &&
            messageData?.hasnot_read_messages.length > 0 ? (
              <Button type="primary" onClick={readAll} loading={isLoading}>
                全部已读
              </Button>
            ) : (
              ''
            )
          }
          title="未读信息"
        >
          <List
            itemLayout="vertical"
            size="small"
            loading={isLoading}
            locale={{ emptyText: <Empty /> }}
            dataSource={messageData?.hasnot_read_messages}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar src={item.author.avatar_url}>
                      {item.author.loginname}
                    </Avatar>
                  }
                  title={
                    <div>
                      <div className="message-title">
                        {item.author.loginname + '回复了您的话题'}
                      </div>
                      <Button
                        className="message-button"
                        onClick={() => readOne(item.id)}
                        type="primary"
                        loading={isLoading}
                      >
                        已读
                      </Button>
                    </div>
                  }
                  description={formatDate(item.create_at, 'yyyy-MM-dd')}
                />
                <div
                  className="topic-content"
                  dangerouslySetInnerHTML={{ __html: item.reply.content ?? '' }}
                ></div>
                <div className="message-topic-title">
                  话题：{item.topic.title}
                </div>
              </List.Item>
            )}
          />
        </Card>
        <Card className="message-card readed-card" title="已读信息">
          <List
            itemLayout="vertical"
            size="small"
            locale={{ emptyText: <Empty /> }}
            loading={isLoading}
            dataSource={messageData?.has_read_messages}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar src={item.author.avatar_url}>
                      {item.author.loginname}
                    </Avatar>
                  }
                  title={item.author.loginname + '回复了您的话题'}
                  description={formatDate(item.create_at, 'yyyy-MM-dd')}
                />
                <div
                  className="topic-content"
                  dangerouslySetInnerHTML={{ __html: item.reply.content ?? '' }}
                ></div>
                <div className="message-topic-title">
                  话题：{item.topic.title}
                </div>
              </List.Item>
            )}
          />
        </Card>
      </>
    </PageWrapper>
  );
};

export default Message;
