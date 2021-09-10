import React from 'react';
import 'semantic-ui-css/semantic.min.css'
// import axios from 'axios';
import Register from "./Register"
import { Button, Form, Grid, Header,Message, Segment } from 'semantic-ui-react'
import {bS} from '../BabyTalk'
import {gS} from '../gSession'


class LoginDialog extends React.Component{
    state = {
	_userName : null,
	_passWord : null,
	Message : null,
	inError : false,
    }

   async handleSubmit(e){
        e.preventDefault();  // don't reload the page
        let uData = { userName: this.state._userName, passWord: this.state._passWord }

        // axios.post('/loginVerify', uData)
        //     .then(res => {                // and add it to the post
	// 	// we want to update the App state!!
	// 	// this component wants to update App's curUser
	// 	if (res.data.id === -1) {
	// 	    this.setState({Message :  "Login failure"})
	// 	    this.setState({inError : true})
	// 	}
	// 	else {
	// 	    this.props.updateAppState(this.props.appKey, res.data);
	// 	}
        //     }).catch(err => {
	// 	console.log(err)
	//     })


       var data =  await bS.send('/loginVerify', uData)  // talks to the babyServer

	
	if (data.id === -1) {
	    this.setState({Message :  "Login failure"})
	    this.setState({inError : true})
	}
	else {
	    gS.setCreds(data)
	    await gS.restore() // wait until we get the session
	    //back from the server
	    this.props.updateAppState(this.props.appKey, data);
	    // setting the curUser in App 
	    // set the username 
	}

    }

    handleChange(e) {
	this.setState( {[ e.target.name ] : e.target.value} );

	if (this.state.inError){
	    this.setState({ inError: false});
	}

	
    }

    localChange = this.handleChange.bind(this);
    localSubmit = this.handleSubmit.bind(this);

    render() {
	return (
	    <div>
		<Header as='h2' color='teal' textAlign='center'>
		Fish Login 
	    </Header>
		<Form size='large' onSubmit = {this.localSubmit} error={this.state.inError}>
            <Segment stacked>
		<Form.Input fluid icon='user'
	            iconPosition='left' placeholder='UserName' type="text"
                    name = "_userName" onChange= {this.localChange} 
		/>
		
		<Form.Input fluid  icon='lock' iconPosition='left'
          	    placeholder='Password' type='password'
                    name = "_passWord"   onChange={this.localChange} 
		/>

		<Button color='teal' fluid size='large'>
                   Login
                </Button>
		<Message error content = {this.state.Message} />

            </Segment>
		</Form>
	    </div>
	);
    }
}


class RegisterButton extends React.Component{
    render() {
	return(
		<Button color='orange' fluid onClick={this.props.show}>
      		Register New Fish
                </Button>
	)
    }
}

class LoginForm extends React.Component{
    state = {
	showRegister : false,  // control the visibility of Register Modal
	// initially  false
	// goes to true when Register button is clicked
	// goes to false when we close the Register Modal
    }

    showModal(e){
	this.setState ({showRegister:  true})
    }
    
    killModal(e){
	this.setState ({showRegister:  false})
    }

    render(){
	return (
	    <div>

		<Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
		<Grid.Column style={{ maxWidth: 450 }}>

		<Register show = {this.state.showRegister} kill = {this.killModal.bind(this)} />

		<LoginDialog  	updateAppState = {this.props.updateAppState}
                   appKey = {this.props.appKey} />

		<RegisterButton  show = {this.showModal.bind(this)} />

                </Grid.Column>
		</Grid>
	    
		</div>
    )
    }
}

export default LoginForm;
