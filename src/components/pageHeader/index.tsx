import { NextPage } from "next";
import { ArrowLeftOutlined } from '@ant-design/icons';
import "./index.scss";

interface PageHeaderProps {
  className?: string;
  onBack?: false | (() => void);
  title: string; 
}
 
const PageHeader: NextPage<PageHeaderProps> = ({
  className,
  onBack = false,
  title
}) => {
  return <div className={`page-header-wrapper${className ? ' ' + className : ''}`}>
    {onBack && <ArrowLeftOutlined size={16} onClick={() => onBack()}/>}
    <div className="page-title">{title}</div>
  </div>;
}
 
export default PageHeader;