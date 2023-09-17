import { NextPage } from 'next';
import { Footer } from 'antd/lib/layout/layout';
import './index.scss';

const FooterComp: NextPage = () => {
  return (
    <Footer className="footer-wapper">
      <div>
        CNode 社区为国内最专业的 Node.js 开源技术社区，致力于 Node.js
        的技术研究。
      </div>
      <div>CNode 社区版权归xxxxxx所有</div>
    </Footer>
  );
};

export default FooterComp;
