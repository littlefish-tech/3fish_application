import React, { Component } from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Icon, Divider, Grid, Dropdown, Input, Container, Button, Form } from 'semantic-ui-react'
import {
    DateInput, TimeInput
} from 'semantic-ui-calendar-react';
import {bS} from '../BabyTalk'	    

class EventInput extends Component{
    state={
        startDate: "",
        durations: [
            {key: 1, text:"15 mins", value: "15"  },
            {key: 2, text:"30 mins", value:"30"},
            {key: 3, text:"45 mins", value:"45"},
            {key: 4, text:"1 hour", value:"60"},
            {key: 5, text:"2 hours", value:"120"},
        ],
	startTimes: [
	    {key: 40, text:"10:00" , value: "10:00"},
	    {key: 41, text:"10:15" , value: "10:15"},
	    {key: 42, text:"10:30" , value: "10:30"},
	    {key: 43, text:"10:45" , value: "10:45"},
	    {key: 44, text:"11:00" , value: "11:00"},
	    {key: 45, text:"11:15" , value: "11:15"},
	    {key: 46, text:"11:30" , value: "11:30"},
	    {key: 47, text:"11:45" , value: "11:45"},
	    {key: 48, text:"12:00 Noon" , value: "12:00"},
	    {key: 49, text:"12:15" , value: "12:15"},
	    {key: 50, text:"12:30" , value: "12:30"},
	    {key: 51, text:"12:45" , value: "12:45"},
	    {key: 52, text:"13:00" , value: "13:00"},
	    {key: 53, text:"13:15" , value: "13:15"},
	    {key: 54, text:"13:30" , value: "13:30"},
	    {key: 55, text:"13:45" , value: "13:45"},
	    {key: 56, text:"14:00" , value: "14:00"},
	    {key: 57, text:"14:15" , value: "14:15"},
	    {key: 58, text:"14:30" , value: "14:30"},
	    {key: 59, text:"14:45" , value: "14:45"},
	    {key: 60, text:"15:00" , value: "15:00"},
	    {key: 61, text:"15:15" , value: "15:15"},
	    {key: 62, text:"15:30" , value: "15:30"},
	    {key: 63, text:"15:45" , value: "15:45"},
	    {key: 64, text:"16:00" , value: "16:00"},
	    {key: 65, text:"16:15" , value: "16:15"},
	    {key: 66, text:"16:30" , value: "16:30"},
	    {key: 67, text:"16:45" , value: "16:45"},
	    {key: 68, text:"17:00" , value: "17:00"},
	    {key: 69, text:"17:15" , value: "17:15"},
	    {key: 70, text:"17:30" , value: "17:30"},
	    {key: 71, text:"17:45" , value: "17:45"},
	    {key: 72, text:"18:00" , value: "18:00"},
	    {key: 73, text:"18:15" , value: "18:15"},
	    {key: 74, text:"18:30" , value: "18:30"},
	    {key: 75, text:"18:45" , value: "18:45"},
	    {key: 76, text:"19:00" , value: "19:00"},
	    {key: 77, text:"19:15" , value: "19:15"},
	    {key: 78, text:"19:30" , value: "19:30"},
	    {key: 79, text:"19:45" , value: "19:45"},
	    {key: 80, text:"20:00" , value: "20:00"},
	    {key: 81, text:"20:15" , value: "20:15"},
	    {key: 82, text:"20:30" , value: "20:30"},
	    {key: 83, text:"20:45" , value: "20:45"},
	    {key: 84, text:"21:00" , value: "21:00"},
	    {key: 85, text:"21:15" , value: "21:15"},
	    {key: 86, text:"21:30" , value: "21:30"},
	    {key: 87, text:"21:45" , value: "21:45"},
	    {key: 88, text:"22:00" , value: "22:00"},
	    {key: 89, text:"22:15" , value: "22:15"},
	    {key: 90, text:"22:30" , value: "22:30"},
	    {key: 91, text:"22:45" , value: "22:45"},
	    {key: 92, text:"23:00" , value: "23:00"},
	    {key: 93, text:"23:15" , value: "23:15"},
	    {key: 94, text:"23:30" , value: "23:30"},
	    {key: 95, text:"23:45" , value: "23:45"},
	    {key: 0, text:"00:00 Midnight" , value: "00:00"},
	    {key: 1, text:"00:15" , value: "00:15"},
	    {key: 2, text:"00:30" , value: "00:30"},
	    {key: 3, text:"00:45" , value: "00:45"},
	    {key: 4, text:"01:00" , value: "01:00"},
	    {key: 5, text:"01:15" , value: "01:15"},
	    {key: 6, text:"01:30" , value: "01:30"},
	    {key: 7, text:"01:45" , value: "01:45"},
	    {key: 8, text:"02:00" , value: "02:00"},
	    {key: 9, text:"02:15" , value: "02:15"},
	    {key: 10, text:"02:30" , value: "02:30"},
	    {key: 11, text:"02:45" , value: "02:45"},
	    {key: 12, text:"03:00" , value: "03:00"},
	    {key: 13, text:"03:15" , value: "03:15"},
	    {key: 14, text:"03:30" , value: "03:30"},
	    {key: 15, text:"03:45" , value: "03:45"},
	    {key: 16, text:"04:00" , value: "04:00"},
	    {key: 17, text:"04:15" , value: "04:15"},
	    {key: 18, text:"04:30" , value: "04:30"},
	    {key: 19, text:"04:45" , value: "04:45"},
	    {key: 20, text:"05:00" , value: "05:00"},
	    {key: 21, text:"05:15" , value: "05:15"},
	    {key: 22, text:"05:30" , value: "05:30"},
	    {key: 23, text:"05:45" , value: "05:45"},
	    {key: 24, text:"06:00" , value: "06:00"},
	    {key: 25, text:"06:15" , value: "06:15"},
	    {key: 26, text:"06:30" , value: "06:30"},
	    {key: 27, text:"06:45" , value: "06:45"},
	    {key: 28, text:"07:00" , value: "07:00"},
	    {key: 29, text:"07:15" , value: "07:15"},
	    {key: 30, text:"07:30" , value: "07:30"},
	    {key: 31, text:"07:45" , value: "07:45"},
	    {key: 32, text:"08:00" , value: "08:00"},
	    {key: 33, text:"08:15" , value: "08:15"},
	    {key: 34, text:"08:30" , value: "08:30"},
	    {key: 35, text:"08:45" , value: "08:45"},
	    {key: 36, text:"09:00" , value: "09:00"},
	    {key: 37, text:"09:15" , value: "09:15"},
	    {key: 38, text:"09:30" , value: "09:30"},
	    {key: 39, text:"09:45" , value: "09:45"},
	    
	],
	
	duration : "Duration",
	startTime : "Start Time",
	event_name: "",
	location: null,
	detail : null,
	dateError: false,
	durationError: false,
	titleError: false,
	success: false,
	title: "Fish Event",
	titleColor: "pink",
    }

