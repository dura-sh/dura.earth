import React from 'react';
import ScrollOverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import QueueAnim from 'rc-queue-anim';
import { Input, Button, Form } from 'antd';
import classNames from 'classnames';
import styles from './Page5.less';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
export default class Page5 extends React.Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();
  }

  handleSubmit = event => {
    event.preventDefault();
  };

  render() {
    return (
      <ScrollOverPack id="page5" className={classNames(styles.contentWrapper, styles.pageInfo)}>
        <QueueAnim className={styles.textWrapperBottom} key="text" leaveReverse type="bottom">
          <p key="p">How do you want others to identify you?</p>
          <Form onSubmit={this.handleSubmit} style={{ marginLeft: '35%', marginRight: '35%' }}>
            <Form.Item xs={24} {...formItemLayout} label="duraid">
              <Input id="duraid" ref={this.input} />
            </Form.Item>
            <Button type="htmlSubmit" size="large" icon="check">
              be you
            </Button>
          </Form>
        </QueueAnim>
      </ScrollOverPack>
    );
  }
}
