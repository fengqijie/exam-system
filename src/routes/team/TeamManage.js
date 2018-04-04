import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Col,
  Card,
  Form,
  Icon,
  Input,
  Button,
  Dropdown,
  Modal,
  message,
  Table,
} from 'antd';

const ButtonGroup = Button.Group;
const confirm = Modal.confirm;
const FormItem = Form.Item;

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './TeamManage.less';
import MainTreeSelect from './MainTreeSelect';
import DeleteModal from './DeleteModal';

const FormModal = Form.create()(
  class extends React.Component {
    render() {
      const { data, visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      const targetData = data.filter(item => item.isCurrent)[0] || {};
      const props = targetData.isEditing
      ? { title: `修改职位：${targetData.job}`, okText: '修改' }
      : { title: `为职位：${targetData.job} 增加下一级`, okText: '增加' }

      return (
        <Modal
          visible={visible}
          title="提示"
          okText="确定"
          onCancel={onCancel}
          onOk={onCreate}
          {...props}
        >
          <Form layout="vertical">
            <FormItem label={<span>职位</span>}>
              {getFieldDecorator('job', {
                rules: [{ required: true, message: '请输入职位', whitespace: true }],
              })(<Input placeholder='请输入职位' />)}
            </FormItem>
            <FormItem label={<span>备注</span>}>
              {getFieldDecorator('remark', {
                rules: [{ required: false, message: '请输入备注', whitespace: true }],
              })(<Input.TextArea placeholder='请输入备注' />)}
            </FormItem>
          </Form>
        </Modal>
      );
    }
  }
);

@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))

@Form.create()

export default class TableList extends PureComponent {
  state = {
    data: [
      {key: 1, name: '领导1', manager: '张三', id: 123, phone: 123, address: '石家庄市长安区北二环', children: [
        {key: 12, name: '小领导2', manager: '张三', id: 123, phone: 123, address: '石家庄市长安区北二环'},
        {key: 13, name: '小领导3', manager: '张三', id: 123, phone: 123, address: '石家庄市长安区北二环'},
        {key: 14, name: '小领导4', manager: '张三', id: 123, phone: 123, address: '石家庄市长安区北二环'},
        {key: 15, name: '小领导5', manager: '张三', id: 123, phone: 123, address: '石家庄市长安区北二环'},
      ]},
      {key: 2, name: '领导2', manager: '张三', id: 123, phone: 123, address: '石家庄市长安区北二环'},
      {key: 3, name: '领导3', manager: '张三', id: 123, phone: 123, address: '石家庄市长安区北二环'},
      {key: 4, name: '领导4', manager: '张三', id: 123, phone: 123, address: '石家庄市长安区北二环'},
      {key: 5, name: '领导5', manager: '张三', id: 123, phone: 123, address: '石家庄市长安区北二环'},
      {key: 6, name: '领导6', manager: '张三', id: 123, phone: 123, address: '石家庄市长安区北二环'}
    ],
    treeData: [],
    value: [],
    visibleFormModal: false,
    visibleDeleteModal: false,
    deleteModalText: '',
    confirmLoading: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
    });
  } 

  columns = [
    {
      title: '组织名称',
      dataIndex: 'name',
    }, {
      title: '组织代码',
      dataIndex: 'id',
    }, {
      title: '地址',
      dataIndex: 'address',
    }, {
      title: '联系方式',
      dataIndex: 'phone',
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => {
        const { editable } = record;
        return (
          <ButtonGroup>
            <Button icon="plus" onClick={() => this.handleAdd(record.key)}>增加下级组织</Button>
            <Button icon="edit" onClick={() => this.handleEdit(record.key)}>修改</Button>
            <Button icon="delete" onClick={() => this.handleDelete(record.key)} type="danger">删除</Button>
          </ButtonGroup>
        );
      },
    }
  ];

  handleAdd = (key) => {
    const newData = [...this.state.data];
    newData.forEach(item => {
      item.isCurrent = item.key === key;
      item.isEditing = false;
    })
    this.setState({ data: newData, visibleFormModal: true });
  }

  handleDelete = (key) => {
    const newData = [...this.state.data];
    newData.forEach(item => item.isCurrent = item.key === key )
    const filterData = newData.filter(item => item.isCurrent)[0];
    let text = `即将删除职位：${filterData.job} 及其下属职位`;
    this.setState({ visibleDeleteModal: true, deleteModalText: text });
  }

  handleEdit(key) {
    const newData = [...this.state.data];
    newData.forEach(item => {
      item.isCurrent = item.key === key;
      item.isEditing = true;
    })
    this.setState({ data: newData, visibleFormModal: true });
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
  handleFormModalCancel = () => {
    const form = this.formRef.props.form
    form.resetFields();
    this.setState({ visibleFormModal: false });
  }
  handleFormModalCreate = () => {
    const form = this.formRef.props.form
    form.validateFields((err, values) => {
      if (err) { return; }

      form.resetFields();
      this.setState({ visibleFormModal: false });
      console.log('Received values of form: ', values);

      this.handleData(values);
    });
  }
  saveFormRef = (formRef) => {
    this.formRef = formRef;
  }

  handleData (values) {
    const newData = [...this.state.data];
    newData.forEach(item => {
      if (item.isCurrent) {
        if (item.isEditing) {
          Object.assign(item, values);
          message.success('修改成功！')
        } else {
          item.children = item.children || [];
          item.children.push(values);
          message.success('添加成功！')
        }
      }
    });
    this.setState({ data: newData });
  }

  handleDeleteModalCancel = () => {
    this.setState({ visibleDeleteModal: false });
  }
  handleDeleteModalOk = () => {
    const newData = [...this.state.data];
    const filterData = newData.filter(item => item.isCurrent)[0];
    console.log(filterData)
    
    this.setState({ confirmLoading: true });

    setTimeout(() => {
      message.success('删除成功');
      this.setState({ visibleDeleteModal: false, confirmLoading: false });
    }, 2000);
  }

  render() {
    return (
      <PageHeaderLayout title="组织结构管理" content={this.renderTreeSelect()}>
        <Card bordered={false}>
          <Table bordered dataSource={this.state.data} columns={this.columns} />
          <FormModal
            wrappedComponentRef={this.saveFormRef}
            visible={this.state.visibleFormModal}
            onCancel={this.handleFormModalCancel}
            onCreate={this.handleFormModalCreate}
            data={this.state.data}
          />
          <DeleteModal 
            visible={this.state.visibleDeleteModal}
            onOk={this.handleDeleteModalOk}
            onCancel={this.handleDeleteModalCancel}
            confirmLoading={this.state.confirmLoading}
            ModalText={this.state.deleteModalText}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
