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
import Item from './Item'

export default class Param extends PureComponent {
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

  handleAdd = () => {
    this.setState({
      data: [...this.state.data, {}],
    })
  }

  handleRemove = index => {
    const data = this.state.data.concat()
    data.splice(index, 1)
    this.setState({data})
  }

  constructor(props) {
    super(props);

    this.list = [];
    this.state = {
      data: props.value || [],
    };
  }
  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({
        data: nextProps.value || [],
      });
    }
  }

  getData = () => {
    return this.list.map(item => {
      return item.getFieldsValue()
    })
  }

  render() {
    const Tables = this.state.data.map((param, index) => {

      return (
        <Item key={index} index={index} value={param} onRemove={this.handleRemove} ref={t => this.list[index] = t} />
      )
    })

    return (
      <div>
        {Tables}
        <div className={styles.addOne} onClick={this.handleAdd}>
          <p><Icon type="plus-circle-o" /> 添加一个</p>
        </div>
      </div>
    )
  }
}
