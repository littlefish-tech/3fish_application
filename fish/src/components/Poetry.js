import React from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Container, Header, Loader, List, Divider } from 'semantic-ui-react'
import axios from 'axios'

class Poetry extends React.Component {
    state={
        title: "Poetry",
        titleColor: "red",
        poetryData: null,
        loadPoetry: true, 
        poetryTitle: null,
        refreshSeq : 0,
    }

    componentDidMount(){
        this.props.setTitle(this.state.title, this.state.titleColor)
	    this.props.noMenu(false)
        this.getPoetry()
        this.props.setError(false)
	    this.props.setRefresh("grey", false)
    }

    componentDidUpdate(oldProps){
        if (oldProps.triggerRefresh < this.props.triggerRefresh){
            this.refreshPoetry()
        }
        }

    updatePoetry(data){
        console.log("the poetry data is" + data)
        this.setState({poetryData: data})
        this.setState({loadPoetry: false})
        let pTitle = this.state.poetryData.title
        this.setState({poetryTitle: pTitle})
        this.props.setTitle(pTitle, this.state.titleColor)
    }

    getPoetry(){
    let pURL = "https://poetrydb.org/random,linecount/1;5"
	//https://poetrydb.org/random`
        axios.get(pURL)
            .then(res => {
                this.updatePoetry(res.data[0])
            })
    }

    refreshPoetry(){
        this.props.setRefresh("red", true)
        this.updateTitleColor("orange")
        this.setState({loadPoetry: true})
        this.getPoetry()
        if (this.state.poetryData != null){
            this.setState({loadPoetry: false})
            this.props.setError(false)

        }
        setTimeout(this.resetRefreshColor.bind(this), 3000)
    }

    resetRefreshColor(){
        this.updateTitleColor(this.state.titleColor)
        this.props.setRefresh("grey", false)
    }
    updateTitleColor(c){
        this.props.setTitle(this.state.poetryTitle, c)
    }

    render(){
        let scrollStyle={
            width: "100%",
            height: "300px",
            overflowY: "auto",
            overflowX: "auto",
            // the image is from "pexels.com"
            //backgroundImage:"url('https://images.pexels.com/photos/907485/pexels-photo-907485.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')"
        }
        let poetryInfo = this.state.poetryData
        if (!this.state.loadPoetry){
            return (
                <div>
                    <Container style={scrollStyle} text textAlign='left' fluid >
                        <Divider hidden/>
                        <Header as="h3"> Author: {poetryInfo.author}</Header>
                        <List style={scrollStyle}>{poetryInfo.lines.map((line, index) => <p key={index}>{line}</p>)}</List>
                    </Container>
                </div>
            )
        }
        else {
           return (<Loader active={this.state.loadPoetry} inline="centered" />) 
        }

    } 

}
export default Poetry;
