import React, { PureComponent, Fragment } from 'react';
import {
    Row,
    Col,
    Form,
    Input,
    Icon,
    Button,
    TreeSelect,
} from 'antd';

import styles from './DeleteModal.less';

export default class DeleteModal extends PureComponent {
    state = {
        isLoadTreeData: true,
        treeData: [],
        value: [],
        size: 'large',
        allowClear: true,
        treeCheckStrictly: true,
        treeCheckable: true,
        showCheckedStrategy: TreeSelect.SHOW_ALL,
        searchPlaceholder: 'Please select',
    };

    render() {
        const selectProps = { ...this.state, ...this.props };
        selectProps.treeData = [
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
        ]
        return (
            <Form onSubmit={() => { }} layout="inline">
                <Row className={styles.mainSearch} gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col className={styles.treeSelect} md={10} sm={20}>
                        <TreeSelect {...selectProps} />
                    </Col>
                    <Col className={styles.searchButton} md={2} sm={4}>
                        <span className={styles.submitButtons}>
                            <Button
                                loading={!selectProps.isLoadTreeData}
                                size={selectProps.size}
                                type="primary"
                                htmlType="submit">
                                查询
                            </Button>
                        </span>
                    </Col>
                </Row>
            </Form>
        );
    }
}