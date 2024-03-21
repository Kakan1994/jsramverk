// frontend-react/src/components/TrainMap.js
import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import styled from "styled-components";

import "leaflet/dist/leaflet.css";

import Markers from "./Markers";

const StyledMapContainer = styled(MapContainer)`
    height: 100vh;
`;

function TrainMap() {
    return (
        <StyledMapContainer center={[62.173276, 14.942265]} zoom={5}>
            <TileLayer
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                maxZoom={19}
            />
            <Markers />
        </StyledMapContainer>
    );
}

export default TrainMap;
