/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import Parallax from 'rc-scroll-anim/lib/ScrollParallax';
import QueueAnim from 'rc-queue-anim';
import TweenOne from 'rc-tween-one';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import tv from '../../images/tv.svg';
import health from '../../images/health.svg';
import buzz from '../../images/buzz.svg';
import chat from '../../images/chat.svg';
import money from '../../images/money.svg';
import store from '../../images/store.svg';

const TweenOneGroup = TweenOne.TweenOneGroup;

const implementations = [
  {
    title: ' dura.health',
    content:
      "The durable health gateway for patients, practioneers, and providers alike. Together in one place with sureties for everyone's individual reality.",
    src: health,
    color: '#13C2C2',
    shadowColor: 'rgba(19,194,194,.25)',
  },
  {
    title: 'dura.chat',
    content:
      'The durable communication gateway for peer-to-peer messaging. Private/group messages and voip calls/video conferencing. Privacy sureties from trust in others',
    src: chat,
    color: '#B757D0',
    shadowColor: 'rgba(183, 87, 208, .25)',
  },
  {
    title: 'dura.report',
    content:
      'The durable news aggrregator for your daily digest. Relavent content and recommendation as sureties dervived as your personal buzz center.',
    src: buzz,
    color: '#40bf7c',
    shadowColor: 'rgba(64, 191, 124, .25)',
  },
  {
    title: 'dura.tv',
    content:
      'The durable live streaming platform without all the fluff. Connection is a surety when streams are peer-to-peer using distrubuted voip.',
    src: tv,
    color: '#F5222D',
    shadowColor: 'rgba(245,34,45,.25)',
  },
  {
    title: 'dura.money',
    content:
      "Financial management doesn't have to be done by banks or blockchains. Manage your money, track your spending, and bullish surety in your future.",
    src: money,
    color: '#FA8C16',
    shadowColor: 'rgba(250,140,22,.25)',
  },
  {
    title: 'dura.store',
    content: 'Build on the Dura network',
    src: store,
    color: '#FAAD14',
    shadowColor: 'rgba(250,173,20,.25)',
  },
];

const pointPos = [
  { x: -30, y: -10 },
  { x: 20, y: -20 },
  { x: -65, y: 15 },
  { x: -45, y: 80 },
  { x: 35, y: 5 },
  { x: 50, y: 50, opacity: 0.2 },
];

class Page1 extends React.PureComponent {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      hoverNum: null,
    };
  }

  onMouseOver = i => {
    this.setState({
      hoverNum: i,
    });
  };

  onMouseOut = () => {
    this.setState({
      hoverNum: null,
    });
  };

  getEnter = e => {
    const i = e.index;
    const r = Math.random() * 2 - 1;
    const y = Math.random() * 10 + 5;
    const delay = Math.round(Math.random() * (i * 50));
    return [
      {
        delay,
        opacity: 0.4,
        ...pointPos[e.index],
        ease: 'easeOutBack',
        duration: 300,
      },
      {
        y: r > 0 ? `+=${y}` : `-=${y}`,
        duration: Math.random() * 1000 + 2000,
        yoyo: true,
        repeat: -1,
      },
    ];
  };

  render() {
    const { hoverNum } = this.state;
    const { isMobile } = this.props;
    let children = [[], [], []];
    implementations.forEach((item, i) => {
      const isHover = hoverNum === i;
      const pointChild = [
        'point-0 left',
        'point-0 right',
        'point-ring',
        'point-1',
        'point-2',
        'point-3',
      ].map(className => (
        <TweenOne
          component="i"
          className={className}
          key={className}
          style={{
            background: item.color,
            borderColor: item.color,
          }}
        />
      ));
      const child = (
        <li key={i.toString()}>
          <div
            className="page1-box"
            onMouseEnter={() => {
              this.onMouseOver(i);
            }}
            onMouseLeave={this.onMouseOut}
          >
            <TweenOneGroup
              className="page1-point-wrapper"
              enter={this.getEnter}
              leave={{
                x: 0,
                y: 30,
                opacity: 0,
                duration: 300,
                ease: 'easeInBack',
              }}
              resetStyle={false}
              exclusive
            >
              {(isMobile || isHover) && pointChild}
            </TweenOneGroup>
            <div
              className="page1-image"
              style={{
                boxShadow: `${isHover ? '0 12px 24px' : '0 6px 12px'} ${item.shadowColor}`,
              }}
            >
              <img src={item.src} alt="img" style={i === 4 ? { marginLeft: -15 } : {}} />
            </div>
            <h3>{item.title}</h3>
            <p>{item.content}</p>
          </div>
        </li>
      );
      children[Math.floor(i / 3)].push(child);
    });

    children = children.map((item, i) => (
      <QueueAnim
        className="page1-box-wrapper"
        key={i.toString()}
        type="bottom"
        leaveReverse
        delay={[i * 100, (children.length - 1 - i) * 100]}
        component="ul"
      >
        {item}
      </QueueAnim>
    ));
    return (
      <div className="home-page page1">
        <div className="home-page-wrapper" id="page1-wrapper">
          {!isMobile && (
            <Parallax
              className="page1-bg"
              animation={{
                translateY: 200,
                ease: 'linear',
                playScale: [0, 1.65],
              }}
              location="page1-wrapper"
            >
              dura.*
            </Parallax>
          )}
          <h2>
            Let your <span>individual reality</span> shine as the{' '}
            <a href="/docs/durable-identity-protocol#surety">surety</a> for a <span>durable</span>{' '}
            earth:
          </h2>
          <div className="title-line-wrapper page1-line">
            <div className="title-line" />
          </div>
          <OverPack>{children}</OverPack>
        </div>
      </div>
    );
  }
}

export default injectIntl(Page1);
