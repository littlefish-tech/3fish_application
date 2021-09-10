import React from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Container, Input, Dropdown, Divider, Segment,Icon, Header, Grid} from 'semantic-ui-react'
import EventInput from "./EventInput"
import EventList from "./EventList"
import Weather from "./Weather"
import WorldClock from "./WorldClock"
import Poetry from "./Poetry"

import {gS} from '../gSession'

class TitleBar extends React.Component{
    state = {
	kill : false
    }

    killTitle(rE, {name, value}){
	this.props.killPane(rE,{name, value})
    }

	showRefresh(){
		return(
			<Icon name='sync'  color = {this.props.showRefresh} loading={this.props.refreshLoading} 
		    onClick = {this.props.refresh}/>
		)
	}

    	showError(){
		return(
			<Icon name='exclamation triangle'  color = "red" />
		)
	}

    titleBar(){
	     	return (
		<Grid columns ={2}>
			<Grid.Column>
			<Header as="h2" content = {this.props.title} color = {this.props.titleColor}/>
		</Grid.Column>
		<Grid.Column>
    			<Container textAlign='right'>
			{this.props.showError && this.showError()}
			{this.props.showRefresh && this.showRefresh()}
     	    	<Icon name='window close' size = 'large' color = 'orange' value = {this.props.position}
     	         onClick = {this.killTitle.bind(this)}/>
     		    </Container>
		</Grid.Column>
		</Grid>
     	)
    }
    titleBar = this.titleBar.bind(this) 

    render(){
     	return (
	    <div>
		{this.props.noMenu ? "" : this.titleBar() }
	    	</div>
     	)
     }


}

class NoComponent extends React.Component{
    state = {
	addComp : false  // show dropdown?
    }

    componentDidMount(){
	this.props.noMenu(true)
    }

    addComponent(rE, {name, value}){
	this.props.updateGrid(this.props.rIndex, 
			      this.props.cIndex,
			     value)

    }

    flipComp(rE){
	this.setState({addComp: true})
    }
    
    showDropdown(rE){
	return (
	    	<Segment basic textAlign={"center"}>
	    <Input >
		<Dropdown
	    text = "Components"
	    fluid = {true} 
	    selection
	    defaultOpen = {true}
	    //placeholder = "Components"
	    options={compsDropdown}
	    onChange =  {this.addComponent.bind(this)}
		/>
		</Input>
		</Segment>
    );
    }

    showIcon(){
	return (
	    <Segment basic textAlign={"center"}>
	    <Divider hidden />
		<Icon name='add circle' size = 'large' color = 'orange'
	    onClick = {this.flipComp.bind(this)}/>
		</Segment>
	)
	    
    }
    
    render(){
	return(
		<div>
		{ !this.state.addComp && this.showIcon()}
         	   { this.state.addComp && this.showDropdown()}
		</div>
	)
    }
}

class GridItem extends React.Component{

    state = {
	title: '',
	titleColor : 'orange',
	showRefresh: false,
	refreshLoading : false,
	refresh : 0,
	noMenu : false,
	showError : false
    }

    setNoMenu(b){
	this.setState({noMenu: b})
    }
    
    setTitle(t, color){
	this.setState({title: t})
	this.setState({titleColor: color})
    }

    killItem(rE, {name, value}){
	this.setTitle('', '')
	this.props.kill(rE, {name, value})
	}
	
    setRefresh(c, loading){
	this.setState({showRefresh: c})
	this.setState({refreshLoading: loading})
	}

    setError(e){
	this.setState({showError: e})
    }

    refreshCalled(){
	this.setState({refresh: this.state.refresh+1})
    }

    componentDidUpdate(){
    }

    render (){
	var DynComponent = this.props.Component
	var s = this.props.position
	var ri = this.props.rIndex
	var ci = this.props.cIndex


	
	return(
	    <div>
		<TitleBar position={s} killPane={this.killItem.bind(this)} title={this.state.title}
	    titleColor = {this.state.titleColor} 
	    showRefresh = {this.state.showRefresh}
	    refreshLoading = {this.state.refreshLoading}
	    refresh = {this.refreshCalled.bind(this)}
	    noMenu = {this.state.noMenu}
	    showError = {this.state.showError}
	    setError = {this.setError.bind(this)}
	    containerWidth = {this.props.containerWidth}
		/>

		<DynComponent
	           curUser = {this.props.curUser}
          	   updateFishState = {this.props.updateFishState}
	    appState = {this.props.appState}
            rIndex = {ri} cIndex = {ci}
	    gridID = {this.props.gridID}


	    setTitle={this.setTitle.bind(this)}
	    updateGrid = {this.props.updateGrid}
	    setRefresh={this.setRefresh.bind(this)}
	    triggerRefresh = {this.state.refresh}
	    noMenu  = {this.setNoMenu.bind(this)}
	    setError = {this.setError.bind(this)}
	    containerWidth = {this.props.containerWidth}
		/>
		</div>
	)
    }

}

class FlexGrid extends React.Component{
    // we receive curUser as a prop

    state = {
	numCols : 1,
	numRows : 1,
	
	gridContent : {  // what goes in each cell  r:c
	}
	
    }

    componentDidMount(){
	var rS = gS.getGrid(this.props.gridID) // restored state

	console.log("grid component did mount")
	console.log(rS)
	
	if (rS) {
	    this.setState({numCols : rS.numCols})
	    this.setState({numRows : rS.numRows})
	    this.setState({gridContent : rS.gridContent})
	}
    }
    
