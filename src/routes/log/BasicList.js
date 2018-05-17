import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import {routerRedux, Link} from 'dva/router'
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
import {queryLog, queryLogList, deleteLog} from '../../services/log'

import styles from './BasicList.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

@connect(({ list, loading, common }) => ({
  list,
  loading: loading.models.list,
  common,
}))
export default class BasicList extends PureComponent {
  state = {
    list: [],
  }

  async componentWillMount() {
    await this.query({});
  }

  query =  async (body) => {
    const res = await queryLogList(body)
    if (res) {
      this.setState({
        list: res.data.list,
      })
    }
  }

  handleAdd = () => {
    this.props.dispatch(routerRedux.push('/log/create'))
  }

  handleEdit = id => {
    this.props.dispatch(routerRedux.push(`/log/edit/${id}`))
  }

  handleDelete = async id => {
    await deleteLog(id);
    location.reload(true);
  }

  render() {
    const {list} = this.state
    const {common: {logTypes}} = this.props

    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup defaultValue={-1} onChange={e => this.query({status: e.target.value})}>
          <RadioButton value={-1}>全部</RadioButton>
          <RadioButton value={0}>未使用</RadioButton>
          <RadioButton value={1}>使用中</RadioButton>
        </RadioGroup>
        <Search className={styles.extraContentSearch} placeholder="请输入" onSearch={text => this.query({name: text})} />
      </div>
    );


    const ListContent = ({ data: { creator, createTime, type, status, subType } }) => {

      const typeTop = logTypes.find(t => t.id === type)

      return (
        <div className={styles.listContent}>
          <div className={styles.listContentItem}>
            <span>当前状态</span>
            <p>
              {
                status === 0 ? (
                  <Badge status="success" text="未使用" />
                ) : (
                  <Badge status="processing" text="使用中" />
                )
              }
            </p>
          </div>
          <div className={styles.listContentItem}>
            <span>类型</span>
            <p>{typeTop.name} / {typeTop.logSubTypeList.find(t => t.id === subType).name}</p>
          </div>
          <div className={styles.listContentItem}>
            <span>创建时间</span>
            <p>{createTime}</p>
          </div>
        </div>
      )
    }

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
            title="埋点列表"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <Button type="dashed" style={{ width: '100%', marginBottom: 8 }} icon="plus" onClick={this.handleAdd}>
              添加
            </Button>
            <List
              size="large"
              rowKey="id"
              dataSource={list}
              renderItem={item => (
                <List.Item actions={[<a onClick={() => this.handleEdit(item.id)} >编辑</a>, <a onClick={() => this.handleDelete(item.id)} >删除</a>,]}>
                  <List.Item.Meta
                    avatar={<p>23</p>}
                    title={item.name}
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
