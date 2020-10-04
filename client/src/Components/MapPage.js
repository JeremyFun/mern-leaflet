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
import Basemap from "./Basemap";
import GeojsonLayer from "./GeojsonLayer";
import CoordInsert from "./CoordInsert";

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
        messages: [],

        basemap: 'osm',

        geojsonvisible: false,
        // visibleModal: false,
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

    quitWithMessage = () => {
        this.setState({
            showMessage: false
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

    onBMChange = (bm) => {
        // console.log(this);
        this.setState({
            basemap: bm
        });
    }

    // onCoordInsertChange = (lat, lng, z) => {
    //     this.setState({
    //         location: {
    //             lat: lat,
    //             lng: lng,
    //             zoom: z,
    //         }
    //     });
    // }
    //
    onGeojsonToggle = (e) => {
        this.setState({
            geojsonvisible: e.currentTarget.checked
        });
    }

    render() {
        const position = [this.state.location.lat, this.state.location.lng]

        const basemapsDict = {
            osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            hot: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
            dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
            cycle: "https://dev.{s}.tile.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png"
        }
        return (
            <div className="map">
                <Map className="map" center={position} zoom={this.state.zoom}>
                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url={basemapsDict[this.state.basemap]}
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
                                        <em>{message.name}</em>  :  {message.message}</p>) : ""}
                                </Popup>
                            </Marker>)
                        })
                    }
                </Map>
                <Basemap basemap={this.state.basemap} onChange={this.onBMChange}/>

                <div className="geojson-toggle">
                    <label htmlFor="layertoggle">Toggle Geojson </label>
                    <input type="checkbox"
                           name="layertoggle" id="layertoggle"
                           value={this.state.geojsonvisible} onChange={this.onGeojsonToggle}/>
                </div>

                {this.state.geojsonvisible &&
                <GeojsonLayer url="geojson.json" />
                }

                {/*<CoordInsert onllzChange={this.onCoordInsertChange}/>*/}
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
                            quitWithMessage={this.quitWithMessage}
                        />
                }

            </div>

        )
    }
}