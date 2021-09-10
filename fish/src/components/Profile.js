import React from 'react'
import axios from 'axios'
import { Button, Modal, Form, Input, Message } from 'semantic-ui-react'

class Profile extends React.Component{
    state = {
        _userName :this.props.curUser.name,
        _passWord : this.props.curUser.password,
        _repeatPass : this.props.curUser.password,
        _email: this.props.curUser.email,
        _location: this.props.curUser.location,
        
        errorState : {  // field is in error?
            _passWord : false,
            _repeatPass : false
        },
        errorMessage: null,
        inError: false,
        success: false,
        allowSubmit: false,
        loading: false,
        updatedMessage: null,
        updatedVisible: false,
	cancelDisabled: false
    }
    
    
    //  write the onChange callback
    //    put user input into component state
    
    //  write the onSubmit callback
    //    create a newUser structure/JSON using component state
    //    talk to the babyServer  --- deal with newUser blah
    //       babyServer will say yes or no.. or give an error?
    //
    //    if  all OK,
    //          show user a message
    
    handleChange(e){
        this.setState ({ [e.target.name] : e.target.value })
        this.setState({allowSubmit: true})
	
        // reset errorMessage
        this.setState( { inError : false })
	
        // user is typing in e.target.name
        
        let eS = this.state.errorState;
        eS.[e.target.name] = false  // reset error if true
        this.setState ({ errorState : eS })
	
    }
    localChange = this.handleChange.bind(this)

    handleSubmit(e){
        e.preventDefault()
        this.setState({loading: true})
        var eS = this.state.errorState;
        eS._passWord  = (this.state._passWord == null)
        eS._repeatPass  = (this.state._passWord !== this.state._repeatPass) || eS._passWord
	
        var anyError = eS._repeatPass || eS._passWord
	
        if (anyError){
            this.setState({errorState : eS })
            return
        }

        axios.post("/updateUser", {
	    userName: this.state._userName,
	    passWord: this.state._passWord,
	    email: this.state._email,
	    location: this.state._location
	}, {timeout: 2000} // 2000 milliseconds 
		  )
	    .then(res => {
		console.log(res.data)
		this.props.updateAppState(this.props.appKey, res.data);
		this.setState({allowSubmit: false})
		// this.props.kill()
		this.setState({loading:false})
		this.setState({updatedVisible: true})
		this.setState({cancelDisabled: true})
		this.setState({updatedMessage: "Fish Profile Updated"})
	    }).catch(err => {
		console.log("timed out");
	    })
    }
    localSubmit = this.handleSubmit.bind(this)

    killVisible(e){
	this.setState({cancelDisabled: false})
	this.setState({updatedVisible:false})
	this.props.kill()
    }

    render(){
	return (
		<Modal
            open={this.props.showUpdate}
            closeIcon
            onClose={this.props.kill}
		>
		<Modal.Header>Update {this.props.curUser.name} profile</Modal.Header>
		<Modal.Content>
		<div>


		<Form onSubmit = {this.localSubmit} error = {this.state.inError}  loading = {this.state.loading}>

		<Form.Field required error = {this.state.errorState._passWord} >
		<label>Password</label>
		<Input placeholder="New Password" icon='lock' type="password"
	    name = "_passWord" onChange= {this.localChange} 
	    iconPosition='left'
	    content={this.state.passMessage}
		/>
		</Form.Field>

		<Form.Field required error = {this.state.errorState._repeatPass} >
		<label>Enter Password Again</label>
		<Input placeholder="repeat Password" icon='lock' type="password"
	    name = "_repeatPass" onChange= {this.localChange} 
	    iconPosition='left'

		/>
		</Form.Field>
		<Form.Field required 	error = {this.state.errorState._email} >
		<label>Email</label>
		<Input placeholder={this.props.curUser.email} icon='mail' type="email"
	    name = "_email" onChange= {this.localChange} 
	    iconPosition='left'
	    content={this.state.emailMessage}

		/>
		</Form.Field>
		<Form.Field >
		<label>Location</label>
		<Input placeholder={this.props.curUser.location} icon='location arrow' type="text"
	    name = "_location" onChange= {this.localChange} 
	    iconPosition='left'/>
		</Form.Field>
		<Button disabled = {!this.state.allowSubmit} color='green'  > Update Fish</Button>
		<Button onClick={this.killVisible.bind(this)} color='grey'
	    disabled = {this.state.cancelDisabled}> Cancel </Button>

		<Message error content = {this.state.errorMessage} />

		<Message info floating size='big'
            onClick={this.killVisible.bind(this)}
            onDismiss={this.killVisible.bind(this)}
            hidden = {!this.state.updatedVisible}
            content = {this.state.updatedMessage} />


	    </Form>
		</div>
		</Modal.Content>
		<Modal.Actions>

	    </Modal.Actions>
		</Modal>
	)}
}

export default Profile
