import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  List,
  Card,
  Row,
  Col,
  Radio,
  Input,
  Progress,
  Button,
  Badge,
  Icon,
  Dropdown,
  Menu,
  Avatar,
} from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { queryABList } from '../../services/ab';

import styles from './BasicList.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

@connect(({ list, loading }) => ({
  list,
  loading: loading.models.list,
}))
export default class BasicList extends PureComponent {
  state = {
    list: [],
  };

  async componentWillMount() {
    const res = await queryABList();
    if (res) {
      this.setState({
        list: res,
      });
    }
  }

  handleAdd = () => {
    this.props.dispatch(routerRedux.push('/ab/create'));
  };

  handleEdit = id => {
    this.props.dispatch(routerRedux.push(`/log/edit/${id}`));
  };

  render() {
    const { list } = this.state;

    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup defaultValue="all">
          <RadioButton value="all">全部</RadioButton>
          <RadioButton value="waiting">未开始</RadioButton>
          <RadioButton value="progress">进行中</RadioButton>
          <RadioButton value="end">已结束</RadioButton>
        </RadioGroup>
        <Search className={styles.extraContentSearch} placeholder="请输入" onSearch={() => ({})} />
      </div>
    );

    const ListContent = ({ data: { creator, createAt, startTime, endTime, status } }) => (
      <div className={styles.listContent}>
        <div>
          <div className={styles.listContentItem}>
            <span>当前状态</span>
            <p>
              {status === 0 ? (
                <Badge status="success" text="未使用" />
              ) : (
                <Badge status="processing" text="使用中" />
              )}
            </p>
          </div>
          <div className={styles.listContentItem}>
            <span>创建人</span>
            <p>{creator}</p>
          </div>
          <div className={styles.listContentItem}>
            <span>创建时间</span>
            <p>{moment(createAt).format('YYYY-MM-DD HH:mm')}</p>
          </div>
        </div>
        <div style={{ marginTop: 20 }}>
          <div className={styles.listContentItem}>
            <span>开始时间</span>
            <p>{startTime}</p>
          </div>
          <div className={styles.listContentItem}>
            <span>结束时间</span>
            <p>{endTime}</p>
          </div>
        </div>
      </div>
    );

    const menu = (
      <Menu>
        <Menu.Item>
          <a>编辑</a>
        </Menu.Item>
        <Menu.Item>
          <a>删除</a>
        </Menu.Item>
      </Menu>
    );

    const MoreBtn = () => (
      <Dropdown overlay={menu}>
        <a>
          更多 <Icon type="down" />
        </a>
      </Dropdown>
    );

    return (
      <PageHeaderLayout>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            title="AB实验列表"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
              icon="plus"
              onClick={this.handleAdd}
            >
              进行新的实验
            </Button>
            <List
              size="large"
              rowKey="id"
              dataSource={list}
              renderItem={item => (
                <List.Item actions={[<a>编辑</a>, <MoreBtn />]}>
                  <List.Item.Meta
                    title={
                      <div>
                        <span
                          style={{
                            display: 'inline-block',
                            background: '#222',
                            color: '#fff',
                            borderRadius: '50%',
                            width: 30,
                            height: 30,
                            lineHeight: '30px',
                            textAlign: 'center',
                            marginRight: 10,
                          }}
                        >
                          W
                        </span>
                        <span>{item.name}</span>
                      </div>
                    }
                    description={item.description}
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}
