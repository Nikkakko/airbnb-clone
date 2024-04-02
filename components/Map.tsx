"use client";
import * as React from "react";
import L from "leaflet";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useFormContext } from "react-hook-form";
import useCountries from "@/hooks/useCountries";
import NoSsr from "@/hooks/noSsr";

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});

interface MapProps {
  center?: number[];
}

const url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const Map: React.FC<MapProps> = () => {
  const { getValues } = useFormContext();
  const { getCoordinates } = useCountries();
  const locationValue = getValues("location");
  const center = getCoordinates(locationValue);

  return (
    <div className="py-4">
      <MapContainer
        key={locationValue}
        center={(center as L.LatLngExpression) || [51, -0.09]}
        zoom={center ? 4 : 2}
        scrollWheelZoom={false}
        className="h-[35vh] rounded-lg"
      >
        <TileLayer url={url} attribution={attribution} />
        {center && <Marker position={center as L.LatLngExpression} />}
      </MapContainer>
    </div>
  );
};

export default Map;
