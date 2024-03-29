import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Tabs, List } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import { TimelineChart } from 'components/Charts';

import styles from './Analysis.less';
import { queryAB } from '../../services/ab';

const { TabPane } = Tabs;

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
    detail: {},
  };

  async componentDidMount() {
    const {id} = this.props.match.params

    if (id !== undefined) {
      const res = await queryAB(id)
      this.setState({detail: res.data.detail})
      this.props.dispatch({
        type: 'chart/fetchAB',
        payload: {id},
      });
    } else {
      this.setState({detail: {}})
    }

  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
  }

  transform = (source) => {

    let stay = []
    let k = 1;

    for(const group in source.groups) {
      if (source.groups.hasOwnProperty(group)) {
        const arr = source.groups[group]
        const ret = new Array(30).fill(0).map((_, i) => ({
          count: 0,
          count1: 0,
          day: i,
          hour: 0,
        }))
        for (let i = 0; i < 30; i++) {
          if (!arr[i]) {
          } else {
            ret[arr[i].day] = (arr[i])
          }
        }
        if (k === 1) {
          stay = ret.map(t => ({
            x: t.day,
            [`y${k}`]: t.count1 || t.count,
          }))
        } else {
          ret.forEach((t, i) => {
            stay[i][`y${k}`] = t.count1 || t.count
          })
        }
        k ++
      }
    }

    return stay
  }

  render() {
    const { chart, loading, match } = this.props;
    const {detail} = this.state
    const { abClickRatio, abPvCount, abStayTime, ab } = chart;

    console.info(detail)

    if (+match.params.id === 0) {
      return (
        <div>
          <h4>请选择对比组</h4>
        </div>
      )
    }

    if (ab) {
      return null
    }

    const stay = this.transform(abStayTime)
    const click = this.transform(abClickRatio)
    const pv = this.transform(abPvCount)

    return (
      <PageHeaderLayout
        title={`AB测试：${detail.name} 的测试结果`}
        content={
          <List
            size="small"
            grid={{ gutter: 10, column: 4 }}
            dataSource={detail.params || []}
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
            <p>开始时间： {detail.startTime}</p>
            <p>结束时间： {detail.endTime}</p>
            <p>创建时间： {detail.createTime}</p>
          </div>
        }
      >
        <Fragment>
          <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
            <div className={styles.salesCard}>
              <Tabs size="large" tabBarStyle={{ marginBottom: 24 }}>
                <TabPane tab="用户停留时长对比">
                  <Row gutter={24}>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                      <div style={{padding: 20}}>
                        <TimelineChart
                          height={250}
                          data={stay}
                          titleMap={{ y1: '对照组1', y2: '对照组2' }}
                        />
                      </div>
                    </Col>
                  </Row>
                </TabPane>
              </Tabs>
            </div>
          </Card>
          <Row gutter={24}>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>

              <Card title="用户PV数对比" loading={loading} bordered={false} bodyStyle={{ padding: 0 }} style={{marginTop: 20}}>
                <div className={styles.salesCard}>
                  <div style={{padding: 20}}>
                    <TimelineChart
                      height={250}
                      data={pv}
                      titleMap={{ y1: '对照组1', y2: '对照组2' }}
                    />
                  </div>
                </div>
              </Card>
            </Col>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>

              <Card title="用户点击量对比" loading={loading} bordered={false} bodyStyle={{ padding: 0 }} style={{marginTop: 20}}>
                <div className={styles.salesCard}>
                  <div style={{padding: 20}}>
                    <TimelineChart
                      height={250}
                      data={click}
                      titleMap={{ y1: '对照组1', y2: '对照组2' }}
                    />
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

        </Fragment>
      </PageHeaderLayout>
    );
  }
}
