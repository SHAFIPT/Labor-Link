import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useDispatch } from 'react-redux';
import { setLocationOfUser } from "../../redux/slice/userSlice";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";

const SelectLocation = ({ setLatLng }) => {
    useMapEvents({
        click(e) {
            setLatLng({ lat: e.latlng.lat, lng: e.latlng.lng });
        },
    });
    return null;
};

const MapSelector = ({ setShowMapModal , onClose}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [latLng, setLatLng] = useState({ lat: 12.9716, lng: 77.5946 });
    console.log('This si eth find mapppppppppppppppppp : ',latLng)
    const handleSaveLocation = () => {
        dispatch(setLocationOfUser({ latitude: latLng.lat, longitude: latLng.lng }));
        setShowMapModal(false);
        onClose()
        navigate('/laborListing')
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg max-w-[500px] w-full">
                <h2 className="text-xl font-semibold text-center mb-4">Select Your Location</h2>
                <MapContainer center={[latLng.lat, latLng.lng]} zoom={13} style={{ height: "400px", width: "100%" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <SelectLocation setLatLng={setLatLng} />
                    <Marker position={[latLng.lat, latLng.lng]} />
                </MapContainer>
                <p className="text-center mt-2">Selected Coordinates: {latLng.lat}, {latLng.lng}</p>
                <div className="flex justify-between mt-4">
                    <button onClick={() => setShowMapModal(false)} className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500">
                        Cancel
                    </button>
                    <button onClick={handleSaveLocation} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                        Save Location
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MapSelector;
