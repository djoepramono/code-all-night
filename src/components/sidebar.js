import React from "react"
import { FluidLogo } from "./logo/fluidLogo"
import styled from "styled-components"
import { screen, color, font } from "./helper"
import { Link } from "gatsby"
import { TwitterIcon } from "./socialMedia/twitterIcon"
import { GithubIcon } from "./socialMedia/githubIcon"
import { MediumIcon } from "./socialMedia/mediumIcon"
import { DevtoIcon } from "./socialMedia/devtoIcon"

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

  display: flex;
  justify-content: center;

  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 0;
`

const MenuContainer = styled.div`
  width: 120px;
`

const Menu = styled.nav`
  display: flex;
  align-items: center;
  padding: 5px;
`

const StyledLink = styled(Link)`
  color: ${color.dimmedBlack};
  text-decoration: none;
  margin-left: 5px;
`

const Sidebar = ({ homeLink }) => (
  <Wrapper>
    <Top>
      <LogoWrapper>
        <FluidLogo />
      </LogoWrapper>
    </Top>
    <Outbound>
      <MenuContainer>
        <Menu>
          <TwitterIcon/><StyledLink to="https://twitter.com/djoepramono">Twitter</StyledLink>
        </Menu>
        <Menu>
          <GithubIcon/><StyledLink to="https://github.com/wecodeallnight">GitHub</StyledLink>
        </Menu>
        <Menu>
          <MediumIcon/><StyledLink to="https://medium.com/@djoepramono">Medium</StyledLink>
        </Menu>
        <Menu>
          <DevtoIcon/><StyledLink to="https://dev.to/djoepramono">dev.to</StyledLink>
        </Menu>
      </MenuContainer>
    </Outbound>
  </Wrapper>
)

export default Sidebar
