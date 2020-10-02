import React, {useState} from "react";
import "../App.css"

import HomePage from "../assets/svg/homepage.svg"

import {
    Collapse, DropdownItem, DropdownMenu,
    DropdownToggle,
    Nav, Navbar,
    NavbarBrand, NavbarText,
    NavbarToggler,
    NavItem,
    NavLink,
    UncontrolledDropdown
} from "reactstrap";

import {useHistory} from "react-router-dom";


export const NavbarMenu = () => {
    const [isOpen, setIsOpen] = useState(false)

    let history = useHistory()

    const pathname = history.location.pathname

    const toggle = () => setIsOpen(!isOpen);
    return (
        <Navbar className="bg-info" light expand="md" >
            <NavbarBrand href="/" className={pathname === "/" ? "active" : " "}>
                <img src={HomePage}/>
            </NavbarBrand>
            <NavbarToggler onClick={toggle}/>
            <Collapse isOpen={isOpen} navbar>
                <Nav className="mr-auto" navbar>
                    <NavItem>
                        <NavLink href="/map" style={{"hover": "red"}}>Maps</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            href="/"
                            className={pathname === "/about-authors" ? "active" : " "}
                        >
                            About authors
                        </NavLink>
                    </NavItem>
                    <UncontrolledDropdown nav inNavbar>
                        <DropdownToggle nav caret>
                            Options
                        </DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem>
                                Option 1
                            </DropdownItem>
                            <DropdownItem>
                                Option 2
                            </DropdownItem>
                            <DropdownItem divider/>
                            <DropdownItem>
                                Reset
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </Nav>
                <NavbarText style={{color: "white", paddingLeft: "20px", fontSize: "18px", formStyle: "italic"}}>made Yatsiy V. 💚</NavbarText>
            </Collapse>
        </Navbar>
    )
}
