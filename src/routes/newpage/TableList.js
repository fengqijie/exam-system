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
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import AddUser from './AddUser';

const WrappedRegistrationForm = Form.create()(AddUser);

import styles from './TableList.less';

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
    sorter: true,
    align: 'right',
    render: val => `${val} 万`,
    // mark to display a total number
    needTotal: true,
  },
  {
    title: '身份证号',
    dataIndex: 'status',
    filters: [
      {
        text: status[0],
        value: 0,
      },
      {
        text: status[1],
        value: 1,
      },
      {
        text: status[2],
        value: 2,
      },
      {
        text: status[3],
        value: 3,
      },
    ],
    render(val) {
      return <Badge status={statusMap[val]} text={status[val]} />;
    },
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
    selectedRows: [],
    formValues: {},
    value: [],
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

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'rule/fetch',
        payload: values,
      });
    });
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

  onTreeSelectChange = value => {
    console.log('onChange ', value, arguments);
    this.setState({ value });
  };

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const treeData = [
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
    ];
    const tProps = {
      treeData,
      value: this.state.value,
      onChange: this.onTreeSelectChange,
      treeCheckable: true,
      showCheckedStrategy: TreeSelect.SHOW_ALL,
      searchPlaceholder: 'Please select',
    };

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          {/* <Col md={2} sm={24} style={{'text-align': 'right'}}>
            组织名称
          </Col> */}
          <span style={{ float: 'left', 'line-height': '32px' }}>组织名称：</span>
          <Col md={10} sm={24}>
            <TreeSelect {...tProps} />
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { rule: { data }, loading } = this.props;
    const { selectedRows, modalVisible } = this.state;

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderLayout title="查询表格">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新增
              </Button>
              <div className="">
                <Upload {...uploadProps}>
                  <Button type="primary">
                    <Icon type="upload" /> 批量导入用户信息
                  </Button>
                </Upload>
                <Button
                  icon="download"
                  type="primary"
                  onClick={() => this.handleDownloadTemplate()}
                >
                  execl 模板下载
                </Button>
              </div>
              {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
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
