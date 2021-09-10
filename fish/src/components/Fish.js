import React from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Icon, Grid} from 'semantic-ui-react'
import TopHeader from "./TopHeader"
import FlexGrid from "./FlexGrid"
import {gS} from '../gSession'

class ThinRightGridLayout extends React.Component{
    state = {
	name : 'ThinRightGrid',
	conf : {
	    fatSize : 13,
	    thinSize :  3
	},
    }
	
	// call the getLayout function from gSession, to get the fatsize and thinsize, and setstate for fatsize and thinsize.
	// we get rows and cloumn for all the flexGrid, and pass to the 
    // and we pass the the fatsize and thin size to the grid.column..

    componentDidMount(){
	var c = this.props.conf
	if (c){
	    this.setState({conf : c})
	}
    }
    componentDidUpdate(oldProps){
	if (oldProps != this.props){
	    var c = this.props.conf
	    if (c){
		this.setState({conf : c})
	    }
	}
    }

    fatThinner(){
	var c = this.state.conf
	c.fatSize = c.fatSize -1
	c.thinSize = c.thinSize +1
	this.setState({ conf : c})
//	this.setState({ fatSize : this.state.fatSize-1})
//	this.setState({thinSize : this.state.thinSize+1})
	//call setlayout to update the fatsize/thinsize

	var l = {
	    name : this.state.name,
	    conf : c
	}
	gS.setLayout(l)
    }

    fatFatter(){
	var c = this.state.conf
	c.fatSize = c.fatSize+1
	c.thinSize = c.thinSize -1
	this.setState({ conf : c})
	var l = {
	    name : this.state.name,
	    conf : c
	}
	gS.setLayout(l)
	
//	this.setState({fatSize : this.state.fatSize+1})
//	this.setState({thinSize : this.state.thinSize-1})
	// call setLayout to update the fat/thinsize
    }
       render() {
	return (
		<div>
		<Icon name = 'arrow alternate circle left' onClick={this.fatThinner.bind(this)}
		size = 'large'/>
		<Icon name = 'arrow alternate circle right' onClick={this.fatFatter.bind(this)}
		size = 'large'/>
		
		<Grid columns={2} fluid = "true" >
		<Grid.Column width={this.state.conf.fatSize}>
		<FlexGrid curUser = {this.props.curUser}
	    appState = {this.props.appState}
	    updateFishState = {this.props.updateFishState}
	    rows={2} cols = {2}
	    gridID = {0}
	    sessionSeq = {this.props.sessionSeq}
	    containerWidth={this.state.conf.fatSize}
		/>

	    
		</Grid.Column>
		<Grid.Column width={this.state.conf.thinSize}>
		<FlexGrid curUser = {this.props.curUser}
	    appState = {this.props.appState}
            updateFishState = {this.props.updateFishState}
	    rows={3} cols = {1}
	    gridID = {1}
	    sessionSeq = {this.props.sessionSeq}
	    containerWidth={this.state.conf.thinSize}
		/>
		</Grid.Column>

	    </Grid>
		</div>
	)
    }
}


class Fish extends React.Component{
    // we receive curUser as a prop
    // compententdidmount()

    state  = {
	layoutName : 'ThinRightGrid',
	layoutConf : {
	    fatSize : 9,
	    thinSize: 7
	}
    }

    restoreLayout(){
	var layout = gS.getLayout()
	this.setState({layoutName : layout.name })
	this.setState({layoutConf : layout.conf })

    }
    
     componentDidMount(){
	this.restoreLayout()
    }

    componentDidUpdate(oldProps){
	return;
	// if (oldProps.sessionSeq < this.props.sessionSeq){
	//     this.restoreLayout()
	// }
    }


    
     render(){

	return(
		<div>
		<TopHeader curUser={this.props.curUser} uName = {this.props.curUser.name} 
	    updateAppState = {this.props.updateAppState} appKey = {"curUser"} />
		
	    {this.state.layoutName == 'ThinRightGrid' &&
	     <ThinRightGridLayout curUser = {this.props.curUser}
             updateFishState = {this.props.updateFishState}
             appState = {this.props.appState}
	     conf = {this.state.layoutConf}
	     />
	    }
		</div>
	)	
    }
}

export default Fish;