    componentDidUpdate(oldProps){
	return
	// if (oldProps.sessionSeq < this.props.sessionSeq){
	//     var rS = gS.getGrid(this.props.gridID) // restored state
	//     if (rS) {
	// 	this.setState({numCols : rS.numCols})
	// 	this.setState({numRows : rS.numRows})
	// 	this.setState({gridContent : rS.gridContent})
	//     }
	// }
    }
    
    updateGrid(ri, ci, componentName){
	const s = ri + ":" + ci
	var gC = this.state.gridContent
	gC[s] = componentName
	this.setState({ gridContent: gC })
	var grid = {
		"numRows": this.state.numRows,
		"numCols": this.state.numCols,
		"gridContent": gC
	}
	gS.setGrid(this.props.gridID, grid)
    }


    killPane(rE, {name, value}){
	console.log ("kill " + value)
	var gC = this.state.gridContent
	gC[value] = NoComponent
	this.setState({ gridContent: gC })
	var grid = {
		"numRows": this.state.numRows,
		"numCols": this.state.numCols,
		"gridContent": gC
	}
	gS.setGrid(this.props.gridID, grid)
    }

    
    
    getGridItem(ri, ci){
	const s = ri + ":" + ci
	var DynComponent = allComponents[this.state.gridContent[s]]
	if (!DynComponent){
	    DynComponent = NoComponent
	}
	//{DynComponent === NoComponent? '' : this.renderMenu(s)}
	return (
		<Grid.Column>
  		<GridItem position={s} Component = {DynComponent} 
	    rIndex = {ri} cIndex = {ci}
	    kill={this.killPane.bind(this)}
	    curUser = {this.props.curUser}
	    updateFishState = {this.props.updateFishState}
	    appState = {this.props.appState}
	    updateGrid = {this.updateGrid.bind(this)}
	    gridID = {this.props.gridID}
	    containerWidth = {this.props.containerWidth}
		/>
		</Grid.Column>
	)
		    
	
    }

    getGridRow(rindex){
	return(
		<Grid.Row>
		{Array(this.state.numCols).fill().map((_, cindex) => this.getGridItem(rindex, cindex))}
	       </Grid.Row>
	)
    
    }

    modifyGrid(rE, {name, value}){
	var nC = this.state.numCols;
	var nR = this.state.numRows;
	if (value === 'C+'){
		this.setState ({numCols : nC+1})
		nC = nC + 1
	}
	if (value === 'C-'){
		var t = (nC-1 >= 0 ? nC-1 : 0)
		this.setState ({numCols : t })
		nC = t
	}
	if (value === 'R+'){
		this.setState ({numRows : nR+1})
		nR = nR + 1
	}
	if (value === 'R-'){
		var r = (nR-1 >= 0? nR-1 : 0)
		this.setState ({numRows : r})
		nR = r
	}
	var grid = {
		"numRows": nR,
		"numCols": nC,
		"gridContent": this.state.gridContent
	}
	gS.setGrid(this.props.gridID, grid)
	
    }

    gridControl(){
	return (
	    <Container textAlign = 'center' >
		<Icon name='angle double left' color = 'blue' value = 'C-'
	    onClick = {this.modifyGrid.bind(this)}/>
		<Icon name='angle double right'  color = 'blue'  value = 'C+'
	    onClick = {this.modifyGrid.bind(this)}/>
		<Icon name='angle double up' color = 'blue' value = 'R-'
	    onClick = {this.modifyGrid.bind(this)}/>
		<Icon name='angle double down'  color = 'blue' value = 'R+'
	    onClick = {this.modifyGrid.bind(this)}/>
		</Container>
	)
    }
    
    
    render(){
	return(
	
		<div>
		
	    {this.gridControl()}

		<Grid  columns ={this.state.numCols} rows = {this.state.numRows}
	               divided padded relaxed>
		
	    {Array(this.state.numRows).fill().map((_, index) => this.getGridRow(index))}
		
	    </Grid>
		
		</div>
	)	
    }
}

export default FlexGrid;

// these are all our components that can go in a grid cell
const allComponents = { // map from component name to component
	    'EventList' : EventList,
	    'EventInput' : EventInput,
    'Weather' : Weather,
	'WorldClock' : WorldClock,
	'Poetry' : Poetry,
    'NoComponent' : NoComponent

}

// user chooses component
const compsDropdown = [
    {
	
	text : 	    'EventList',
	key : 	    'EventList',
	value: 	    'EventList',
    },
    {
	text : 	    'Weather',
	key : 	    'Weather',
	value :	    'Weather',
    },
    {
	text : 	    'EventInput',
	key : 	    'EventInput',
       value : 	    'EventInput',
    },
    {
	text : 	    'Poetry',
	key : 	    'Poetry',
	value :     'Poetry',
    },
    {
	text : 	    'World Clock',
	key : 	    'WorldClock',
	value :     'WorldClock',
    },
    ]


	    // for (i = 0;  < this.state.numRows){
	    //   this.getGridRow(i)
	    //  }


// 3 rows 2 columns

// <grid  col= ths.state.numCols rows = this.state.numRows   >

// // getGridRow
//     <g.r>
// // getGridItem    
//     <g.c>
//     <dyncomponent>
//     </g.c>

// // getGridItem    
//     <g.c>
//     <dyncomponent>
//     </g.c>
//    </g.r>

// // getGridRow
//    <g.r>
//     <g.c>
//     <dyncomponent>
//     </g.c>
//     <g.c>
//     <dyncomponent>
//     </g.c>
//    </g.r>

// // getGridRow
//     <g.r>
// // getGridItem    
//     <g.c>
//     <dyncomponent>
//     </g.c>

// // getGridItem    
//     <g.c>
//     <dyncomponent>
//     </g.c>
//    </g.r>

// </grid>
