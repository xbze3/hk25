import {
    MapContainer,
    TileLayer,
    Marker,
    useMap,
    useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet-defaulticon-compatibility";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";

const ReportMap = ({
    onLocationSelect,
}: {
    onLocationSelect: (coords: [number, number]) => void;
}) => {
    const [position, setPosition] = useState<[number, number] | null>(null);

    const EnableGeocoder = () => {
        const map = useMap();

        useEffect(() => {
            const geocoder = (L.Control as any)
                .geocoder({
                    defaultMarkGeocode: false,
                })
                .on("markgeocode", function (e: any) {
                    const center = e.geocode.center;
                    const coords: [number, number] = [center.lat, center.lng];
                    map.setView(center, 16);
                    setPosition(coords);
                    onLocationSelect(coords);
                })
                .addTo(map);

            return () => {
                map.removeControl(geocoder);
            };
        }, [map]);

        return null;
    };

    const MapClickHandler = () => {
        useMapEvents({
            click(e) {
                const coords: [number, number] = [e.latlng.lat, e.latlng.lng];
                setPosition(coords);
                onLocationSelect(coords);
            },
        });
        return null;
    };

    return (
        <MapContainer
            center={[6.8013, -58.1551]}
            zoom={13}
            style={{ height: "400px", width: "100%", borderRadius: "10px" }}
        >
            <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <EnableGeocoder />
            <MapClickHandler />
            {position && (
                <Marker
                    position={position}
                    icon={
                        new L.Icon({
                            iconUrl:
                                "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
                            shadowUrl:
                                "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                            shadowSize: [41, 41],
                        })
                    }
                />
            )}
        </MapContainer>
    );
};

export default ReportMap;
