import * as React from 'react';
import {Container, Nav, Navbar} from 'react-bootstrap';

import './NavBar.scss';

const NavBar = props => (
    <Navbar bg="light" variant="light">
        <Container>
            <Navbar.Brand href="#/user">BetterSound</Navbar.Brand>
            <Nav className="justify-content-end">
                <Nav.Link href="#/user"></Nav.Link>
                <Nav.Link href="#/user/settings">Settings</Nav.Link>
                <Nav.Link href="#logout">Logout</Nav.Link>
            </Nav>
        </Container>
    </Navbar>
);

export default NavBar;
