import { NextPage } from 'next';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Card, message } from 'antd';
import ClientQtCode from '@/components/clientQrCode';
import ListComp from '@/components/list';
import { topicListItemType } from '@/components/listItem';
import PageWrapper from '@/components/pageWrapper';
import UserInfo from '@/components/userInfo';
import useHttpRequest from '@/utils/request';
import { AppState } from '@/store/store';
import './index.scss';

const Collect: NextPage = () => {
  const simpleUserData = useSelector((state: AppState) => state.user.simpleUserData);
  const history = useRouter();
  // 列表数据获取
  const { isLoading, adornUrl, httpRequest } = useHttpRequest();
  const [collect, setCollect] = useState<topicListItemType[]>([]);
  const getData = () => {
    if (simpleUserData && simpleUserData.loginname) {
      httpRequest({
        url: adornUrl(`/api/v1/topic_collect/${simpleUserData.loginname}`),
        method: 'get',
      })
        .then(({ data }) => {
          setCollect(data.data);
        })
        .catch((e) => {
          message.error('请求失败');
          console.error(e);
        });
    } else {
      history.push('/index');
    }
  };

  useEffect(() => {
    getData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 查看详情
  const goDetail = (data: topicListItemType) => {
    history.push({
      pathname: '/detail',
      query: {
        id: data.id,
      },
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
        <Card className="collect-card" title="我的收藏">
          <ListComp
            dataList={collect}
            listLoading={isLoading}
            onItemClick={goDetail}
          />
        </Card>
      </>
    </PageWrapper>
  );
};

export default Collect;
