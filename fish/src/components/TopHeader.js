import React, { Component } from 'react'
import { Icon, Input, Menu } from 'semantic-ui-react'
import Profile from './Profile';
import {bS} from '../BabyTalk'	
import {gS} from '../gSession'


export default class TopHeader extends Component {
    state = { 
        activeItem: "",
        showUpdate: false
    }
  
    handleItemClick (rE, data) {
	//console.log(rE);
	//console.log(data);
        this.setState({ activeItem: data.name })

	if (data.name === 'logout' || data.name === 'sign out'){
	    this.handleLogout(rE)
	}
	
    }
    handleUpdate(e){
        this.setState({showUpdate: true})
    }

    killUpdate(){
        this.setState({showUpdate:false})
    }
  
   async handleLogout (e){
	e.preventDefault()
	
       var data = await bS.post("/logOut")
       gS.destroy()
       this.props.updateAppState(this.props.appKey, data);
    }

    render() {
	return (
	    <div>
		<Menu inverted size = 'tiny' color="black">
            <Menu.Menu position='right'>
            <Menu.Item>
                <Input icon='search' placeholder='Search...' />
		</Menu.Item>

	        <Menu.Item
	    		icon='edit'
            name={this.props.curUser.name}
                active={this.state.activeItem === 'account'}
                onClick={this.handleUpdate.bind(this)}
            />
            <Profile showUpdate={this.state.showUpdate}
            kill={this.killUpdate.bind(this)}
            curUser = {this.props.curUser}
            updateAppState = {this.props.updateAppState} appKey = {"curUser"}
            />

            <Menu.Item
     	    icon={<Icon name="sign out"  onClick={this.handleItemClick.bind(this)} />}
              active={this.state.activeItem === 'logout'}
                onClick={this.handleItemClick.bind(this)}
            />
            </Menu.Menu>
            </Menu>
	  </div>
      )
    }
  }
