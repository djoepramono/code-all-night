import React from "react"
import { FluidLogo } from "./logo/fluidLogo"
import styled from "styled-components"
import { screen, color, font } from "./helper"
import { Link } from "gatsby"

const LogoWrapper = styled.div`
  width: 140px;
`

const Wrapper = styled.div`
  min-width: 200px;

  color: ${color.strongGreen};
  text-align: center;

  flex-direction: column;

  @media ${screen.phone} {
    display: none;
  }
`

const Top = styled.div`
  height: 300px;
  padding-top: 30px;

  display: flex;
  justify-content: center;
`

const Outbound = styled.div`
  color: ${color.darkerBlue};
  padding: 5px;

  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 0;
`

const Menu = styled.nav`
  padding: 5px;
`

const StyledLink = styled(Link)`
  color: ${color.darkerBlue};
  text-decoration: none;
`

const Sidebar = ({ homeLink }) => (
  <Wrapper>
    <Top>
      <LogoWrapper>
        <FluidLogo />
      </LogoWrapper>
    </Top>
    <Outbound>
      Where to find us:
      <Menu><StyledLink to="/list-1">TWITTER</StyledLink></Menu>
      <Menu><StyledLink to="/list-1">GITHUB</StyledLink></Menu>
      <Menu><StyledLink to="/posts/">MEDIUM</StyledLink></Menu>
      <Menu><StyledLink to="/about">DEV.TO</StyledLink></Menu>
    </Outbound>
  </Wrapper>
)

export default Sidebar
