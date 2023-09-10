import { Card } from 'antd';
import { FunctionComponent } from 'react';
import './index.scss';

const ClientQtCode: FunctionComponent = () => {
  return (
    <Card title="客户端二维码" className="client-qt-code-card">
      <img
        className="qt-code"
        alt="二维码"
        src="https://static.cnodejs.org/FtG0YVgQ6iginiLpf9W4_ShjiLfU"
      ></img>
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
