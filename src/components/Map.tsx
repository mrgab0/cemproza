"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Fix for default marker icons in Leaflet when using Webpack/Next
// Though we are using a custom icon anyway!
const customIcon = new L.Icon({
  iconUrl: "/logo.png",
  iconSize: [40, 40], // Size of the icon
  iconAnchor: [20, 20], // Point of the icon which will correspond to marker's location
  popupAnchor: [0, -20], // Point from which the popup should open relative to the iconAnchor
  className: "rounded-full border-2 border-black bg-white object-cover shadow-lg",
});

export default function Map() {
  const position: [number, number] = [8.626, -70.222]; // Coordenadas aproximadas de Barinas

  return (
    <MapContainer 
      center={position} 
      zoom={15} 
      scrollWheelZoom={false} 
      style={{ height: "100%", width: "100%", zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={customIcon}>
        <Popup>
          <div className="text-center font-body-md font-bold text-on-surface">
            CEMPROZA Cursos <br /> Barinas, Venezuela
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
