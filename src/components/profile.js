import PropTypes from "prop-types"
import React from "react"
import styled from "styled-components";

const LeftColumn = styled.div`
    width: 400px;
    background: blue;
`;

const Profile = (profile) => (
    <LeftColumn>
        <div>{profile.name}</div>
        <div>{profile.location}</div>
    </LeftColumn>
);

Profile.propTypes = {
    name: PropTypes.string,
    location: PropTypes.string
}

export default Profile;