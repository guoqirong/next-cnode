import { NextPage } from 'next';
import Image from 'next/image';
import { Card } from 'antd';
import './index.scss';

const ClientQtCode: NextPage = () => {
  return (
    <Card title="客户端二维码" className="client-qt-code-card">
      <Image
        height={500}
        width={500}
        className="qt-code"
        alt="二维码"
        src="https://static.cnodejs.org/FtG0YVgQ6iginiLpf9W4_ShjiLfU"
      />
      <div className="footer-text">
        <a
          href="https://github.com/soliury/noder-react-native"
          rel="noopener noreferrer"
          target="_blank"
        >
          客户端源码地址
        </a>
      </div>
    </Card>
  );
};

export default ClientQtCode;
