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
  Dropdown,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import AddUser from './UserAdd';

const WrappedRegistrationForm = Form.create()(AddUser);

import styles from './UserManage.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];
const columns = [
  {
    title: '序号',
    dataIndex: 'key',
  },
  {
    title: '姓名',
    dataIndex: 'owner',
  },
  {
    title: '登陆账号',
    dataIndex: 'no',
  },
  {
    title: '身份证号',
    dataIndex: 'status'
  },
  {
    title: '工号',
    dataIndex: 'updatedAt',
    sorter: true,
    render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
  },
  {
    title: '岗位',
    dataIndex: 'title',
  },
  {
    title: '岗位兼职',
    dataIndex: 'description',
  },
  {
    title: '联系电话',
    dataIndex: 'href',
  },
  {
    title: '所属组织',
    dataIndex: 'callNo',
  },
  {
    title: '照片',
    render: () => (
      <Fragment>
        <a href="{{avatar}}">avatar</a>
      </Fragment>
    ),
  },
  {
    title: '操作',
    render: () => (
      <Fragment>
        <a href="">修改</a>
        <Divider type="vertical" />
        <a href="">删除</a>
      </Fragment>
    ),
  },
];

const uploadProps = {
  name: 'file',
  action: '//jsonplaceholder.typicode.com/posts/',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      title="新增用户基本信息"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <WrappedRegistrationForm />
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
    modalVisible: false,
    expandForm: false,
    isLoadTreeData: true,
    selectedRows: [],
    formValues: {},
    value: [],
    treeData: [
      {
        label: 'Node1',
        value: '0-0',
        key: '0-0',
        children: [
          {
            label: 'Child Node1',
            value: '0-0-0',
            key: '0-0-0',
          },
          {
            label: 'Child Node6',
            value: '0-0-1',
            key: '0-0-1',
          },
          {
            label: 'Child Node7',
            value: '0-0-2',
            key: '0-0-2',
          },
          {
            label: 'Child Node8',
            value: '0-0-3',
            key: '0-0-3',
          },
          {
            label: 'Child Node9',
            value: '0-0-4',
            key: '0-0-4',
          },
        ],
      },
      {
        label: 'Node2',
        value: '0-1',
        key: '0-1',
        children: [
          {
            label: 'Child Node3',
            value: '0-1-0',
            key: '0-1-0',
          },
          {
            label: 'Child Node4',
            value: '0-1-1',
            key: '0-1-1',
          },
          {
            label: 'Child Node5',
            value: '0-1-2',
            key: '0-1-2',
          },
        ],
      },
    ],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'rule/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'rule/fetch',
      payload: {},
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };
  
  onTreeSelectChange = value => {
    this.setState({ value });
  };

  handleSearch = e => {
    e.preventDefault();
    console.log(this.state.value)
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleDownloadTemplate = () => {
    message.info('下载 execl 模板');
  };

  handleAdd = fields => {
    this.props.dispatch({
      type: 'rule/add',
      payload: {
        description: fields.desc,
      },
    });

    message.success('添加成功');
    this.setState({
      modalVisible: false,
    });
  };

  renderForm() {
    let searchSize = 'large';
    const tProps = {
      treeData: this.state.treeData,
      allowClear: true,
      treeCheckStrictly: true,
      size: searchSize,
      value: this.state.value,
      onChange: this.onTreeSelectChange,
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

  renderAddUserButtons () {
    return (
      <Fragment>
        <Button icon="plus" type="primary"
          onClick={() => this.handleModalVisible(true)}
        >
          新增
        </Button>
        <Upload {...uploadProps}>
          <Button icon="upload" type="primary">批量导入用户信息</Button>
        </Upload>
        <Button icon="download" type="primary"
          onClick={() => this.handleDownloadTemplate()}
        >
          execl 模板下载
        </Button>
      </Fragment>
    );
  }

  render() {
    const { rule: { data }, loading } = this.props;
    const { selectedRows, modalVisible } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderLayout title="用户管理" content={this.renderForm()}>
        <Card bordered={false}> 
          <div className={styles.tableList}>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderLayout>
    );
  }
}
