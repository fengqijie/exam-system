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
    Table,
    Badge,
    Divider,
} from 'antd';
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

export default renderForm