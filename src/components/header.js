import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import styled from "styled-components"
import { screen, color } from "./helper"
import { FixedLogo } from "./logo/fixedLogo"

const Wrapper = styled.header`
  min-height: 60px;
  padding: 0 1.5em;
  background-color: ${color.dimmedBlack};

  display: flex;
  align-items: center;

  @media ${screen.tabletOrLarger} {
    display: none;
  }
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
  background-color: ${color.dimmedBlack};
  width: 100px;
  color: ${color.lightBlue};
  position: absolute;
  right: 1.5em;
  ${props => (props.visible ? "display: block" : "display: none")};
`

const MenuDropDownLink = styled(Link)`
  display: flex;
  flex-direction: row;
  color: inherit;
  text-decoration: none;
  padding: 0.5em;
`

class Header extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isMenuCollapsed: false,
    }
  }

  toggleMenu = e => {
    this.setState({ isMenuCollapsed: !this.state.isMenuCollapsed })
  }

  render() {
    return (
      <>
        <Wrapper>
          <FixedLogo />
          <HeaderLink to="/">{this.props.siteTitle}</HeaderLink>
          <HeaderMenu onClick={this.toggleMenu}>More</HeaderMenu>
        </Wrapper>
        <MenuDropDown visible={this.state.isMenuCollapsed}>
          <MenuDropDownLink to="/posts">Search</MenuDropDownLink>
          <MenuDropDownLink to="/posts">About</MenuDropDownLink>
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
