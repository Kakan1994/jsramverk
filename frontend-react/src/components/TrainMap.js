// frontend-react/src/components/TrainMap.js
import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function TrainMap() {
    const mapRef = useRef(null);
    const markersRef = useRef({});

    useEffect(() => {
        if (!mapRef.current) {
            const map = L.map("map").setView([62.173276, 14.942265], 5);

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            }).addTo(map);

            mapRef.current = map;
        }

        const socket = new WebSocket("ws://172.25.53.25:1337");

        socket.onmessage = function(event) {
            const data = JSON.parse(event.data);
            const { trainnumber, position } = data;

            if (markersRef.current[trainnumber]) {
                markersRef.current[trainnumber].setLatLng(position.lat, position.lng);
            } else {
                const marker = L.marker(position.lat, position.lng).addTo(mapRef.current);
                marker.bindPopup(`Train ${trainnumber}`);
                markersRef.current[trainnumber] = marker;
            }
        };

        return () => {
            socket.close();
            Object.values(markersRef.current).forEach(marker => mapRef.current.removeLayer(marker));
        };
    }, []);

    return <div ref={mapRef} style={{ height: '400px', width: '100%' }}></div>;
}

export default TrainMap;
