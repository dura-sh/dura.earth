import React from 'react';
import QueueAnim from 'rc-queue-anim';
import { Button } from 'antd';
import { Link } from 'gatsby';
import { FormattedMessage } from 'react-intl';
import './index.less';

function Banner(props) {
  const { isMobile } = props;
  return (
    <div className="banner-wrapper background">
      <QueueAnim className="banner-title-wrapper" type={isMobile ? 'bottom' : 'right'}>
        <div key="line" className="title-line-wrapper">
          <div className="title-line" style={{ transform: 'translateX(-64px)' }} />
        </div>
        <h1 key="h1">Dura.*</h1>
        <p key="content">
          <FormattedMessage id="app.home.slogan" />
        </p>
        <div key="button" className="button-wrapper">
          <a href="#claim" target="_blank" rel="noopener noreferrer">
            <Button type="primary" icon="idcard">
              <FormattedMessage id="app.home.claim" />
            </Button>
          </a>
          <Link to="/docs/welcome-to-a-durable-world">
            <Button style={{ margin: '0 16px' }} type="primary" icon="solution" ghost>
              <FormattedMessage id="app.home.understand" />
            </Button>
          </Link>
        </div>
      </QueueAnim>
    </div>
  );
}

export default Banner;
