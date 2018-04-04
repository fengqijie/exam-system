import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Select,
  Icon,
  Upload,
  Input,
  Radio,
  Button,
  Popconfirm,
  Dropdown,
  Modal,
  message,
  Table,
} from 'antd';

const ButtonGroup = Button.Group;
const confirm = Modal.confirm;
const FormItem = Form.Item;

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './RoleManage.less';
import MainTreeSelect from './MainTreeSelect';
import RoleModal from './RoleModal';

const CreateForm = Form.create()(props => {
  const { modalProps, modalVisible, form, onOK, onCancel } = props;

  return (
    <Modal
      title={modalProps.title}
      visible={modalVisible}
      okText={modalProps.okText}
      cancelText={modalProps.cancelText}
      onOk={onOK}
      onCancel={onCancel}
    >
      <RoleModal />
    </Modal>
  );
});

@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))

@Form.create()

export default class TableList extends PureComponent {
  state = {
    data: [
      {key: 1, job: '领导1', remark: '一些备注'},
      {key: 2, job: '领导2', remark: '一些备注'},
      {key: 3, job: '领导3', remark: '一些备注'},
      {key: 4, job: '领导4', remark: '一些备注'},
      {key: 5, job: '领导5', remark: '一些备注'},
      {key: 6, job: '领导6', remark: '一些备注'}
    ],
    treeData: [],
    value: [],
    visible: false,
    modalProps: {}
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
    });
  } 

  columns = [
    {
      title: '职位',
      dataIndex: 'job',
      // width: '15%',
    }, {
      title: '备注',
      dataIndex: 'remark',
      // width: '40%',
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
                <Button icon="plus" onClick={() => this.handleAdd(record.key)}>增加下一级</Button>
                <Button icon="edit" onClick={() => this.handleEdit(record.key)}>修改</Button>
                <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
                  <Button icon="delete" type="danger">删除</Button>
                </Popconfirm>
              </ButtonGroup>
            }
          </div>
        );
      },
    }
  ];

  handleAdd = (key) => {
    this.setState({ 
      modalProps: {
        title: "为当前职位创建下一级",
        okText: "创建",
        cancelText: '取消',
        handleType: 'add',
        data: this.state.data,
        key: key
      } 
    });
    this.showModal();
  }

  handleDelete = (key) => {
    const dataSource = [...this.state.data];
    const filterData = dataSource.filter(item => item.key !== key);
    this.setState({ dataSource: filterData });
  }

  handleEdit(key) {
    this.setState({ modalProps: {
      title: "修改",
      okText: "确定",
      cancelText: '取消',
      handleType: 'edit',
      data: this.state.data,
      key: key
    } });
    this.showModal();
    // const newData = [...this.state.data];
    // const target = newData.filter(item => key === item.key)[0];
  }
  createModal() {

  }
  handleSave(key) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      delete target.editable;
      this.setState({ data: newData });
    }
  }

  // about tree-select
  handleTreeSelectSearch = e => {
    e.preventDefault();
    console.log(this.state.value);
  };

  // about tree-select
  handleTreeSelectChange = value => {
    this.setState({ value });
  }

  // about tree-select
  renderTreeSelect () {
    const tProps = {
      treeData: this.state.treeData,
      value: this.state.value,
      onChange: this.handleTreeSelectChange,
      onSearch: this.handleTreeSelectSearch
    };
    return (
      <div style={{ textAlign: 'center' }}>
        <MainTreeSelect {...tProps}/>
      </div>
    );
  }

  // modal
  showModal = () => {
    this.setState({ visible: true });
  }
  handleCancel = () => {
    this.setState({ visible: false });
  }
  handleCreate = () => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      console.log('Received values of form: ', values);
      form.resetFields();
      this.setState({ visible: false });
    });
  }
  saveFormRef = (formRef) => {
    this.formRef = formRef;
  }

  render() {
    const props = {
      modalProps: this.state.modalProps,
      modalVisible: this.state.visible,
      onOK: this.handleCreate,
      onCancel: this.handleCancel
    }
    return (
      <PageHeaderLayout title="角色管理" content={this.renderTreeSelect()}>
        <Card bordered={false}>
          <Table bordered dataSource={this.state.data} columns={this.columns} />
          <CreateForm {...props} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
