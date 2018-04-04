import { Modal } from 'antd';

export default class DeleteModal extends React.Component {
  render() {
    const props = {
      okType: 'danger',
      title: this.props.ModalTitle || '请确认',
      visible: this.props.visible,
      onOk: this.props.onOk,
      onCancel: this.props.onCancel,
      confirmLoading: this.props.confirmLoading,
    }
    return (
      <div>
        <Modal {...props}>
          <p>{this.props.ModalText}</p>
        </Modal>
      </div>
    );
  }
}