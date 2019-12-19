import PropTypes from "prop-types"
import React from "react"
import styled from "styled-components";

const RightColumn = styled.div`
    width: 400px;
    background: yellow;
`;

const Profile = (profile) => (
    <RightColumn>
        <div>{profile.name}</div>
        <div>{profile.location}</div>
    </RightColumn>
);

Profile.propTypes = {
    name: PropTypes.string,
    location: PropTypes.string
}

export default Profile;