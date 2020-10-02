import React from "react";
import {Button, CardBody, CardText, CardTitle, Form, FormGroup, Input, Label} from "reactstrap";
import {Preloader} from "./Preloader";

export default (props) => {
return (
    <CardBody className="message-form text-primary font-italic font-weight-bold">
        <CardTitle>Welcome to GuestM.app</CardTitle>
        <CardText>Leave a message with your location!</CardText>
        <CardText>Thanks for stopping by!</CardText>
        {!props.sendingMessage && !props.sentMessage && props.haveUserLocation ?
            <Form onSubmit={props.formSubmitted}>
                <FormGroup>
                    <Label for="name">Name</Label>
                    <Input
                        onChange={props.valueChanged}
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Enter your name"/>
                </FormGroup>
                <FormGroup>
                    <Label for="message">Message</Label>
                    <Input
                        onChange={props.valueChanged}
                        type="textarea"
                        name="message"
                        id="message"
                        placeholder="Enter a message" />
                </FormGroup>
                <Button type="submit" color="info" disabled={!props.formIsValid()}>Send</Button>
            </Form>
            : props.sendingMessage || !props.haveUserLocation ?
                <Preloader />
                : <CardText>Thanks for submitting a message!</CardText>
        }
    </CardBody>
)
}