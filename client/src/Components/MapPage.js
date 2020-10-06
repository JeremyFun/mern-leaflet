import React from 'react';
import '../App.css';

import {Map, GeoJSON, TileLayer, Marker, Popup} from 'react-leaflet'
import L from 'leaflet'
import Joi from 'joi'

import MessageCard from "./MessageCard";

import {getMessages, getLocation, sendMessage} from "../API/API";

import messageIcon from '../assets/svg/message-location.svg';
import myIcon from '../assets/svg/my-location.svg';

import {Button, FormGroup, Label, Input} from 'reactstrap';

import Basemap from "./Basemap";
import mapData from "../data/countries.json";
import GeojsonLayer from "./GeojsonLayerFunc";

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

L.Icon.Default.imagePath = "https://unpkg.com/leaflet@1.5.0/dist/images/";

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
        isCountry: false,

        geojsonvisible: false,
    }
    colors = ["green", "blue", "yellow", "orange", "grey"];


    componentDidMount() {
        getMessages()
            .then(messages => {
                this.setState({
                    messages,
                    zoom: 3.5
                })
                if (this.state.messages.length === 0) {
                    this.setState({
                        messages: [
                            {_id: "5f7a5a6545d74c7b01d32559", name: "Yatsiy Vladislav", message: "This place is cool!", latitude: 50.4501, longitude: 30.5234, date: "2020-10-04T23:29:55.002Z"},
                            {_id: "5f7a5af345d74c7b01d3255a", name: "Ivan", message: "THis is is is!", latitude: 52.520007, longitude: 13.404954, date: "2020-10-04T23:29:55.002Z"},
                            {_id: "5f7a5b2c45d74c7b01d3255b", name: "Hex", message: "This isisi silsd;fjlkdsj fksjd klfjsl!", latitude: 51.507351, longitude: -0.127758, date: "2020-10-04T23:29:55.002Z"},
                            {_id: "5f7a5b4845d74c7b01d3255c", name: "Jack", message: "sjdhfklsdjklfjskdlfjkls j flskdjfkl ", latitude: 55.755826, longitude: 37.6173, date: "2020-10-04T23:29:55.002Z"},
                            {_id: "5f7a5b6545d74c7b01d3255d", name: "Hejj", message: "sdjfksljdkf sdklfjk sldjfkl s!", latitude: 37.386052, longitude: -122.083851, date: "2020-10-04T23:29:55.002Z"},
                            {_id: "5f7a5b9245d74c7b01d3255e", name: "Berx", message: "TH lksldfkfl;sdk fsdl;kf l;dsk;f ", latitude: 19.075984, longitude: 72.877656, date: "2020-10-04T23:29:55.002Z"},
                            {_id: "5f7a5bcf45d74c7b01d3255f", name: "Yura", message: "The complete sentenses!", latitude: 37.774929, longitude: -122.419416, date: "2020-10-04T23:29:55.002Z"},
                            {_id: "5f7a5c0145d74c7b01d32560", name: "Uri", message: "Hello ", latitude: 31.230416, longitude: 121.473701, date: "2020-10-04T23:29:55.002Z"},
                            {_id: "5f7a5c2245d74c7b01d32561", name: "Pail", message: "Helll oodaspfkl;j dsfjkljfsd!", latitude: -23.55052, longitude: -46.633309, date: "2020-10-04T23:29:55.002Z"},
                            {_id: "5f7a5c3e45d74c7b01d32562", name: "HEkc", message: "JJLF;SDKL; FKSDL;K FL;SD", latitude: 35.689487, longitude: 139.691706, date: "2020-10-04T23:29:55.002Z"},
                            {_id: "5f7b3aa9f3c915122e75cf12", name: "dsfsd", message: "fsdfsd", latitude: 50.4365056, longitude: 30.503731199999994, date: "2020-10-04T23:29:55.002Z"}
                        ]
                    })
                }
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
        fillColor: "orange",
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
        this.setState({color: event.target.value});
    };


    showMessage = () => {
        this.setState({
            showMessage: true,
            zoom: 14
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


    onGeojsonToggle = (e) => {

        this.setState({
            geojsonvisible: e.currentTarget.checked,
            zoom: 4
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
                                    <p><em className="message-name">{message.name}</em> : {message.message}</p>
                                    {message.otherMessages ? message.otherMessages.map(message => <p key={message._id}>
                                        <em className="message-name">{message.name}</em> : {message.message}</p>) : ""}
                                </Popup>
                            </Marker>)
                        })
                    }
                    {this.state.isCountry ? <GeoJSON
                        style={this.countryStyle}
                        data={mapData.features}
                        onEachFeature={this.onEachCountry}
                    /> : ""}
                    <FormGroup check className="message-form-three">
                        <Label check>{/*<div className="geojson-toggle">*/}
                    {/*    <label htmlFor="layertoggle">Toggle Geojson </label>*/}
                    {/*    <input type="checkbox"*/}
                    {/*           name="layertoggle" id="layertoggle"*/}
                    {/*           value={this.state.geojsonvisible} onChange={this.onGeojsonToggle}/>*/}
                    {/*</div>*/}
                            <Input type="checkbox"
                                   name="layertoggle"
                                   id="layertoggle"
                                   size="sm"
                                   style={{width: "20px"}}
                                   value={this.state.geojsonvisible}
                                   onChange={this.onGeojsonToggle}
                            />
                            Check me
                        </Label>
                    </FormGroup>

                    {this.state.geojsonvisible && <GeojsonLayer url="places.json" cluster={true}/>}
                </Map>

                <Basemap basemap={this.state.basemap} onChange={this.onBMChange}/>

                {
                    this.state.isCountry ? <input
                        type="color"
                        value={this.state.color}
                        onChange={this.colorChange}
                    /> : ""
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
                            quitWithMessage={this.quitWithMessage}
                        />
                }
                {
                    this.state.isCountry ?
                        !this.state.showMessage ? <Button outline
                                                          color="primary"
                                                          onClick={this.unCounty}
                                                          className="message-form-two"
                        >Exit with mode</Button> : ""
                        : !this.state.showMessage ? <Button outline
                                                            color="primary"
                                                            onClick={this.showCountry}
                                                            className="message-form-two"
                        >Highlight countries</Button> : ""
                }
            </div>
        )
    }
}