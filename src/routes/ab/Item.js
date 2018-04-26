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
import styles from './style.less';
import Ace from '../../components/CodeEditor';

const FormItem = Form.Item;

@Form.create()
export default class Item extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: props.value,
    };
  }
  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({
        data: nextProps.value,
      });
    }
  }
  render() {
    const {data} = this.state
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
        md: { span: 2 },
        lg: { span: 5 },
        xl: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };
    return (
      <div>
        <Card style={{width: '45%', display: 'inline-block', margin: 20}} title="编辑参数" extra={<Button type="danger" ghost size="small" onClick={() => this.handleRemove(index)}>删除</Button>}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="对照组名称">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入',
                  },
                ],
                initialValue: data.name,
              })(<Input placeholder="输入名称" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="对照组描述">
              {getFieldDecorator('description', {
                rules: [
                  {
                    required: true,
                    message: '请输入',
                  },
                ],
                initialValue: data.description,
              })(<Input placeholder="输入描述" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="feature">
              {getFieldDecorator('feature', {
                rules: [
                  {
                    required: true,
                    message: '请输入',
                  },
                ],
                initialValue: data.feature,
              })(<Input placeholder="输入feature" />)}
            </FormItem>
            <FormItem label="详细配置情况">
              <div>
                {getFieldDecorator('config', {
                  initialValue: '{}',
                })(<Ace />)}
              </div>
            </FormItem>
          </Form>
        </Card>
      </div>
    )
  }
}
