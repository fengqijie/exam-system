// import {
//   Form,
//   Input,
//   Col,
// } from 'antd';
// const FormItem = Form.Item;

// class RegistrationForm extends React.Component {
//   state = {
//   };
//   handleSubmit = e => {
//     e.preventDefault();
//   };

//   render() {
//     const { getFieldDecorator } = this.props.form;
//     return (
//       <Form onSubmit={this.handleSubmit}>
        // <FormItem label={<span>职位</span>}>
        //   {getFieldDecorator('job', {
        //     rules: [{ required: true, message: '请输入职位', whitespace: true }],
        //   })(<Input placeholder='请输入职位' />)}
        // </FormItem>
        // <FormItem label={<span>备注</span>}>
        //   {getFieldDecorator('remark', {
        //     rules: [{ required: false, message: '请输入备注', whitespace: true }],
        //   })(<Input.TextArea placeholder='请输入备注' />)}
        // </FormItem>
//       </Form>
//     );
//   }
// }

// const WrappedRegistrationForm = Form.create()(RegistrationForm);

// export default WrappedRegistrationForm;

