const mapsUrl = `https://maps.googleapis.com/maps/api`;

export const geocode = async (address: string, key: string) => {
  const encodedAddress = encodeURIComponent(address);

  const res = await fetch(
    `${mapsUrl}/geocode/json?address=${encodedAddress}&key=${key}`
  );
  const json = (await res.json()) as GeocodeResponse;
  return json;
};

type GeocodeResponse = {
  results: {
    address_components: {
      long_name: string;
      short_name: string;
      types: string[];
    }[];
    formatted_address: string;
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
      location_type: string;
      viewport: {
        northeast: {
          lat: number;
          lng: number;
        };
        southwest: {
          lat: number;
          lng: number;
        };
      };
    };
    place_id: string;
    types: string[];
  }[];
  status: string;
};
