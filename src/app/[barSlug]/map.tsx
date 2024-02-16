"use client";
import { Marker } from "~/components/marker";
import Map from "google-maps-react-markers";
import type { Bar } from "~/db/schema";

export function BarMap({ bar }: { bar: Bar }) {
  return (
    <div className="h-96 w-screen py-4">
      <Map
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        defaultCenter={{ lng: bar.longitude, lat: bar.latitude }}
        defaultZoom={17}
      >
        <Marker bar={bar} lat={bar.latitude} lng={bar.longitude} />
      </Map>
    </div>
  );
}
