import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  InputNumber,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import FooterToolbar from '../../components/FooterToolbar';
import Param from './Param'
import styles from './style.less';
import { createAB, editAB, queryAB } from '../../services/ab';
import { routerRedux } from 'dva/router';
import moment from 'moment'

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(({ loading, common }) => ({
  submitting: loading.effects['form/submitRegularForm'],
  common,
}))
@Form.create()
export default class BasicForms extends PureComponent {
  state = {
    detail: {},
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll( async (err, values) => {
      if (!err) {
        const {id} = this.props.match.params

        const params = this.l.getData()

        const postBody = {
          ...values,
          startTime: values.date[0].format('YYYY-MM-DD HH:mm:ss'),
          endTime: values.date[1].format('YYYY-MM-DD HH:mm:ss'),
          params,
        }

        if (id === undefined) {
          // submit the values
          const resp = await createAB(postBody)
        } else {
          const resp = await editAB({...postBody, id})
        }

        this.props.dispatch(routerRedux.push("/ab/list"))
      }
    });
  };

  async componentDidMount() {
    const {id} = this.props.match.params

    if (id !== undefined) {
      const res = await queryAB(id)
      this.setState({detail: res.data.detail})
    } else {
      this.setState({detail: {}})
    }

  }

  render() {
    const { submitting, common } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const {detail} = this.state

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };


    return (
      <PageHeaderLayout
        title="编辑测试信息"
        content="一次AB测试可以做针对页面的一些功能上的测试，在用户无感知的情况下做到验证产品正确性"
      >
        <Card bordered={false} title="基本信息">
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="名称">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入标题',
                  },
                ],
                initialValue: detail.name,
              })(<Input placeholder="给这次测试起个名字" />)}
            </FormItem>
            <Form.Item {...formItemLayout} label="平台">
              {getFieldDecorator('platformId', {
                rules: [{ required: true, message: '请选择' }],
                initialValue: detail.platformId,
              })(
                <Select placeholder="请选择平台">
                  {
                    (common.appPlatforms || []).map(t => <Option key={t.id} value={t.id} >{t.name}</Option>)
                  }
                </Select>
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="版本" style={{display: getFieldValue('platformId') !== undefined ? 'block' : 'none'}}>
              {getFieldDecorator('versionId', {
                rules: [{ required: true, message: '请选择' }],
                initialValue: detail.versionId,
              })(
                <Select placeholder="请选择版本">
                  {
                    (common.appVersions || []).filter(t => t.platformId === +getFieldValue('platformId')).map(t => <Option key={t.id} value={t.id} >{t.name}</Option>)
                  }
                </Select>
              )}
            </Form.Item>
            <FormItem {...formItemLayout} label="起止日期">
              {getFieldDecorator('date', {
                rules: [
                  {
                    required: true,
                    message: '请选择起止日期',
                  },
                ],
                initialValue: (() => {
                  if (detail.startTime) {
                    return [moment(detail.startTime), moment(detail.endTime)]
                  }
                  return undefined
                })(),
              })(<RangePicker style={{ width: '100%' }} placeholder={['开始日期', '结束日期']} />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  分流比例
                </span>
              }
            >
              {getFieldDecorator('percentage', {
                initialValue: detail.percentage,
              })(<InputNumber placeholder="请输入" min={0} max={10} />)}
              <span> %</span><em className={styles.optional}>（最大10%）</em>
            </FormItem>
            <FormItem {...formItemLayout} label="测试信息描述">
              {getFieldDecorator('description', {
                rules: [
                  {
                    required: true,
                    message: '请输入描述',
                  },
                ],
                initialValue: detail.description,
              })(
                <TextArea
                  style={{ minHeight: 32 }}
                  placeholder="请输入你的阶段性工作目标"
                  rows={4}
                />
              )}
            </FormItem>
          </Form>
        </Card>
        <Card bordered={false} title="对照参数信息" style={{marginTop: 20}}>
          {getFieldDecorator('params', {
            initialValue: detail.params,
          })(
            <Param ref={t => this.l = t} />
          )}
        </Card>
        <FooterToolbar>
          <Button type="primary" onClick={this.handleSubmit} >
            提交
          </Button>
        </FooterToolbar>
      </PageHeaderLayout>
    );
  }
}
