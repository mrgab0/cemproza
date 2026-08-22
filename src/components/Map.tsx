"use client";

import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Logo de CEMPROZA
const customIcon = new L.Icon({
  iconUrl: "/logo.png",
  iconSize: [50, 50],
  iconAnchor: [25, 25],
  popupAnchor: [0, -25],
  className: "rounded-full border-2 border-primary bg-white object-cover shadow-[0_0_15px_rgba(0,226,217,0.5)]",
});

const pointsOfInterest = [
  { name: "🏛️ Plaza Bolívar", pos: [8.6275, -70.2200] as [number, number] },
  { name: "🐼 Bazar La Nueva Chinita", pos: [8.6245, -70.2235] as [number, number] },
];

export default function Map() {
  const centerPosition: [number, number] = [8.626, -70.222]; // Coordenadas principales (CEMPROZA)

  return (
    <MapContainer 
      center={centerPosition} 
      zoom={17} 
      scrollWheelZoom={false} 
      style={{ height: "100%", width: "100%", zIndex: 0 }}
    >
      {/* Capa de Satélite de Esri */}
      <TileLayer
        attribution='&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      />
      
      {/* Marcador Principal CEMPROZA */}
      <Marker position={centerPosition} icon={customIcon}>
        <Popup>
          <div className="text-center font-body-md font-bold text-on-surface">
            CEMPROZA Cursos <br /> Sede Principal
          </div>
        </Popup>
        <Tooltip permanent direction="bottom" offset={[0, 20]} className="bg-primary text-on-primary font-bold border-none shadow-lg text-sm px-3 py-1 rounded-full">
          CEMPROZA
        </Tooltip>
      </Marker>

      {/* Punto de Interés 1: Plaza Bolívar (apuntando a la derecha) */}
      <CircleMarker 
        center={pointsOfInterest[0].pos} 
        radius={6} 
        pathOptions={{ color: "#ffa857", fillColor: "#ffa857", fillOpacity: 0.8 }}
      >
        <Tooltip permanent direction="right" offset={[10, 0]} className="bg-surface/90 text-on-surface font-bold border-outline-variant shadow-md text-xs px-2 py-1">
          {pointsOfInterest[0].name}
        </Tooltip>
      </CircleMarker>

      {/* Punto de Interés 2: Bazar La Nueva Chinita (apuntando a la izquierda) */}
      <CircleMarker 
        center={pointsOfInterest[1].pos} 
        radius={6} 
        pathOptions={{ color: "#ffa857", fillColor: "#ffa857", fillOpacity: 0.8 }}
      >
        <Tooltip permanent direction="left" offset={[-10, 0]} className="bg-surface/90 text-on-surface font-bold border-outline-variant shadow-md text-xs px-2 py-1">
          {pointsOfInterest[1].name}
        </Tooltip>
      </CircleMarker>
    </MapContainer>
  );
}
