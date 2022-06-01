import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import { isAuth, signout } from "../action/authAcation";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import { withRouter } from "react-router-dom";

const Header = ({ history }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar color="dark" dark expand="md">
        <Link to="/auth/signin">
          <NavbarBrand
            style={{ cursor: "pointer" }}
            className="font-weight-bold"
          >
            ALGO LIVE
          </NavbarBrand>
        </Link>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto " navbar>
            {!isAuth() && (
              <React.Fragment>
                <NavItem>
                  <Link to="/auth/signup">
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={({ isActive }) =>
                        isActive ? "active" : "inactive"
                      }
                    >
                      Signup
                    </NavLink>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link to="/auth/signin">
                    <NavLink style={{ cursor: "pointer" }}>Signin</NavLink>
                  </Link>
                </NavItem>
              </React.Fragment>
            )}

            {isAuth() && isAuth().role === 0 && (
              <NavItem>
                <Link to="/admin/accounts">
                  <NavLink
                    className="my-navbar"
                    style={{ cursor: "pointer" }}
                  >{`${isAuth().name}'s Dashboard`}</NavLink>
                </Link>
              </NavItem>
            )}
            {isAuth() && isAuth().role === 0 && (
              <NavItem>
                <Link to="/admin/accounts" className="links">
                  <NavLink
                    className="my-navbar"
                    style={{ cursor: "pointer", active: "red" }}
                  >
                    Account
                  </NavLink>
                </Link>
              </NavItem>
            )}
            {isAuth() && isAuth().role === 0 && (
              <NavItem>
                <Link to="/admin/strategies">
                  <NavLink className="my-navbar" style={{ cursor: "pointer" }}>
                    Strategy
                  </NavLink>
                </Link>
              </NavItem>
            )}
            {isAuth() && isAuth().role === 0 && (
              <NavItem>
                <Link to="/admin/positions">
                  <NavLink className="my-navbar" style={{ cursor: "pointer" }}>
                    Position
                  </NavLink>
                </Link>
              </NavItem>
            )}
            {isAuth() && isAuth().role === 0 && (
              <NavItem>
                <Link to="/admin/trades">
                  <NavLink className="my-navbar" style={{ cursor: "pointer" }}>
                    Trade
                  </NavLink>
                </Link>
              </NavItem>
            )}

            {isAuth() && (
              <NavItem>
                <NavLink
                  className="my-navbar"
                  style={{ cursor: "pointer" }}
                  onClick={() => signout(() => history.push("/auth/signin"))}
                >
                  SignOut
                </NavLink>
              </NavItem>
            )}
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default withRouter(Header);
