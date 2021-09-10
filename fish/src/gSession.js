import {bS} from './BabyTalk'
import ls from 'local-storage'

class GlobalSession {

    constructor(){
	this.Layout = {};
	this.Creds = {};
	this.Grids = [];
	this.AppData = {};

	this.setDefault()
	this.lsKey = 'gSession'
	
    }

	getCreds(){
		return this.Creds
	}
    setCreds(u){
	console.log("setting creds to ")
	console.log(u)
	var c = {
	    id : u.id,
	    name : u.name
	}
	this.Creds = c
    }
    
    getLayout(){
	// we should call getLayout at Fish.js, user gets the layout
	// when login, first call the babyserver to look for the
	// layout detail at mongodb about that user
	// to get the fatsize and thin size, and 

	return this.Layout
	// then render the layout to the dashboord => how many grid
	// and also the layout name(but not rendering name)
    }

    setLayout(l){
	// call at Fish.js, user may want to update fat/thin size
	this.Layout = l

	// when setLayout, we reSet the layout grid, or update size of
	// each grid

	// then call babyServer to save to mongodb
	this.save()
    }

    getGrid(gridID){
	// call at FlexGrid, we first call babyserver to get the saved
	// object from mongodb about that grid, will pass the
	// numCol/numRols, gridcontent detail(what component rendering
	// at which place) saved at db to the state

	return this.Grids[gridID]	// rendering at the dashboard
    }

    setGrid(gridID, gridObject){
		console.log(gridObject)

	// call at FlexGrid, when update the numsColmn/numsRows or the
	// user update the the gridCotnent Detail(changed any
	// component name at which key)

	// set S.Layout.Grids[gridId] = gridObject		// then call babyServer save to mongoDB
	this.Grids[gridID] = gridObject;
	this.save()
    }

   // component
    getAppData(gridId, row, col){
	// call at GridItem, we call the baby server to find the
	//information saved at the gridID, row and col ->
	//S.AppData[gridId:row:col] (of type appHash) // set the state
	//of that component to what we get from db

	var key = gridId + ":" + row + ":" + col
	// render the setted component
	return this.AppData[key]
    }
	
	destroy(){
	    this.Creds = {}
	    this.Layout = {}
	    this.Grids = []
	    this.AppData = {}
	    this.setDefault()

	    var s = this.populate()
	    ls.set( this.lsKey, s) // save a default session
	}

    setAppData(gridId, row, col, aData){

	// call at GridItem, when update any information about that
	// component, we will call the babyserver talk to mongodb to

	// update S.AppData[gridId:row:col] = aData

	var key = gridId + ":" + row + ":" + col
	this.AppData[key] = aData
	
	this.save()
    }
	
    async save(){
	// write to database
	var uData = this.populate()
	uData.userName = this.Creds.name

	// make a bS post call
	var data = await bS.post("/saveSessionInfo", uData)

	// save local as well
	ls.set(this.lsKey,  uData)
    }


    setDefault(){
	
	this.Layout.name = "ThinRightGrid"
	this.Layout.conf = {
	     fatSize: 8,
	     thinSize: 8 
	};
	
	 this.Grids[0] = {
	     "numRows" : 2,
	     "numCols" : 2,
	     "gridContent" : {}
	 }

	 this.Grids[1] = {
	     "numRows" : 3,
	     "numCols" : 1,
	     "gridContent" : {}
	 }
    }

    setSession(session){
	this.Layout = session.Layout
	this.Grids = session.Grids
	this.AppData = session.AppData
    }

    populate(){
	var uData = {
	    Creds : this.Creds,
	    Layout : this.Layout,
	    Grids  : this.Grids,
	    AppData : this.AppData
	}
	return uData
    }
    

    async restore(){
	// get from database
	var uData = {
	    userName : this.Creds.name
	}

	if (!uData.userName){
	    return;
	}

	var lS  = ls.get(this.lsKey)

	console.log(lS)

	if ((lS) && (lS.Creds) && (lS.Creds.name == this.Creds.name)){
	    console.log("got local session back")
	    this.Creds = lS.Creds
	    this.setSession(lS)
	    return
	}

	console.log("Restoring from server for " + this.Creds.name)
	var session = await bS.post("/restoreSessionInfo", uData)
	if (session === null || session.Creds == null || !session.Creds.name == this.Creds.name){
	    console.log("set default called")
	    this.setDefault()
	    return
	}
	this.setSession(session)

	console.log("Received new session  for " + this.Creds.name)
	console.log(session)

	// save it locally
	var uData = this.populate()
	uData.userName = this.Creds.name

	console.log("saving session locally")
	ls.set(this.lsKey,  uData)

    }
    
}

export const gS = new GlobalSession()







