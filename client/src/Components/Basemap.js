import React from 'react';
import { Input, Form, Label } from "reactstrap";

class Basemap extends React.Component {
    onChange = (e) => {
        const bm = e.currentTarget.value;

        if (this.props.onChange) {
            this.props.onChange(bm);
        }
    }

    render() {
        return (
            <div className="basemaps-container">
                <Form style={{display: "flex"}}>
                    <Label for="select" style={{marginTop: "2.5%", color: "#fff", fontSize: "18px", fontStyle: "italic"}}>Theme:&nbsp;&nbsp;&nbsp;&nbsp;</Label>
                    <Input type="select" bsSize="md" value={this.props.basemap} onChange={this.onChange} >
                        <option value="osm">OSM</option>
                        <option value="hot">OSM HOT</option>
                        <option value="dark">DARK</option>
                        <option value="cycle">CYCLE MAP</option>
                    </Input>
                </Form>
            </div>
        );
    }
};

export default Basemap;
