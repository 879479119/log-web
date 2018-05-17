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
  Switch,
  Input,
  Select,
  Popover,
} from 'antd';
import { connect } from 'dva';
import {routerRedux} from 'dva/router'
import FooterToolbar from 'components/FooterToolbar';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import TableForm from '../Forms/TableForm';
import styles from './style.less';
import {createLog} from '../../services/log'
import {queryLog, editLog} from '../../services/log'

// import {platforms, types, versions} from '../../utils/const'

const { Option } = Select;

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
    expression: 'detail.view.url',
    name: '用户访问路由',
    description: '用户访问的路由啊啊啊',
  },
];

class AdvancedForm extends PureComponent {
  state = {
    width: '100%',
    detail: {},
  };
  async componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
    const {id} = this.props.match.params

    if (id !== undefined) {
      const res = await queryLog(id)
      this.setState({detail: res.data.detail})
    } else {
      this.setState({detail: {columns: tableData}})
    }

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
  handleSubmit = () => {

    const { form } = this.props;
    const { validateFieldsAndScroll} = form;


    validateFieldsAndScroll(async (error, values) => {
      if (!error) {


        const {id} = this.props.match.params

        values.status = + values.status;

        if (id === undefined) {
          // submit the values
          const resp = await createLog(values)
        } else {
          const resp = await editLog({...values, id})
        }

        this.props.dispatch(routerRedux.push("/log/list"))
      }
    });
  }
  render() {
    const { form, submitting, common } = this.props;
    const { getFieldDecorator, getFieldsError, getFieldValue } = form;
    const errors = getFieldsError();
    const {detail} = this.state
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

    const types = common.logTypes || []

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
                    initialValue: detail.name,
                  })(<Input placeholder="请输入" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.platform}>
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
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24} style={{display: getFieldValue('platformId') !== undefined ? 'block' : 'none'}}>
                <Form.Item label={fieldLabels.version}>
                  {getFieldDecorator('versionId', {
                    rules: [{ required: true, message: '请选择' }],
                    initialValue: detail.versionId,
                  })(
                    <Select placeholder="请选择版本">
                      {
                        (common.appVersions || []).filter(t => t.platformId === +getFieldValue('platformId')).map(t => <Option key={t.id} value={t.id} >{t.name}</Option>)
                      }
                    </Select>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xl={{ span: 6 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.type}>
                  {getFieldDecorator('type', {
                    rules: [{ required: true, message: '请输入' }],
                    initialValue: detail.type,
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
                    initialValue: detail.subType,
                  })(
                    <Select placeholder="请选择二级类型">
                      {
                        (types.find(t => t.id === +getFieldValue('type')) || {logSubTypeList: []}).logSubTypeList.map(t => <Option key={t.id} value={t.id} >{t.name}</Option>)
                      }
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24} >
                <Form.Item label={'是否启用'}>
                  {getFieldDecorator('status', {
                    initialValue: !!detail.status,
                    valuePropName: 'checked',
                  })(
                    <Switch checkedChildren="开" unCheckedChildren="关" />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={24} md={12} sm={24}>
                <Form.Item label={fieldLabels.description}>
                  {getFieldDecorator('description', {
                    rules: [{ required: true, message: '写完' }],
                    initialValue: detail.description,
                  })(<Input.TextArea autosize={{minRows: 4}} />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="埋点字段收集管理" bordered={false}>
          {getFieldDecorator('columns', {
            initialValue: detail.columns,
          })(<TableForm />)}
        </Card>
        <FooterToolbar style={{ width: this.state.width }}>
          {getErrorInfo()}
          <Button type="primary" onClick={this.handleSubmit} loading={submitting}>
            提交
          </Button>
        </FooterToolbar>
      </PageHeaderLayout>
    );
  }
}

export default connect(({ global, loading, common }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
  common,
}))(Form.create()(AdvancedForm));
