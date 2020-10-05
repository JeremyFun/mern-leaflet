import React from 'react';

import {BrowserRouter as Router, Route} from "react-router-dom";

import {MapPage} from "./Components/MapPage";
import {NavbarMenu} from "./Components/Navbar";
import Jumbotron from './Components/Jumbotron'



const App = () => {
    return (
            <Router>
                <NavbarMenu />
                <Route path="/" exact component={() => <Jumbotron />
                } />
                <Route path="/map" exact component={() => <MapPage />} />
            </Router>
    );
}

export default App;