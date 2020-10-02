import React from 'react';
import '../App.css';

import {Map, TileLayer, Marker, Popup} from 'react-leaflet'
import L from 'leaflet'
import Joi from 'joi'

import MessageCard from "./MessageCard";

import {getMessages, getLocation, sendMessage} from "../API/API";

import messageIcon from '../assets/svg/message-location.svg'
import myIcon from '../assets/svg/my-location.svg'


import {Button} from 'reactstrap';

export const messagesIcon = new L.Icon({
    iconUrl: messageIcon,
    iconSize: [50, 82],
})

export const myIcons = new L.Icon({
    iconUrl: myIcon,
    iconSize: [50, 82]
})

const schema = Joi.object().keys({
    name: Joi.string().min(1).max(500).required(),
    message: Joi.string().min(1).max(500).required(),
})

export class MapPage extends React.Component {
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
        showMessage: false,
        sentMessage: false,
        messages: []
    }

    componentDidMount() {
        getMessages()
            .then(messages => {
                this.setState({
                    messages,
                    zoom: 3.5
                })
            })
        getLocation()
            .then(location => {
                this.setState({
                    location,
                    haveUserLocation: true,
                    zoom: 13,
                })
            })
    }

    showMessage = () => {
        this.setState({
            showMessage: true
        })
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
            const message = {
                name: this.state.userMessage.name,
                message: this.state.userMessage.message,
                latitude: this.state.location.lat,
                longitude: this.state.location.lng
            }
            sendMessage(message)
                .then((result) => {
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
                                    Here will be <br/> your comment.
                                </Popup>
                            </Marker>
                            : ""
                    }
                    {
                        this.state.messages.map(message => {
                            return (<Marker key={message._id} position={[message.latitude, message.longitude]}
                                            icon={messagesIcon}>
                                <Popup>
                                    <p><em>{message.name}</em>{message.message}</p>
                                    {message.otherMessages ? message.otherMessages.map(message => <p key={message._id}>
                                        <em>{message.name}</em> : {message.message}</p>) : ""}
                                </Popup>
                            </Marker>)
                        })
                    }
                </Map>
                {

                }
                {
                    !this.state.showMessage
                        ?
                        <>
                            <Button outline
                                    color="primary"
                                    onClick={this.showMessage}
                                    className="message-form"
                            >Add message</Button>
                        </>
                        :
                        <MessageCard
                            sendingMessage={this.state.sendingMessage}
                            sentMessage={this.state.sentMessage}
                            haveUserLocation={this.state.haveUserLocation}
                            formSubmitted={this.formSubmitted}
                            valueChanged={this.valueChanged}
                            formIsValid={this.formIsValid}
                        />
                }

            </div>

        )
    }
}