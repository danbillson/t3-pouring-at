"use client";
import { Marker } from "~/components/marker";
import Map from "google-maps-react-markers";
import type { Bar } from "~/db/schema";

export function BarsMap({
  bars,
  lng,
  lat,
  zoom,
}: {
  lng: number;
  lat: number;
  zoom: number;
  bars: Bar[];
}) {
  return (
    <div className="h-96 w-screen py-4">
      <Map
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        defaultCenter={{ lng, lat }}
        defaultZoom={zoom}
      >
        {bars.map((bar) => (
          <Marker
            key={bar.id}
            bar={bar}
            lat={bar.latitude}
            lng={bar.longitude}
          />
        ))}
      </Map>
    </div>
  );
}
