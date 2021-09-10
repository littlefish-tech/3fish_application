import React from 'react'
import { Modal } from 'semantic-ui-react'
// import { Form, Input } from 'semantic-ui-react'
// import axios from 'axios';
import NewUser from "./NewUser"

class Register extends React.Component {
render(){
    return (
      <Modal
        open={this.props.show}  // controls whether modal is visible or not!
        closeIcon
        dimmer = 'blurring'
        onClose = {this.props.kill}
        size = 'tiny' 
       >
        <Modal.Header >New Fish</Modal.Header>
        <Modal.Content>
            <NewUser kill = {this.props.kill}/>
            </Modal.Content>
	    
      </Modal>

	
    );
  }
}
export default Register;

