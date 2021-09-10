import React from 'react'
import 'semantic-ui-css/semantic.min.css'
import {Transition, Icon, Container, Radio, Form, Input, Message} from 'semantic-ui-react'
// import moment from 'moment'
import axios from 'axios'
import {bS} from '../BabyTalk'
import {gS} from '../gSession'



class WeatherDisplay extends React.Component{

    state = {
	displayC : false,
    }
	
	switchTemp(e){
	    e.preventDefault()
	    this.setState({displayC : !this.state.displayC})
	}

    render(){
	let W = this.props.w
	let K = 273.15
	let weatherIconId = W.weather[0].icon
	let wIILen =  weatherIconId.length
	let lastChar = W.weather[0].icon.charAt(wIILen - 1);
	let weatherCond = W.weather[0].id
	let dayNight = lastChar == 'n' ? "night-": "day-"

	let dayLight = dayNight == 'day-'
	
	let iconName = "wi wi-owm-"+dayNight+weatherCond
	
	let bgColor = "white"
	let fgColor = 'orange' 
	if (!dayLight){
	    bgColor = 'darkblue'
	    fgColor = 'white'
	}

	function KtoC(t){
	    return (t - K).toFixed(1)
	}

	function KtoF(t){
	    return (((KtoC(t) * 9)/5)+32).toFixed(1)
	}

	

	let iconStyle = {
	    color : fgColor,
	    fontSize: '40px',
	    backgroundColor: bgColor,
	    //width : '30%',
	    height : '100%',

	    textAlign : 'center', 
	    paddingTop: '30px',
	    paddingBottom: '30px',
	    paddingLeft: '5%',
	    paddingRight: '5%', 
	    marginTop: "8px",
	    marginBottom: "5px"
	}

	let windStyle = {
	    color : 'blue',
	}

	
	let curTempStyle ={
	    color: "#FFA233",
	    fontSize: "40px",
	    fontFamily:"sans-serif",
	    fontWeight:"bold",
	    marginTop:"10px",
	    paddingLeft: '5%',
	    paddingRight: '5%',
	}
	let mTempStyle={
		color: "teal", fontSize: "18px"
	}

	let curTemp = this.state.displayC ? KtoC(W.main.temp) : KtoF(W.main.temp)
	let maxTemp = this.state.displayC ? KtoC(W.main.temp_max) : KtoF(W.main.temp_max)
	let minTemp = this.state.displayC ? KtoC(W.main.temp_min) : KtoF(W.main.temp_min)

	let degC = "\u2103"
	let degF = "\u2109"

	let degrees = this.state.displayC ? degC : degF
	let windDeg = W.wind.deg
	let windIconName = `wi wi-wind from-${windDeg}-deg`
	return (
 
		<div>
		<Container textAlign='right'>
		<Radio slider checked={this.state.displayC == false} onClick={this.switchTemp.bind(this)}/>
		</Container>
		{this.props.containerWidth}

		<div style={curTempStyle}>{curTemp}{degrees} <i className={iconName} style={iconStyle}></i>
	    	<i className={windIconName} style={iconStyle, windStyle}/></div>
		max <span style={mTempStyle}>{maxTemp}{degrees}</span>&nbsp;&nbsp;
	    min <span style={mTempStyle}>{minTemp}{degrees}</span>
	    </div>
	)
    }
}


class Weather  extends React.Component{

    state = {
	title : 'Weather',
	titleColor : 'pink',

	owMapKey: 'fe0e998401ffc6a75006eb0735e315d8',
	wData : null,
	loadSearch: false,
	zipcode: "",
	zipCodeError: false,
	messageHidden: true,
	refreshColor : 'grey',
	refreshSeq : 0,
	loading: false,

	
	cityID : null,
	weatherCity : null,
	inputVisible: false,
    }


    async updateWeather(wdata){
	this.setState({wData : wdata})
	// get the lat, long from wdata, and look for the lat/long from mongodb, mongodb send back city, state/county info
	// we send lat, long to babyserver
	//console.log(wdata)
	var cityData = {
		userName: this.props.curUser.name,
		lat: wdata.coord.lat,
		lon: wdata.coord.lon,
	}
	
	var data = await bS.post("/getCityInfo", cityData)

	if (!data){
	    console.log("babyserver laid an egg")
	    this.props.setError(true)
	    return;
	}
	else{
	    this.props.setError(false)
	}



	var foo = `https://api.openweathermap.org/data/2.5/onecall?lat=${wdata.coord.lat}&lon=${wdata.coord.lon}&exclude={current,minutely,hourly,alerts}&appid=${this.state.owMapKey}&units=metric`

    //http://api.openweathermap.org/data/2.5/weather?id=${cityID}&appid=${this.state.owMapKey}`


	axios.get(foo)
	    .then(res => {
		//console.log(res.data)
	    })

	
	var state = data.state ?  data.state : data.country
	
	var city = wdata.name + ", " + state
	this.setState({weatherCity : city})
	this.setState({cityID : data.id})
	var aData = {
		cityID : data.id
	}
	gS.setAppData(this.props.gridID,
		this.props.rIndex,
		this.props.cIndex, 
		aData)

	this.props.setTitle(city, this.state.titleColor)
	this.setState({inputVisible: false})
    }

