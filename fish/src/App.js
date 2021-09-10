import React from 'react';
import ls from 'local-storage'

import LoginForm from "./components/Login";
import Fish from "./components/Fish";



import { gS } from "./gSession.js"

class App extends React.Component {
    state = {
	curUser  : null,
	appState : {},
    }

   async componentDidMount(){
       var curUser = ls.get('curUser')
       var appState = ls.get('appState')

       if (curUser){
	   var u = {
	       id: curUser.id,
	       name : curUser.name
	   }
	   gS.setCreds(u)
	   await gS.restore() // wait until we get the data back from the server
	   this.setState({curUser : curUser})
	}
	if (appState){
	    this.setState({appState : appState})
	}
    }

    updateState(key, data){
	this.setState({[key] :  data})
	ls.set(key, data) 
    }
    // remoteUpdateState = this.updateState.bind(this)

    updateFishState(key, data){
	let aS = this.state.appState;
	aS[key] = data;
	this.setState({appState : aS})
	ls.set('appState', aS)
    }
    
    

    renderLogin(){
	return (
   		<div>
		<LoginForm updateAppState = {this.updateState.bind(this)} appKey = {"curUser"} />
		</div>
	)
    }

    renderFish(){
	return(
	    	<div>
		
		<Fish updateAppState = {this.updateState.bind(this)}
            appKey = {"curUser"}
            curUser = {this.state.curUser}
            updateFishState = {this.updateFishState.bind(this)}
	    appState = {this.state.appState}
		/>
		</div>
	)
    }
    
   
    render(){
	if (!this.state.curUser || this.state.curUser.id < 0  ){
	    return ( this.renderLogin() )
        }
	else{
	    return( this.renderFish())
	}	
    }
}

export default App;
// 		<LoginForm updateAppState=this.updateState.bind(this)/>

  //   verifyLogin(){
	// // Axios call to the database
	// uname="fish1"
  //   }


// <LoginForm updateAppState=this.updateState.bind(this) />
// <LoginForm updateAppState=App.updateState.bind(App) /> we're in App component right now

// We are invoking the component LoginForm
//   updateAppState is a prop(erty) of LoginForm

//  value of updateAppState is a function
//     that function is this.updateState where this is App

//  but we .bind(this) to that function
//    this is equivalent to saying .bind(App)

//  means that when updateAppState runs inside LoginForm
//    then this.* inside updateAppState will be App (because
//     this passed to bind is in the App component)
