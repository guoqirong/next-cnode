import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Button, Card, message, Pagination } from 'antd';
import { useSelector } from 'react-redux';
import ClientQtCode from '@/components/clientQrCode';
import ListComp from '@/components/list';
import { topicListItemType } from '@/components/listItem';
import PageWrapper from '@/components/pageWrapper';
import UserInfo from '@/components/userInfo';
import useHttpRequest, { resDataType } from '@/utils/request';
import { adornUrl, httpRequest } from '@/utils/serverRequest';
import { AxiosResponse } from 'axios';
import { topicTypeList } from '@/constant';
import { AppState } from '@/store/store';
import './index.scss';

interface IndexPageProps {
  list?: topicListItemType[];
}

const IndexPage: NextPage<IndexPageProps> = ({ list }) => {
  interface getTopicListType {
    page?: number;
    tab?: string;
    limit?: number;
    mdrender?: boolean;
  }
  const history = useRouter();
  const listParm = useSelector((state: AppState) => state.user.listParm);
  const [activeTypeName, setActiveTypeName] = useState<string>('all'); // 类别
  const [page, setPage] = useState<number>(1); // 页码
  const [limit, setLimit] = useState<number>(20); // 页码显示条数
  // 列表数据获取
  const { isLoading, adornUrl, httpRequest } = useHttpRequest();
  const [listData, setListData] = useState<topicListItemType[]>([]);
  const getTopicList = (data?: getTopicListType) => {
    httpRequest({
      url: adornUrl('/api/v1/topics'),
      method: 'get',
      params: {
        page: page ?? 1,
        tab: activeTypeName ?? 'all',
        limit: limit ?? 20,
        mdrender: false,
        ...data,
      },
    })
      .then((res: AxiosResponse<resDataType<topicListItemType[]>>) => {
        if (res?.data?.success) {
          setListData(res?.data.data ?? []);
        }
      })
      .catch((e) => {
        message.error('请求失败');
        console.error(e);
      });
  };

  useEffect(() => {
    const [tab, pageNum, limitNum] = listParm?.split('|') ?? [];
    if (tab && pageNum && limitNum) {
      setActiveTypeName(tab);
      setPage(Number(pageNum));
      setLimit(Number(limitNum));
      getTopicList({
        page: Number(pageNum),
        tab: tab,
        limit: Number(limitNum),
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list]);

  // 发布话题
  const addTopic = () => {
    history.push({
      pathname: '/addOrEditTopic/0',
      query: {
        listParm: `${activeTypeName}|${page}|${limit}`,
      },
    });
  };

  // 查看详情
  const goDetail = (data: topicListItemType) => {
    history.push({
      pathname: '/detail',
      query: {
        id: data.id,
        listParm: `${activeTypeName}|${page}|${limit}`,
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
        <Card
          size="small"
          className="list-card"
          tabList={topicTypeList.map((item) => {
            return {
              key: item.key,
              tab: item.name,
            };
          })}
          activeTabKey={activeTypeName}
          onTabChange={(key) => {
            setActiveTypeName(key);
            setPage(1);
            getTopicList({
              tab: key,
              page: 1,
            });
          }}
          tabBarExtraContent={
            <Button type="primary" onClick={addTopic}>
              发布话题
            </Button>
          }
        >
          <ListComp
            dataList={listData.length > 0 ? listData : (list ?? [])}
            listLoading={isLoading}
            footer={
              <Pagination
                total={400}
                showSizeChanger={false}
                current={page}
                defaultPageSize={limit}
                onChange={(page, pageSize) => {
                  setPage(page);
                  setLimit(pageSize);
                  getTopicList({
                    page: page,
                    limit: pageSize,
                  });
                }}
              />
            }
            onItemClick={goDetail}
          />
        </Card>
      </>
    </PageWrapper>
  );
};

// // getInitialProps 获取数据 会根据情况在服务端或者客户端执，有些执行会报错
// IndexPage.getInitialProps = async (ctx: any) => {
//   const [tab, pageNum, limitNum] = ctx.query?.listParm?.split('|') ?? [];
//   const res = await httpRequest({
//     url: adornUrl('/api/v1/topics'),
//     method: 'get',
//     params: {
//       page: 1,
//       tab: 'all',
//       limit: 20,
//       mdrender: false,
//     },
//   });
//   if (res?.data?.success) {
//     return { list: res?.data.data ?? [] };
//   } else {
//     return {};
//   }
// }

export async function getServerSideProps(ctx: any) {
  const [tab, pageNum, limitNum] = ctx.query?.listParm?.split('|') ?? [];
  const res = await httpRequest({
    url: adornUrl('/api/v1/topics'),
    method: 'get',
    params: {
      page: pageNum ?? 1,
      tab: tab ?? 'all',
      limit: limitNum ?? 20,
      mdrender: false,
    },
  });
  if (res?.data?.success) {
    return { props: { list: res?.data.data ?? [] } };
  } else {
    return { props: {} };
  }
}

export default IndexPage;