    inputValid(e){
	if (this.state.zipcode == ""){
	    this.setState({zipCodeError: true})
	}
    }

    inputTimeOut(e){
	this.setState({zipCodeError: false})
    }


    getAPIWeather(cityID){

	var zURL =
	    `http://api.openweathermap.org/data/2.5/weather?zip=${this.state.zipcode}&appid=${this.state.owMapKey}`
	var cURL =
	    `http://api.openweathermap.org/data/2.5/weather?q=${this.state.zipcode}&appid=${this.state.owMapKey}`

	var wURL = parseInt(this.state.zipcode) ? zURL : cURL

	if (parseInt(cityID)){
	    //console.log(this.state.cityID)
	    //console.log(cityID)
	    wURL =
		`http://api.openweathermap.org/data/2.5/weather?id=${cityID}&appid=${this.state.owMapKey}`
	}

	axios.get(wURL)
	    .then(res => {
		this.updateWeather(res.data)
		this.setState({loadSearch: false})
	    })
	    .catch(error => {
		if (error && this.state.zipcode !== ""){
		    this.setState({messageHidden: false})
		}
	    })
    }
    
    
    async getWeather(){
	this.getAPIWeather(true)
    }

    handleChange(e){
	this.setState({messageHidden: true})
	this.setState({zipCodeError: false})
	this.setState({zipcode: e.target.value})
    }

    handleSubmit(e){
	e.preventDefault();
	this.inputValid(e)
	setTimeout(this.inputTimeOut.bind(this), 3000)
	this.setState({loadSearch: true})
	this.getWeather()
    }

    componentDidUpdate(oldProps){
	if (oldProps.triggerRefresh < this.props.triggerRefresh){
	    this.refreshWeather()
	}
    }
	
    componentDidMount(){
	this.props.setTitle(this.state.title, this.state.titleColor)
	this.props.noMenu(false)
	this.props.setError(false)
	this.props.setRefresh("grey", false)

	var appData = gS.getAppData(this.props.gridID,
		      this.props.rIndex,
		      this.props.cIndex)


	var inputCity = false;
	if (appData && appData.cityID) {
	 inputCity = appData.cityID;   
	}

	if (inputCity){
	    this.setState({cityID : inputCity})
	    this.getAPIWeather(inputCity)
	}
	
    }
    
    refreshWeather(){
	this.props.setRefresh("red", true)
	this.updateTitleColor('orange')
	this.getAPIWeather(false)
	this.setState({loading: true})
	setTimeout(this.resetRefreshColor.bind(this), 3000)
    }


    resetRefreshColor(){
	this.updateTitleColor(this.state.titleColor)
	this.props.setRefresh("grey", false)    
    }
    
    updateTitleColor(c){
	this.props.setTitle(this.state.weatherCity, c)
    }
		
    weatherInput(){
	return (
	    	<Form onSubmit={this.handleSubmit.bind(this)}>
		<Input action={{ icon: 'search', loading: false, onClick : this.handleSubmit.bind(this)}} 
	    placeholder='Zip Code or City Name' value={this.state.zipcode} 
	    onChange={this.handleChange.bind(this)}
	    error={this.state.zipCodeError}
		/>
		<Message hidden={this.state.messageHidden} error={true}>
		Location not found.
		</Message> 

	    </Form>

	)
    }

    showInput(){
	this.setState({inputVisible: !this.state.inputVisible})
    }

    showWeather(){
	return (
	    <div>
		<WeatherDisplay w={this.state.wData}
	    
		/>
		<Container textAlign="right">
		<Icon name='cog' onClick={this.showInput.bind(this)} color='grey'/>
		<Transition visible={this.state.inputVisible} animation='scale' duration={500}>
		{this.weatherInput()}
	        </Transition>
		</Container>
		</div>
	)
    }
    
    render(){
	return(
		<div>
		
	    {this.state.wData ?  this.showWeather():
	     this.weatherInput()}
	    

		</div>
	)
    }
}

export default Weather;
