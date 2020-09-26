import React from 'react';
import './App.css';

import {Map, TileLayer, Marker, Popup} from 'react-leaflet'
import L from 'leaflet'
import Joi from 'joi'

import {
    CardText, CardBody,
    CardTitle, Button,
    Form, FormGroup,
    Label, Input
} from 'reactstrap';

import messageIcon from './message-location.svg'
import myIcon from './my-location.svg'

export const messagesIcon = new L.Icon({
    iconUrl: messageIcon,
    iconSize: [35, 38],
    iconAnchor: [13.5, 41],
    popupAnchor: [0, -41],
})

export const myIcons = new L.Icon({
    iconUrl: myIcon,
    iconSize: [35, 38],
    iconAnchor: [13.5, 41],
    popupAnchor: [0, -41],
})

const schema = Joi.object().keys({
    name: Joi.string().min(1).max(500).required(),
    message: Joi.string().min(1).max(500).required(),
})

const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000/api/v1/messages' : 'production_url_here'

class App extends React.Component {
    state = {
        location: {
            lat: 50.433300,
            lng: 30.416700,
        },
        haveUserLocation: false,
        zoom: 2,
        userMessage: {
            name: '',
            message: ''
        },
        sendingMessage: false,
        sentMessage: false,
        messages: []
    }

    componentDidMount() {
        fetch(API_URL)
            .then(res => res.json())
            .then(messages => {
                this.setState({
                    messages
                })
            })

        navigator.geolocation.getCurrentPosition((position) => {
            this.setState({
                location: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                },
                haveUserLocation: true,
                zoom: 13,
            })
        }, () => {
            console.log('uh, oh... they didnt give us their location...')
            fetch('http://ip-api.com/json/')
                .then(res => res.json())
                .then(location => {
                    this.setState({
                        location: {
                            lat: location.lat,
                            lng: location.lon
                        },
                        haveUserLocation: true,
                        zoom: 13
                    })
                })
        });
    }

    formIsValid = () => {
        const userMessage = {
            name: this.state.userMessage.name,
            message: this.state.userMessage.message
        }
        const result = schema.validate(userMessage)

        if (this.state.haveUserLocation) {
            if (!result.error) {
                return true
            }
            return false
        }
    }

    formSubmitted = (event) => {
        event.preventDefault()
        this.setState({
            sendingMessage: true
        })
        if (this.formIsValid()) {
            debugger;
            fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: this.state.userMessage.name,
                    message: this.state.userMessage.message,
                    latitude: this.state.location.lat,
                    longitude: this.state.location.lng
                })
            })
                .then(res => res.json())
                .then(message => {
                    console.log(message)
                    setTimeout(() => {
                        this.setState({
                            sendingMessage: false,
                            sentMessage: true
                        })
                    }, 4000)
                })
        }
    }

    valueChanged = (event) => {
        const {name, value} = event.target
        this.setState((prevState) => ({
            userMessage: {
                ...prevState.userMessage,
                [name]: value
            }
        }))
    }

    render() {
        const position = [this.state.location.lat, this.state.location.lng]
        return (
            <div className="map">
                <Map className="map" center={position} zoom={this.state.zoom}>
                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {
                        this.state.haveUserLocation
                            ? <Marker position={position} icon={myIcons}>
                                <Popup>
                                    A pretty CSS3 popup. <br/> Easily customizable.
                                </Popup>
                            </Marker>
                            : ""
                    }
                    {
                        this.state.messages.map(message => {
                            return (<Marker position={[message.latitude, message.longitude]} icon={messagesIcon}>
                                <Popup>
                                    <em>{message.name}</em>: {message.message}
                                </Popup>
                            </Marker>)
                        })
                    }
                </Map>
                <CardBody className="message-form">
                    <CardTitle>Welcome to GuestM.app</CardTitle>
                    <CardText>Leave a message with your location!</CardText>
                    <CardText>Thanks for stopping by!</CardText>
                    {!this.state.sendingMessage && !this.state.sentMessage && this.state.haveUserLocation ?
                        <Form onSubmit={this.formSubmitted}>
                            <FormGroup>
                                <Label for="name">Name</Label>
                                <Input
                                    onChange={this.valueChanged}
                                    type="text"
                                    name="name"
                                    id="name"
                                    placeholder="Enter your name"/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="message">Message</Label>
                                <Input
                                    onChange={this.valueChanged}
                                    type="textarea"
                                    name="message"
                                    id="message"
                                    placeholder="Enter a message"/>
                            </FormGroup>
                            <Button type="submit" color="info" disabled={!this.formIsValid()}>Send</Button>
                        </Form>
                        : this.state.sendingMessage || !this.state.haveUserLocation ?
                            <video className="video" autoPlay loop
                                   src="https://media.giphy.com/media/xkC0zz2GObJfy/giphy.mp4"/>
                            : <CardText>Thanks for submitting a message!</CardText>
                    }
                </CardBody>
            </div>
        )
    }
}

export default App