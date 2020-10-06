import React from "react";
import {Button, CardBody, CardText, CardTitle, Form, FormGroup, Input, Label} from "reactstrap";
import {Preloader} from "./Preloader";

export default (props) => {
    return (
        <CardBody className="message-form text-primary font-italic font-weight-bold">
            <CardTitle className={props.sendingMessage ? "class" : ""}>Welcome to GuestM.app</CardTitle>
            <CardText className={props.sendingMessage ? "class" : ""}>Leave a message with your location!</CardText>
            <CardText className={props.sendingMessage ? "class" : ""}>Thanks for stopping by!</CardText>
            {!props.sendingMessage && !props.sentMessage && props.haveUserLocation ?
                <Form onSubmit={props.formSubmitted}>
                    <FormGroup>
                        <Label for="name" className="text-primary font-weight-light">Name</Label>
                        <Input
                            onChange={props.valueChanged}
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Enter your name"/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="message" className="text-primary font-weight-light">Message</Label>
                        <Input
                            onChange={props.valueChanged}
                            type="textarea"
                            name="message"
                            id="message"
                            placeholder="Enter a message"/>
                    </FormGroup>
                    <Button type="submit" color="info" disabled={!props.formIsValid()}>Send</Button>
                    <Button color="info" style={{marginLeft: "10%"}} onClick={props.quitWithMessage}>Quit</Button>
                </Form>
                : props.sendingMessage || !props.haveUserLocation ?
                    <Preloader/>
                    :
                    <>
                        <CardText>Thanks for submitting a message!</CardText>
                        <Button color="info" style={{marginLeft: "10%"}} onClick={props.quitWithMessage}>Quit</Button>
                    </>
            }
        </CardBody>
    )
}