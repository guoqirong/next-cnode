import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Avatar, Card } from 'antd';
import ClientQtCode from '@/components/clientQrCode';
import ListComp from '@/components/list';
import PageWrapper from '@/components/pageWrapper';
import UserInfo from '@/components/userInfo';
import useHttpRequest from '@/utils/request';
import { recentDataItemType, userDataType } from '@/store/reducers/user';
import { adornUrl, httpRequest } from '@/utils/serverRequest';
import './index.scss';

interface UserProps {
  userData: userDataType,
}

const User: NextPage<UserProps> = ({userData}) => {
  const history = useRouter();
  // 列表数据获取
  const { isLoading, adornUrl, httpRequest } = useHttpRequest();

  // 查看详情
  const goDetail = (data: recentDataItemType) => {
    history.push({
      pathname: '/detail',
      query: {
        id: data.id,
        userName: history.query.userName,
      },
    });
  };

  return (
    <PageWrapper
      right={
        <>
          <UserInfo isTopicsRepliesList={false} userInfo={userData} />
          <ClientQtCode />
        </>
      }
    >
      <>
        <Card title="基本信息" className="user-detail-card" loading={isLoading}>
          <div>
            <Avatar shape="square" size="large" src={userData?.avatar_url}>
              {userData?.loginname}
            </Avatar>
            <span className="user-name">{userData?.loginname}</span>
          </div>
          {userData?.score && (
            <div className="user-score">积分：{userData?.score || ''}</div>
          )}
        </Card>
        <Card
          title="我的话题"
          className="user-detail-card no-padding"
          loading={isLoading}
        >
          <ListComp
            dataList={(userData && userData.recent_topics) || []}
            isSimpleItem={true}
            onItemClick={goDetail}
          />
        </Card>
        <Card
          title="我的参与"
          className="user-detail-card no-padding is-last"
          loading={isLoading}
        >
          <ListComp
            dataList={(userData && userData.recent_replies) || []}
            isSimpleItem={true}
            onItemClick={goDetail}
          />
        </Card>
      </>
    </PageWrapper>
  );
};

export async function getServerSideProps(ctx: any) {
  const res = await  httpRequest({
    url: adornUrl(`/api/v1/user/${ctx.query.userName}`),
    method: 'get',
  });
  if (res?.data?.success) {
    return { props: { userData: res?.data.data } };
  } else {
    return { props: {} };
  }
}


export default User;
