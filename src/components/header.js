import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import styled from "styled-components"
import { screen, color } from "./helper"
import { FixedLogo } from "./logo/fixedLogo"

const HeaderStrip = styled.div`
  min-height: 60px;
  padding: 0 1.5em;
  background-color: ${color.darkerBlue};

  display: flex;
  align-items: center;
`

const HomepageLink = styled(Link)`
  color: ${color.lightBlue};
  text-decoration: none;
  margin-left: 15px;
  flex-grow: 1;
`

const HeaderLink = styled(Link)`
  color: ${color.dimmedBlack};
  text-decoration: none;

  &:hover {
    color: white;
  }
`

const HeaderMenu = styled.div`
  width: 100px;
  padding: 0.5em;

  @media ${screen.phone} {
    display: none;
  }
`

const MenuDropDown = styled.div`
  flex-direction: column;

  background-color: ${color.darkerBlue};
  width: 100px;
  color: ${color.lightBlue};
  position: absolute;
  right: 1.5em;
  ${props =>
    props.isExpanded
      ? `display: flex; background-color: ${color.lightBlue};`
      : "display: none"};
`

const MenuDropDownLink = styled(Link)`
  color: ${color.dimmedBlack};
  text-decoration: none;
  padding: 0.5em;
  border-bottom: 1px solid ${color.dimmedBlack};
`

class Header extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isMenuExpanded: false,
    }
  }

  toggleMenu = e => {
    this.setState({ isMenuExpanded: !this.state.isMenuExpanded })
  }

  render() {
    return (
      <>
        <HeaderStrip>
          <FixedLogo />
          <HomepageLink to="/">{this.props.siteTitle}</HomepageLink>
          <HeaderMenu><HeaderLink to="/list-1">Posts</HeaderLink></HeaderMenu>
          <HeaderMenu><HeaderLink to="/posts">Search</HeaderLink></HeaderMenu>
          <HeaderMenu><HeaderLink to="/about">About</HeaderLink></HeaderMenu>
          <HeaderMenu isExpanded={this.state.isMenuExpanded} onClick={this.toggleMenu}>
            {this.state.isMenuExpanded ? `Less` : `More`}
          </HeaderMenu>
        </HeaderStrip>
        <MenuDropDown isExpanded={this.state.isMenuExpanded}>
          <MenuDropDownLink to="/posts">Search</MenuDropDownLink>
          <MenuDropDownLink to="/about">About</MenuDropDownLink>
        </MenuDropDown>
      </>
    )
  }
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
