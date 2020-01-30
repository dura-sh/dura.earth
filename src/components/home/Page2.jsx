/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import ScrollOverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import QueueAnim from 'rc-queue-anim';
import { Input, Button, Form } from 'antd';

export default class Page2 extends React.Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();
  }

  handleSubmit = event => {
    event.preventDefault();
  };

  render() {
    return (
      <ScrollOverPack id="#claim" className="home-page page2">
        <div className="content-wrapper">
          <QueueAnim className="text-wrapper-bottom" key="text" leaveReverse type="bottom">
            <div className="title-line-wrapper page2-line">
              <div className="title-line" />
            </div>
            <h2>
              Claim your <span>durable identity</span> today
            </h2>
            <p key="p">How do you want others to identify you?</p>
            <Form onSubmit={this.handleSubmit} className="claim-id-form">
              <Form.Item>
                <Input id="duraid" ref={this.input} />
              </Form.Item>
              <Button type="htmlSubmit" size="large" icon="check" className="claim-id-btn">
                be you
              </Button>
            </Form>
          </QueueAnim>
        </div>
      </ScrollOverPack>
    );
  }
}
