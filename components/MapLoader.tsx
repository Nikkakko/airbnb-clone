import * as React from "react";
import { Skeleton } from "./ui/skeleton";

interface MapLoaderProps {}

const MapLoader: React.FC<MapLoaderProps> = ({}) => {
  return <Skeleton className="w-full h-96" />;
};

export default MapLoader;