    componentDidMount(){
	this.props.noMenu(false)
	this.props.setTitle(this.state.title, this.state.titleColor)
    }

    handleChange = (event, {name, value}) => {
        this.setState({dateError: false})
        this.setState({durationError: false})
        this.setState({titleError: false})
        if (this.state.hasOwnProperty(name)) {
            this.setState({ [name]: value });
        }
    }

    newDuration(rE){
	this.setState( {duration: rE.target.value} );
    }
    customstartTime(rE){
	this.setState( {startTime: rE.target.value} );
    }

    inputValidation(rE){
	const startTime = this.state.startDate + " " + this.state.startTime
	const time = new Date(startTime);
	const convertTime = (time.getTime())/1000
	const duration = parseInt(this.state.duration)
	const durationError = isNaN(duration)
	const timeError = isNaN(convertTime)
	const titleError = this.state.event_name === ""
	const anyError = durationError || timeError || titleError
	if (durationError){
            this.setState({durationError: true})
	}
	if (timeError){
            this.setState({dateError: true})
	}
	if(titleError){
            this.setState({titleError: true})
	}

	if (anyError){
	    return null;
	}

	var newEvent = {
	    userName: this.props.curUser.name,
	    creator: this.props.curUser.id,
		event_name: this.state.event_name,
		startTime: convertTime,
		duration:  duration,
		location: this.state.location,
	    detail: this.state.detail
	}
	
	return newEvent;
	
    }

    async handleSubmit(rE) {
	let newEvent = this.inputValidation(rE)
    
	if (!newEvent){
            return
	}
	
	// no errors and we should hit the babyserver
	// create json to send to baby server
	var data = await bS.post("/addEvent", newEvent)

        if (data.id === -1){
            this.setState({inError: true})
            this.setState({errorMessage: "Fish not created.. fish egg was bad?"})
        } else {
            this.setState({success: true})
	}
	this.props.updateFishState("updateEvents", this.props.appState.updateEvents +1)
//	this.props.updateFishState("updateEvents", true)
	
    }
    

    render(){
	return(
		<div >
		<Container>
		<Form  onSubmit={this.handleSubmit.bind(this)}>
		<Form.Field error={this.state.titleError}>
                <label>Title </label>
                <Input placeholder='Title'
            name = "event_name"
	    onChange={this.handleChange} 	    
		/>
		</Form.Field>
<Container>
	    	<Grid columns='3'>
		<Grid.Column>
            <Form.Field error = {this.state.dateError}>
                
                <DateInput
	    
            name="startDate"
            placeholder="Date"
	    closable
        closeOnMouseLeave
        inlineLabel
        dateFormat="MM-DD-YY"
	    markColor = 'teal'
	    animation = ""
            iconPosition="left"
	    value = {this.state.startDate}
            popupPosition="top left"
            onChange={this.handleChange}
                />
                </Form.Field>
		</Grid.Column>
		
		<Grid.Column>
	    	<Dropdown
            options={this.state.startTimes}
	    name = "startTime"
            placeholder={this.state.startTime}
            search
            selection
            fluid
            additionLabel=""
            error={this.state.dateError}
            allowAdditions
            value={this.state.startTime}
            onAddItem={this.customstartTime.bind(this)}
            onChange={this.handleChange}
		/>
		</Grid.Column>

		<Grid.Column>
	    	<Dropdown
            options={this.state.durations}
	    name = "duration"
            placeholder={this.state.duration}
            search
            selection
            additionLabel=""
            fluid
            error = {this.state.durationError}
            allowAdditions
            value={this.state.duration}
            onAddItem={this.newDuration.bind(this)}
            onChange={this.handleChange}
		/>
		</Grid.Column>

	    </Grid>
	    </Container>
        <Divider horizontal={true} />
		<Form.Field>
                <label>Location </label>
                <Input placeholder='Location'
	    name = "location"
	    onChange={this.handleChange} 	    
		/>
		</Form.Field>

                <Form.Field >
		<label>Event detail</label>
		<Input placeholder='Event Description'
	    name = "detail"
            onChange={this.handleChange} 	    
		/>
		</Form.Field>
		
	    {false && <Button type='submit' color="orange">Create Event</Button>}
		<Container textAlign='right'>
		<Icon name = 'plus circle' size = 'big' color = 'pink' onClick= {this.handleSubmit.bind(this)}/>
		</Container> 
		</Form>
		</Container>
		</div>
	)
    }
}

export default EventInput;
