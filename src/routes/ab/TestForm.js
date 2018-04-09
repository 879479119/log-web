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
  Radio,
  Icon,
  Tooltip,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import FooterToolbar from '../../components/FooterToolbar';
import Param from './Param'
import styles from './style.less';
import { platforms, versions } from '../../utils/const';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
export default class BasicForms extends PureComponent {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'form/submitRegularForm',
          payload: values,
        });
      }
    });
  };
  render() {
    const { submitting } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;

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
              })(<Input placeholder="给这次测试起个名字" />)}
            </FormItem>
            <Form.Item {...formItemLayout} label={'平台'}>
              {getFieldDecorator('platform', {
                rules: [{ required: true, message: '请选择' }],
              })(
                <Select placeholder="请选择平台">
                  {platforms.map(t => (
                    <Option key={t.code} value={t.code}>
                      {t.name}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label={'版本'}>
              {getFieldDecorator('version', {
                rules: [{ required: true, message: '请选择' }],
              })(
                <Select placeholder="请选择版本">
                  {versions.map(t => (
                    <Option key={t.code} value={t.code}>
                      {t.name}
                    </Option>
                  ))}
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
              {getFieldDecorator('weight')(<InputNumber placeholder="请输入" min={0} max={10} />)}
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
          <div>
            <Param />
            <div className={styles.addOne}>
              <p><Icon type="plus-circle-o" /> 添加一个</p>
            </div>
          </div>
        </Card>
        <FooterToolbar>
          <Button type="primary" htmlType="submit" loading={submitting}>
            提交
          </Button>
          <Button style={{ marginLeft: 8 }}>保存</Button>
        </FooterToolbar>
      </PageHeaderLayout>
    );
  }
}
