import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import {
  List,
  Card,
  Radio,
  Input,
  Button,
  Badge,
  Icon,
  Dropdown,
  Menu,
} from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { queryABList, deleteAB } from '../../services/ab';

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
        list: res.data.list,
      });
    }
  }

  handleAdd = () => {
    this.props.dispatch(routerRedux.push('/ab/create'));
  };

  handleEdit = id => {
    this.props.dispatch(routerRedux.push(`/ab/edit/${id}`));
  };

  deleteAB = async id => {
    await deleteAB(id);
    location.reload(true);
  }

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

    const ListContent = ({ data: { creator, createTime, startTime, endTime, status } }) => (
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
            <span>创建时间</span>
            <p>{moment(createTime).format('YYYY-MM-DD HH:mm')}</p>
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

    const MoreBtn = ({id}) => (
      <Dropdown overlay={
        <Menu>
          <Menu.Item>
            <Link to={`/analysis/ab/${id}`}>查看分析</Link>
          </Menu.Item>
          <Menu.Item>
            <a onClick={() => this.deleteAB(id)}>删除</a>
          </Menu.Item>
        </Menu>}
      >
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
                <List.Item actions={[<a onClick={() => this.handleEdit(item.id)}>编辑</a>, <MoreBtn id={item.id} />]}>
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
                          {item.name[0].toUpperCase()}
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
