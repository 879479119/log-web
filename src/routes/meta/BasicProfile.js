import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Badge, Table, Divider } from 'antd';
import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './BasicProfile.less';

import { types, platforms } from '../../utils/const';

const { Description } = DescriptionList;

@connect(({ profile, loading }) => ({
  profile,
  loading: loading.effects['profile/fetchBasic'],
}))
export default class BasicProfile extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'profile/fetchBasic',
    });
  }

  render() {
    const { profile, loading } = this.props;
    const { basicGoods, basicProgress } = profile;
    let goodsData = [];
    if (basicGoods.length) {
      let num = 0;
      let amount = 0;
      basicGoods.forEach(item => {
        num += Number(item.num);
        amount += Number(item.amount);
      });
      goodsData = basicGoods.concat({
        id: '总计',
        num,
        amount,
      });
    }
    const renderContent = (value, row, index) => {
      const obj = {
        children: value,
        props: {},
      };
      if (index === basicGoods.length) {
        obj.props.colSpan = 0;
      }
      return obj;
    };
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
      },
      {
        title: '一级类型',
        dataIndex: 'name',
      },
      {
        title: '子类型',
        dataIndex: 'subTypes',
        render: (text, row) => {
          return <span style={{ fontWeight: 600 }}>{row.subTypes.map(t => t.name).join(',')}</span>;
        },
      },
    ];

    return (
      <PageHeaderLayout title="元数据基本信息">
        <Card bordered={false}>
          <DescriptionList size="large" title="平台设置" style={{ marginBottom: 32 }}>
            {platforms.map((t, i) => (
              <Description key={i} term={t.name}>
                <span>{t.code}</span>
              </Description>
            ))}
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <div className={styles.title}>事件类型</div>
          <Table
            style={{ marginBottom: 24 }}
            pagination={false}
            loading={loading}
            dataSource={types}
            columns={columns}
            rowKey="id"
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
