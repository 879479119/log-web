import React, { PureComponent } from 'react';
import {
  Card,
  Button,
  Form,
  Icon,
  Col,
  Row,
  DatePicker,
  TimePicker,
  Input,
  Select,
  Popover,
} from 'antd';
import { connect } from 'dva';
import FooterToolbar from 'components/FooterToolbar';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import TableForm from '../Forms/TableForm';
import styles from './style.less';

import {platforms, types, versions} from '../../utils/const'

const { Option } = Select;
const { RangePicker } = DatePicker;

const fieldLabels = {
  name: '埋点名',
  version: '版本',
  platform: '平台',
  description: '说明',
  type: '一级类型',
  subType: '二级类型',
};

const tableData = [
  {
    key: 'detail.view',
    name: '用户访问量',
    description: '你不是真生的快乐,is that right',
  },
  {
    key: 'detail.view.url',
    name: '用户访问页面',
    description: '我爱你，不是因为你的美而已',
  },
];

class AdvancedForm extends PureComponent {
  state = {
    width: '100%',
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }
  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  };
  render() {
    const { form, dispatch, submitting } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError, getFieldValue } = form;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'form/submitAdvancedForm',
            payload: values,
          });
        }
      });
    };
    const errors = getFieldsError();
    const getErrorInfo = () => {
      const errorCount = Object.keys(errors).filter(key => errors[key]).length;
      if (!errors || errorCount === 0) {
        return null;
      }
      const scrollToField = fieldKey => {
        const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
        if (labelNode) {
          labelNode.scrollIntoView(true);
        }
      };
      const errorList = Object.keys(errors).map(key => {
        if (!errors[key]) {
          return null;
        }
        return (
          <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
            <Icon type="cross-circle-o" className={styles.errorIcon} />
            <div className={styles.errorMessage}>{errors[key][0]}</div>
            <div className={styles.errorField}>{fieldLabels[key]}</div>
          </li>
        );
      });
      return (
        <span className={styles.errorIcon}>
          <Popover
            title="表单校验信息"
            content={errorList}
            overlayClassName={styles.errorPopover}
            trigger="click"
            getPopupContainer={trigger => trigger.parentNode}
          >
            <Icon type="exclamation-circle" />
          </Popover>
          {errorCount}
        </span>
      );
    };
    return (
      <PageHeaderLayout
        title="埋点信息编辑"
        content="用于录入埋点信息。便于对数据进行管理并统一口径"
        wrapperClassName={styles.advancedForm}
      >
        <Card title="基本信息" className={styles.card} bordered={false}>
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.name}>
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入' }],
                  })(<Input placeholder="请输入" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.version}>
                  {getFieldDecorator('version', {
                    rules: [{ required: true, message: '请选择' }],
                  })(
                    <Select placeholder="请选择版本">
                      {
                        versions.map(t => <Option key={t.code} value={t.code} >{t.name}</Option>)
                      }
                    </Select>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.platform}>
                  {getFieldDecorator('platform', {
                    rules: [{ required: true, message: '请选择' }],
                  })(
                    <Select placeholder="请选择平台">
                      {
                        platforms.map(t => <Option key={t.code} value={t.code} >{t.name}</Option>)
                      }
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xl={{ span: 6 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.type}>
                  {getFieldDecorator('type', {
                    rules: [{ required: true, message: '请输入' }],
                  })(
                    <Select placeholder="请选择类型">
                      {
                        types.map(t => <Option key={t.id} value={t.id} >{t.name}</Option>)
                      }
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 8 }} md={{ span: 24 }} sm={24} style={{display: getFieldValue('type') !== undefined ? 'block' : 'none'}}>
                <Form.Item label={fieldLabels.subType}>
                  {getFieldDecorator('subType', {
                    rules: [{ required: true, message: '请选择类型' }],
                  })(
                    <Select placeholder="请选择二级类型">
                      {
                        (types.find(t => t.id === +getFieldValue('type')) || {subTypes: []}).subTypes.map(t => <Option key={t.id} value={t.id} >{t.name}</Option>)
                      }
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={24} md={12} sm={24}>
                <Form.Item label={fieldLabels.description}>
                  {getFieldDecorator('description', {
                    rules: [{ required: true, message: '写完' }],
                  })(<Input.TextArea autosize={{minRows: 4}} />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="埋点字段收集管理" bordered={false}>
          {getFieldDecorator('columns', {
            initialValue: tableData,
          })(<TableForm />)}
        </Card>
        <FooterToolbar style={{ width: this.state.width }}>
          {getErrorInfo()}
          <Button type="primary" onClick={validate} loading={submitting}>
            提交
          </Button>
        </FooterToolbar>
      </PageHeaderLayout>
    );
  }
}

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(AdvancedForm));
