import React from "react";
import {Spinner} from "reactstrap";

export const Preloader = () => {
    return (
        // <video className="video" autoPlay loop
        //        src="https://media.giphy.com/media/XfIc8q8bPfU08fxcjR/giphy.mp4"/>
        <Spinner color="info" style={{
            width: "5rem",
            height: "5rem",
            margin: "auto",
            display: "flex"
        }}/>

    )
}