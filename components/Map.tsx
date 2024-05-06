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
import { cn } from "@/lib/utils";
import { LoaderIcon } from "lucide-react";

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});

interface MapProps extends React.HTMLAttributes<HTMLDivElement> {
  center?: number[];
  location?: string;
}

const url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const Map: React.FC<MapProps> = ({ location, ...props }) => {
  const form = useFormContext();
  const { getCoordinates } = useCountries();
  const locationValue = form?.getValues("location") || location;
  const center = getCoordinates(
    (location as string) || (locationValue as string)
  );
  const [isLoaded, setIsLoaded] = React.useState(true);

  React.useEffect(() => {
    if (center) {
      setIsLoaded(false);
    }
  }, [center]);

  if (isLoaded) {
    return (
      <div className="flex items-center justify-center h-[35vh]">
        <LoaderIcon className="animate-spin" />
      </div>
    );
  }

  return (
    <div className={cn(" w-full", props.className)}>
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
