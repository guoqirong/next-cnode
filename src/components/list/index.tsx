import { NextPage } from 'next';
import { ReactNode } from 'react';
import { Empty, List } from 'antd';
import ListItem, { topicListItemType } from '@/components/listItem';
import { recentDataItemType } from '@/store/reducers/user';

interface ListCompProps {
  dataList: topicListItemType[] | recentDataItemType[];
  isSimpleItem?: boolean;
  listLoading?: boolean;
  onItemClick: Function;
  footer?: ReactNode;
}

const ListComp: NextPage<ListCompProps> = ({
  dataList,
  isSimpleItem = false,
  listLoading,
  footer,
  onItemClick,
}) => {
  return (
    <List
      size="small"
      style={{ width: '100%' }}
      locale={{ emptyText: <Empty /> }}
      dataSource={dataList}
      loading={listLoading}
      footer={footer}
      renderItem={(item) => (
        <ListItem
          topicItem={item}
          isSimpleItem={isSimpleItem}
          onItemClick={onItemClick}
        ></ListItem>
      )}
    ></List>
  );
};

export default ListComp;
