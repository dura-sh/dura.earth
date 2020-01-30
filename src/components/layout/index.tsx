import React from 'react';
import { addLocaleData, IntlProvider } from 'react-intl';
import { LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import Media from 'react-media';
import enLocale from '../../locale/en-US';
import * as utils from '../utils';
import '../../static/style';
import Header from './Header';


interface LayoutProps {
  location: {
    pathname: string;
  };
  isMobile: boolean;
  children: React.ReactElement<LayoutProps>;
}

interface LayoutState {
  appLocale: {
    locale: any;
    messages: any;
  };
}

export class Layout extends React.Component<LayoutProps, LayoutState> {
  constructor(props: LayoutProps) {
    super(props);
    const { pathname } = props.location;
    const appLocale = enLocale;
    addLocaleData(appLocale.data);
    this.state = {
      appLocale,
    };
  }

  render() {
    const { children, location, ...restProps } = this.props;
    const { pathname } = location;
    const { appLocale } = this.state;
    return (
      <IntlProvider locale={appLocale.locale} messages={appLocale.messages}>
        <LocaleProvider locale={enUS}>
          <div
            className={`page-wrapper ${(pathname === '/') &&
              'index-page-wrapper'}`}
          >
            <Header {...restProps} location={location} />
            {React.cloneElement(children, {
              ...children.props,
              isMobile: restProps.isMobile,
            })}
          </div>
        </LocaleProvider>
      </IntlProvider>
    );
  }
}

const WrapperLayout = (props: LayoutProps) => (
  <Media query="(max-width: 996px)">
    {isMobile => {
      const isNode = typeof window === `undefined`;
      return <Layout {...props} isMobile={isMobile && !isNode} />;
    }}
  </Media>
);
export default WrapperLayout;
