import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Icon, Card, Tabs, Table, Radio, List, DatePicker, Menu, Dropdown } from 'antd';
import numeral from 'numeral';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import { yuan, Bar, Pie } from 'components/Charts';
import Trend from 'components/Trend';
import NumberInfo from 'components/NumberInfo';
import { getTimeDistance } from '../../utils/utils';

import styles from './Analysis.less';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const rankingListData = [];
for (let i = 0; i < 7; i += 1) {
  rankingListData.push({
    title: `工专路 ${i} 号店`,
    total: 323234,
  });
}

const teams = [
  {
    id: 0,
    name: '默认对照组',
    feature: 'default',
    params: '{a: 2}',
  },
  {
    id: 233,
    name: '对照组1',
    feature: 'feature:1',
    params: '{a: 8}',
  },
  {
    id: 3554,
    name: '对照组2',
    feature: 'feature:2',
    params: '{a: 5, b: 2}',
  },
];

@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['chart/fetch'],
}))
export default class Analysis extends Component {
  state = {
    salesType: 'all',
    currentTabKey: '',
    rangePickerValue: getTimeDistance('year'),
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'chart/fetch',
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
  }

  handleChangeSalesType = e => {
    this.setState({
      salesType: e.target.value,
    });
  };

  handleTabChange = key => {
    this.setState({
      currentTabKey: key,
    });
  };

  handleRangePickerChange = rangePickerValue => {
    this.setState({
      rangePickerValue,
    });

    this.props.dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  selectDate = type => {
    this.setState({
      rangePickerValue: getTimeDistance(type),
    });

    this.props.dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  isActive(type) {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return;
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }
  }

  render() {
    const { rangePickerValue, salesType, currentTabKey } = this.state;
    const { chart, loading } = this.props;
    const { salesData, salesTypeData, salesTypeDataOnline, salesTypeDataOffline } = chart;

    const salesPieData =
      salesType === 'all'
        ? salesTypeData
        : salesType === 'online' ? salesTypeDataOnline : salesTypeDataOffline;

    const menu = (
      <Menu>
        <Menu.Item>操作一</Menu.Item>
        <Menu.Item>操作二</Menu.Item>
      </Menu>
    );

    const salesExtra = (
      <div className={styles.salesExtraWrap}>
        <div className={styles.salesExtra}>
          <a className={this.isActive('today')} onClick={() => this.selectDate('today')}>
            今日
          </a>
          <a className={this.isActive('week')} onClick={() => this.selectDate('week')}>
            本周
          </a>
          <a className={this.isActive('month')} onClick={() => this.selectDate('month')}>
            本月
          </a>
          <a className={this.isActive('year')} onClick={() => this.selectDate('year')}>
            全年
          </a>
        </div>
        <RangePicker
          value={rangePickerValue}
          onChange={this.handleRangePickerChange}
          style={{ width: 256 }}
        />
      </div>
    );

    return (
      <PageHeaderLayout
        title="AB测试：A和B的结果对比"
        content={
          <List
            size={'small'}
            grid={{ gutter: 10, column: 4 }}
            dataSource={teams}
            renderItem={item => (
              <List.Item>
                <Card>
                  <p>{item.name}</p>
                  <p>{item.feature}</p>
                </Card>
              </List.Item>
            )}
          />
        }
        extraContent={
          <div>
            <p>开始时间： 2018-02-12 12:21:12</p>
            <p>结束时间： 2018-02-12 12:21:12</p>
            <p>创建时间： 2018-02-12 12:21:12</p>
          </div>
        }
      >
        <Fragment>
          <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
            <div className={styles.salesCard}>
              <Tabs tabBarExtraContent={salesExtra} size="large" tabBarStyle={{ marginBottom: 24 }}>
                <TabPane tab="销售额" key="sales">
                  <Row>
                    <Col xl={24} lg={12} md={12} sm={24} xs={24}>
                      <div className={styles.salesBar}>
                        <Bar height={295} title="销售额趋势" data={salesData} />
                      </div>
                    </Col>
                  </Row>
                </TabPane>
              </Tabs>
            </div>
          </Card>

          <Row gutter={24}>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Card
                loading={loading}
                className={styles.salesCard}
                bordered={false}
                title="销售额类别占比"
                bodyStyle={{ padding: 24 }}
                style={{ marginTop: 24, minHeight: 509 }}
              >
                <h4 style={{ marginTop: 8, marginBottom: 32 }}>销售额</h4>
                <Pie
                  hasLegend
                  subTitle="销售额"
                  total={() => (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: yuan(salesPieData.reduce((pre, now) => now.y + pre, 0)),
                      }}
                    />
                  )}
                  data={salesPieData}
                  valueFormat={val => <span dangerouslySetInnerHTML={{ __html: yuan(val) }} />}
                  height={248}
                  lineWidth={4}
                />
              </Card>
            </Col>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Card
                loading={loading}
                className={styles.salesCard}
                bordered={false}
                title="销售额类别占比"
                bodyStyle={{ padding: 24 }}
                style={{ marginTop: 24, minHeight: 509 }}
              >
                <h4 style={{ marginTop: 8, marginBottom: 32 }}>销售额</h4>
                <Pie
                  hasLegend
                  subTitle="销售额"
                  total={() => (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: yuan(salesPieData.reduce((pre, now) => now.y + pre, 0)),
                      }}
                    />
                  )}
                  data={salesPieData.slice(3)}
                  valueFormat={val => <span dangerouslySetInnerHTML={{ __html: yuan(val) }} />}
                  height={248}
                  lineWidth={4}
                />
              </Card>
            </Col>
          </Row>
        </Fragment>
      </PageHeaderLayout>
    );
  }
}
