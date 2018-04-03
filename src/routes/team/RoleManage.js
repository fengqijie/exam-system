import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Upload,
  Button,
  TreeSelect,
  Popconfirm,
  Dropdown,
  InputNumber,
  DatePicker,
  Menu,
  Modal,
  message,
  Table,
  Badge,
  Divider,
} from 'antd';
const ButtonGroup = Button.Group;
const confirm = Modal.confirm;
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './RoleManage.less';


// const data = [
//   {key: 1, job: 1, remark: '一些备注'},
//   {key: 2, job: 2, remark: '一些备注'},
//   {key: 3, job: 3, remark: '一些备注'},
//   {key: 4, job: 4, remark: '一些备注'},
//   {key: 5, job: 5, remark: '一些备注'},
//   {key: 6, job: 6, remark: '一些备注'},
// ];

const EditableCell = ({ editable, value, onChange }) => (
  <div>
    {editable
      ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
      : value
    }
  </div>
);

@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    isLoadTreeData: true,
    selectedRowData: {},
    value: [],
    treeData: [],
    data: [
      {key: 1, job: 1, remark: '一些备注'},
      {key: 2, job: 2, remark: '一些备注'},
      {key: 3, job: 3, remark: '一些备注'},
      {key: 4, job: 4, remark: '一些备注'},
      {key: 5, job: 5, remark: '一些备注'},
      {key: 6, job: 6, remark: '一些备注'},
    ],
    deleteModalVisible: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
    });
  }

  handleTreeSelectChange = value => {
    this.setState({ value });
  };

  handleSearch = e => {
    e.preventDefault();
    console.log(this.state.value);
  };


  renderForm() {
    let searchSize = 'large';
    const tProps = {
      treeData: this.state.treeData,
      allowClear: true,
      treeCheckStrictly: true,
      size: searchSize,
      value: this.state.value,
      onChange: this.handleTreeSelectChange,
      treeCheckable: true,
      showCheckedStrategy: TreeSelect.SHOW_ALL,
      searchPlaceholder: 'Please select',
    };

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row className={styles.mainSearch} gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col className={styles.treeSelect} md={10} sm={20}>
            <TreeSelect {...tProps} />
          </Col>
          <Col className={styles.searchButton} md={2} sm={4}>
            <span className={styles.submitButtons}>
              <Button loading={!this.state.isLoadTreeData} size={searchSize} type="primary" htmlType="submit">
                查询
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }
  columns = [{
    title: '职位',
    dataIndex: 'job',
    width: '15%',
    render: (text, record) => this.renderColumns(text, record, 'job'),
  }, {
    title: '备注',
    dataIndex: 'remark',
    width: '40%',
    render: (text, record) => this.renderColumns(text, record, 'remark'),
  }, {
    title: '操作',
    dataIndex: 'operation',
    render: (text, record) => {
      const { editable } = record;
      return (
        <div className="editable-row-operations">
          {
            editable
            ?
            <ButtonGroup>
              <Button onClick={() => this.handleSave(record.key)}>保存</Button>
              <Popconfirm title="确定取消?" cancelText="否" okText="是" onConfirm={() => this.handleCancel(record.key)}>
                <Button>取消</Button>
              </Popconfirm>
            </ButtonGroup>
            : 
            <ButtonGroup>
              <Button icon="plus" onClick={() => this.handleEdit(record.key)}>增加下一级</Button>
              <Button icon="edit" onClick={() => this.handleEdit(record.key)}>修改</Button>
              <Popconfirm title="Sure to delete?" onConfirm={() => this.onDelete(record.key)}>
                <Button icon="delete" type="danger">删除</Button>
              </Popconfirm>
            </ButtonGroup>
          }
        </div>
      );
    },
  }];

  cacheData = this.state.data.map(item => ({ ...item }));

  renderColumns(text, record, column) {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.key, column)}
      />
    );
  }
  handleChange(value, key, column) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      target[column] = value;
      this.setState({ data: newData });
    }
  }

  onDelete = (key) => {
    const dataSource = [...this.state.data];
    const filterData = dataSource.filter(item => item.key !== key);
    this.setState({ dataSource: filterData });
  }

  handleEdit(key) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      target.editable = true;
      this.setState({ data: newData });
    }
  }

  handleSave(key) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      delete target.editable;
      this.setState({ data: newData });
      this.cacheData = newData.map(item => ({ ...item }));
    }
  }

  handleCancel(key) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
      delete target.editable;
      this.setState({ data: newData });
    }
  }

  render() {
    return (
      <PageHeaderLayout title="角色管理" content={this.renderForm()}>
        <Card bordered={false}>
          <Table bordered dataSource={this.state.data} columns={this.columns} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
