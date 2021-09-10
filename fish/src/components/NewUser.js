import React from 'react'
import { Button, Form, Input } from 'semantic-ui-react'
import { Modal, Message } from 'semantic-ui-react'

import {bS} from '../BabyTalk'

class NewUser extends React.Component {

    state = {
	_userName : null,
	_passWord : null,
	_repeatPass : null,
	_email: null,
	_location: null,

	errorState : {  // field is in error?
	    _userName: false,
	    _passWord : false,
	    _repeatPass : false,
	    _email: false,
	    _location: false,
	},
	errorMessage: null,
	inError: false,
	success: false
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

    async handleChange(e){
	this.setState ({ [e.target.name] : e.target.value })

	// reset errorMessage
	this.setState( { inError : false })

	// user is typing in e.target.name
	
	let eS = this.state.errorState;
	eS.[e.target.name] = false  // reset error if true

	if (e.target.name === '_userName' && e.target.value.length >= 5){
	    
	   var data = await bS.post("/userExists", {
	     	userName: e.target.value
	    })
	    eS.["_userName"] = data;
	    //{content: "This fish already exists...",
	    //		     pointing: 'below'};  // reset error if true
	    this.setState ({ errorState : eS }) // async call
	}

    }
localChange = this.handleChange.bind(this)

	
    async handleSubmit(e){
	
	e.preventDefault();

	// validation of inputs
	var eS = this.state.errorState;
	eS._userName  = (this.state._userName == null) || (this.state._userName.length < 5)
	eS._passWord  = (this.state._passWord == null)
	eS._repeatPass  = (this.state._passWord !== this.state._repeatPass) || eS._passWord
	eS._email  = (this.state._email == null)

	var anyError = 	eS._userName  || eS._repeatPass  || eS._email || eS._passWord

	if (anyError){
	    this.setState({errorState : eS })
	    return
	}
	// no errors, lets hit the babyServer
	  var data = await bS.post("/register", {
			userName: this.state._userName,
			passWord: this.state._passWord,
			email: this.state._email,
			location: this.state._location
	  })

	if (data.id === -1){
	    this.setState({inError: true})
	    this.setState({errorMessage: "Fish not created.. fish egg was bad?"})
	} else {
	    this.setState({success: true})
	}

    }
    localSubmit = this.handleSubmit.bind(this)

    goBack(rE, data){
	this.setState({success: false})
    }

  render(){
      return(
	      <div>

	      <SuccessModal visible = {this.state.success}
                 userName = {this.state._userName}
                 goLogin = {this.props.kill}
                 goBack = {this.goBack.bind(this)}
	      />
	      
	  
	      <Form onSubmit = {this.localSubmit} error = {this.state.inError}>
	      <Form.Field required 	  error = {this.state.errorState._userName}
>
	      <label>User Name</label>
				<Input placeholder='User Name' icon='user' type="text"
		            	name = "_userName" onChange= {this.localChange} 
          iconPosition='left'
	      />
			</Form.Field>

			<Form.Field required error = {this.state.errorState._passWord} >
				<label>Password</label>
				<Input placeholder='Password' icon='lock' type="password"
			name = "_passWord" onChange= {this.localChange} 
			iconPosition='left'

			content={this.state.passMessage}
			  />
			</Form.Field>

	      <Form.Field required error = {this.state.errorState._repeatPass} >
				<label>Enter Password Again</label>
				<Input placeholder='Password' icon='lock' type="password"
			name = "_repeatPass" onChange= {this.localChange} 
			iconPosition='left'

			/>
			</Form.Field>
			<Form.Field required 	error = {this.state.errorState._email} >
				<label>Email</label>
				<Input placeholder='email' icon='mail' type="email"
			name = "_email" onChange= {this.localChange} 
			iconPosition='left'
			content={this.state.emailMessage}

			/>
			</Form.Field>
			<Form.Field >
				<label>Location</label>
				<Input placeholder='Location' icon='location arrow' type="text"
			name = "_location" onChange= {this.localChange} 
		iconPosition='left'/>
			</Form.Field>
	      <Button color='green'  > Make a new Fish</Button>
	      <Message error content = {this.state.errorMessage} />
	  
	      </Form>
	  </div>
      )
}
}


class SuccessModal  extends React.Component {

    render(){
	return (
        <Modal 
        open = {this.props.visible}
        dimmer = "blurring"
        size="small"
        >
        <Modal.Header>{this.props.userName}, Welcome to 3Fish</Modal.Header>
          <Modal.Content>
		<p>A new fish was born.</p>

		<Button color='blue' content = 'Make another fish'
	    onClick = {this.props.goBack}/>

		<Button color='green' content = 'Login to 3Fish'
	    onClick = {this.props.goLogin}/>
	    
          </Modal.Content>
		</Modal>
	);
    }
}

export default NewUser;

