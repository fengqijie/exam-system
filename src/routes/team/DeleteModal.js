import { Modal } from 'antd';

class LocalizedModal extends React.Component {
  state = { visible: true }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  hideModal = () => {
    this.setState({
      visible: false,
    });
  }
  render() {
    const props = {
      iconType: "exclamation-circle",
      title: "Modal",
      visible: this.props.visible,
      onOk: this.hideModal,
      onCancel: this.hideModal,
      title: '提示：',
      okText: "确认",
      cancelText: "取消",
      destroyOnClose: true,
    }
    return (
      <div>
        <Modal {...props} >
          <p>您确定要删除xxx吗？</p>
        </Modal>
      </div>
    );
  }
}

function confirm() {
  Modal.confirm({
    title: 'Confirm',
    content: 'Bla bla ...',
    okText: '确认',
    cancelText: '取消',
  });
}

export default LocalizedModal;