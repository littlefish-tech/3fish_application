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
        poetryTitle: null
    }

    componentDidMount(){
        this.props.setTitle(this.state.title, this.state.titleColor)
	    this.props.noMenu(false)
        this.getPoetry()
    }

    updatePoetry(data){
        this.setState({poetryData: data})
        this.setState({loadPoetry: false})
        let pTitle = this.state.poetryData.title
        this.setState({poetryTitle: pTitle})
        this.props.setTitle(pTitle, this.state.poetryTitle)
    }

    getPoetry(){
        let pURL = `https://poetrydb.org/random/1`
        axios.get(pURL)
            .then(res => {
                console.log(res.data[0])
                this.updatePoetry(res.data[0])
            })
    }

    render(){
        let scrollStyle={
            paddingLeft: "5px",
            borderRadius: "5px",
            width: "100%",
            height: "300px",
            overflowY: "auto",
            overflowX: "auto",
            // the image is from "pexels.com"
            backgroundImage:"url('https://images.pexels.com/photos/907485/pexels-photo-907485.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')"
        }
        let poetryInfo = this.state.poetryData
        if (!this.state.loadPoetry){
            return (
                <div>
                    <Container style={scrollStyle} text textAlign='left' fluid >
                        <Divider hidden/>
                        <Header as="h3"> Author: {poetryInfo.author}</Header>
                        <List >{poetryInfo.lines.map((line, index) => <p key={index}>{line}</p>)}</List>
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