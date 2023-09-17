import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { Avatar, Card, Empty, List } from 'antd';
import { userDataType } from '@/store/reducers/user';
import { AppState } from '@/store/store';
import './index.scss';

interface UserInfoProps {
  isLoading?: boolean;
  userInfo?: userDataType;
  isTopicsRepliesList?: boolean;
}

const UserInfo: NextPage<UserInfoProps> = ({
  isLoading,
  userInfo,
  isTopicsRepliesList = true,
}) => {
  const token = useSelector((state: AppState) => state.user.token);
  const userData = useSelector((state: AppState) => state.user.userData);
  const user = userInfo ?? userData;
  const history = useRouter();

  // 前往用户详情页
  const gotoUserDetail = () => {
    history.push(`/user/${user?.loginname}`);
  };

  return (
    <>
      {token || userInfo ? (
        <Card
          title=""
          className="user-info-card is-Can-Click"
          loading={isLoading}
          onClick={gotoUserDetail}
        >
          <div>
            <Avatar shape="square" size="large" src={user?.avatar_url}>
              {user?.loginname}
            </Avatar>
            <span className="user-name">{user?.loginname}</span>
          </div>
          {user?.score && (
            <div className="user-score">积分：{user?.score || ''}</div>
          )}
        </Card>
      ) : (
        <Card title="CNode：Node.js专业中文社区" className="user-info-card">
          <span className="not-bottom">当前为游客状态，您可以 </span>
          <Link href="/login">登录</Link>
        </Card>
      )}
      {isTopicsRepliesList && token && user?.recent_topics ? (
        <Card
          title="我的主题"
          className="user-info-card no-padding-card"
          loading={isLoading}
        >
          <List
            size="small"
            locale={{ emptyText: <Empty /> }}
            dataSource={user?.recent_topics}
            renderItem={(item) => <List.Item>{item.title}</List.Item>}
          />
        </Card>
      ) : (
        ''
      )}
      {isTopicsRepliesList && token && user?.recent_replies ? (
        <Card
          title="我的回复"
          className="user-info-card no-padding-card"
          loading={isLoading}
        >
          <List
            size="small"
            locale={{ emptyText: <Empty /> }}
            dataSource={user?.recent_replies}
            renderItem={(item) => <List.Item>{item.title}</List.Item>}
          />
        </Card>
      ) : (
        ''
      )}
    </>
  );
};

export default UserInfo;
