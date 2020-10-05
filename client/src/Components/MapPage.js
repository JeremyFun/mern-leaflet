import React from 'react';
import '../App.css';

import {Map, GeoJSON, TileLayer, Marker, Popup} from 'react-leaflet'
import L from 'leaflet'
import Joi from 'joi'

import MessageCard from "./MessageCard";

import {getMessages, getLocation, sendMessage} from "../API/API";

import messageIcon from '../assets/svg/message-location.svg'
import myIcon from '../assets/svg/my-location.svg'

import {Button} from 'reactstrap';
import Basemap from "./Basemap";
import mapData from "../data/countries.json"

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
        color: "#ffff00",
        isCountry: false
    }

    colors = ["green", "blue", "yellow", "orange", "grey"];


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
        console.log(mapData);
    }



    countryStyle = {
        fillColor: "red",
        fillOpacity: 1,
        color: "black",
        weight: 2,
    };

    printMesssageToConsole = (event) => {
        console.log("Clicked");
    };

    changeCountryColor = (event) => {
        event.target.setStyle({
            color: "green",
            fillColor: this.state.color,
            fillOpacity: 1,
        });
    };

    onEachCountry = (country, layer) => {
        const countryName = country.properties.ADMIN;
        console.log(countryName);
        layer.bindPopup(countryName);

        layer.options.fillOpacity = Math.random(); //0-1 (0.1, 0.2, 0.3)
        // const colorIndex = Math.floor(Math.random() * this.colors.length);
        // layer.options.fillColor = this.colors[colorIndex]; //0

        layer.on({
            click: this.changeCountryColor,
        });
    };

    colorChange = (event) => {
        this.setState({ color: event.target.value });
    };


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
        this.setState({
            basemap: bm
        });
    }

    showCountry = () => {
        this.setState({
            isCountry: true,
            zoom: 5
        })
    }

    unCounty = () => {
        this.setState({
            isCountry: false,
            zoom: 13
        })
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
                                    <p><em className="message-name">{message.name}</em>   :   {message.message}</p>
                                    {message.otherMessages ? message.otherMessages.map(message => <p key={message._id}>
                                        <em className="message-name">{message.name}</em>  :  {message.message}</p>) : ""}
                                </Popup>
                            </Marker>)
                        })
                    }
                    {this.state.isCountry ? <GeoJSON
                        style={this.countryStyle}
                        data={mapData.features}
                        onEachFeature={this.onEachCountry}
                    /> : ""}

                </Map>

                <Basemap basemap={this.state.basemap} onChange={this.onBMChange}/>

                {this.state.isCountry ? <input
                    type="color"
                    value={this.state.color}
                    onChange={this.colorChange}
                /> : ""}
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
                {this.state.isCountry ?
                    !this.state.showMessage ? <Button outline
                            color="primary"
                            onClick={this.unCounty}
                            className="message-form-two"
                    >Exit with mode</Button> : ""
                    : !this.state.showMessage ? <Button outline
                         color="primary"
                         onClick={this.showCountry}
                         className="message-form-two"
                >Highlight countries</Button> : ""}
            </div>
        )
    }
}