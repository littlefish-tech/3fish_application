import React, { Component } from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Header, Grid, Icon, Item, List } from 'semantic-ui-react'
import moment from 'moment'
import {bS} from '../BabyTalk'

class EventList extends Component{

    state = {
	title : 'Fish Events',
	events : [],
	eventSeq : 0,
	headerColor : 'blue',
	refreshColor : 'grey',
	refreshSeq : 0
    }
    

    processEventList(events){
	this.setState({events : events})
    }

    findEventsById(id){
	let event= this.state.events.filter(ev => ev.id === id)
	return event[0]
    }


    editEvent(rE, {name, value}){
	console.log("edit")
	console.log(value)
	console.log(this.findEventsById(value))
    }

    async modifyEventStatus(eid){

	let delData = {
	    userName   : this.props.curUser.name,
	    eventID : eid
	}

		
	let data = await bS.post('/deleteEvent', delData)


	if (data){
	    this.props.updateFishState("updateEvents", this.props.appState.updateEvents +1)
	}
	else{
	    this.props.setError(true);
	    console.log("babyserver laid an egg");
       }


	// update the event list
	
	//this.getEvents();
	
    }
    
    deleteEvent(rE, {name, value}){
	this.modifyEventStatus(value)
	
	
    }

    EventDisplay(ev){

	var a = new Date(ev.time * 1000);
	var time = moment(a).format('LLL')
	var duration = moment.duration(ev.duration, "minutes").humanize()
	var loc = ev.location? "at " + ev.location : ""
	var disabled = (ev.status === 0)
	if (disabled){
	    return ("")
	}
  
	return (  <List.Item key = {ev.id} >
		  <Item >
		  
		  <Item.Content >
		  <Item.Header>
		  <Grid columns = {2}>
		  <Grid.Column >
		  <Header color='teal' content={ev.event_name} disabled={disabled}/>
		  </Grid.Column>
		  <Grid.Column textAlign='right'>
		  {!disabled && <Icon name = 'edit' size = 'small' color='grey' value={ev.id}
		  onClick={this.editEvent.bind(this)}
		   disabled={disabled}/>}
		  {!disabled && <Icon name = 'delete' size = 'small' color='grey' value={ev.id}
		   onClick={this.deleteEvent.bind(this)}
		   disabled={disabled}/>}
		  </Grid.Column>
		  </Grid>
		  </Item.Header>
		  <Item.Meta>{time  + " " + "(" + duration + ") " + loc } </Item.Meta>
		  <Item.Description>
		  {ev.detail}
		  </Item.Description>
		  </Item.Content>
		  </Item>
		  
		  </List.Item>)
    }

   async  getEvents(){
       var data = await bS.post(
           "/getAllEvents", {
	       userName: this.props.curUser.name,
	   })
       // waits until await has completed

       if (data){
	   this.processEventList(data)
       }
       else{
	   this.props.setError(true);
	   console.log("babyserver laid an egg")
       }
   }


    updateTitleColor(c){
	this.props.setTitle(this.state.title, c)
    }

    checkEventUpdate(){
	
	if (!this.props.appState.updateEvents){
	    this.props.updateFishState("updateEvents", 0)
	}
	
	if (this.props.appState.updateEvents > this.state.eventSeq){
		this.refreshEvents()
	    this.setState({eventSeq : this.props.appState.updateEvents})
	}
	else{
	    //console.log("event list unchanged")
	    //this.setState({headerColor: 'orange'})
	    //setTimeout(this.updateEventList.bind(this), 50);
	}
    }

    componentDidUpdate(oldProps){
	if (oldProps.triggerRefresh < this.props.triggerRefresh){
	    this.setState({refreshSeq : this.props.triggerRefresh})
	    this.refreshEvents()
	}
    }

    componentDidMount(){
	this.props.noMenu(false)
	this.props.setError(false);
	this.props.setTitle(this.state.title, this.state.headerColor)
	this.refreshEvents();

	this.timer = setInterval(()=> this.checkEventUpdate(), 1000)
	this.props.setRefresh("grey", false)
	this.setState({refreshSeq : this.props.triggerRefresh})
    }

    resetRefreshColor(){
	this.updateTitleColor("grey")
	this.props.setRefresh("grey", false)    
}

    refreshEvents(){
	this.props.setRefresh("red", true)
	this.updateTitleColor('orange')
	this.getEvents()
	setTimeout(this.resetRefreshColor.bind(this), 3000)
    }
    
    
    render(){
      		return(

		<div>
			<List animated={true}>
		{
		    this.state.events.map((ev) => this.EventDisplay(ev))
		 // call eventDisplay on every element of state.events
		}
 		</List>
               </div>
	)
    }
}

export default EventList;

