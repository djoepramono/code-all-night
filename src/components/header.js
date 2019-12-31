import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import styled from "styled-components"
import { screen, color } from "./helper"
import { FixedLogo } from "./logo/fixedLogo"

const Wrapper = styled.header`
  @media ${screen.tabletOrLarger} {
    display: none;
  }
`

const HeaderStrip = styled.div`
  min-height: 60px;
  padding: 0 1.5em;
  background-color: ${color.dimmedBlack};

  display: flex;
  align-items: center;
`

const LogoWrapper = styled.div``

const HeaderLink = styled(Link)`
  color: ${color.lightBlue};
  text-decoration: none;
  margin-left: 15px;
  flex-grow: 1;
`

const HeaderMenu = styled.div`
  color: ${color.lightBlue};
  width: 100px;
  padding: 0.5em;  
`

const MenuDropDown = styled.div`
  flex-direction: column;

  background-color: ${color.dimmedBlack};
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
      <Wrapper>
        <HeaderStrip>
          <FixedLogo />
          <HeaderLink to="/">{this.props.siteTitle}</HeaderLink>
          <HeaderMenu isExpanded={this.state.isMenuExpanded} onClick={this.toggleMenu}>
            {this.state.isMenuExpanded ? `Less` : `More`}
          </HeaderMenu>
        </HeaderStrip>
        <MenuDropDown isExpanded={this.state.isMenuExpanded}>
          <MenuDropDownLink to="/posts">Search</MenuDropDownLink>
          <MenuDropDownLink to="/about">About</MenuDropDownLink>
        </MenuDropDown>
      </Wrapper>
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
