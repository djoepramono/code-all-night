import React from "react"
import { FluidLogo } from "./logo/fluidLogo"
import styled from "styled-components"
import { screen, color, font } from "./helper"

const LogoWrapper = styled.div`
  width: 140px;
`

const Wrapper = styled.div`
  width: 250px;
  height: 100vh;
  background-color: ${color.dimmedBlack};
  color: ${color.lightBlue};
  text-align: center;

  display: flex;
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

const Middle = styled.div`
  flex-grow: 1;
`

const Bottom = styled.div`
  height: 100px;
  padding: 10px;
  font-size: ${font.small};
`

const Menu = styled.div`
  padding: 5px;
`

const Sidebar = () => (
  <Wrapper>
    <Top>
      <LogoWrapper>
        <FluidLogo />
      </LogoWrapper>
    </Top>
    <Middle>
      <Menu>BLOG</Menu>
      <Menu>PROJECTS</Menu>
      <Menu>ABOUT</Menu>
    </Middle>
    <Bottom>
      <div>Code All Night</div>
      <div>© {new Date().getFullYear()}</div>
    </Bottom>
  </Wrapper>
)

export default Sidebar
