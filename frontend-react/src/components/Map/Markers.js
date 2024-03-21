import { useRef, useEffect } from "react";
import { useMap } from "react-leaflet";

import mapSocket from "../../utility/mapSocket";
import leafletIcons from "../../utility/leafletIcons";

leafletIcons();

function Markers() {
    const map = useMap();
    const markersRef = useRef({});

    useEffect(() => {
        mapSocket(map, markersRef);
    }, [map]);

    return null;
}

export default Markers;
