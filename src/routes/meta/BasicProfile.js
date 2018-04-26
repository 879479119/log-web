import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Badge, Table, Divider } from 'antd';
import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './BasicProfile.less';

import { types, platforms } from '../../utils/const';

const { Description } = DescriptionList;

@connect(({ profile, loading, common }) => ({
  profile,
  loading: loading.effects['profile/fetchBasic'],
  common,
}))
export default class BasicProfile extends Component {
  render() {
    const { loading, common } = this.props;
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
          return <span style={{ fontWeight: 600 }}>{row.logSubTypeList.map(t => t.name).join(',')}</span>;
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
            dataSource={common.logTypes}
            columns={columns}
            rowKey="id"
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
