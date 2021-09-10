import React from 'react'
import 'semantic-ui-css/semantic.min.css'
import {Icon} from 'semantic-ui-react'


class WorldClock  extends React.Component{

    componentDidMount(){
	this.props.setTitle('World Clock', 'pink')
	this.props.noMenu(false)
    }
    
    render(){
	return(
		<div>
		<Icon name = 'clock' size = 'huge'/>
		</div>
	)
    }
}

export default WorldClock;
