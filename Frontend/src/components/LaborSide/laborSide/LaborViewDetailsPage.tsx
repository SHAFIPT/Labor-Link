import React, { useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, Calendar, DollarSign, User, FileText, AlertCircle, ArrowLeft } from 'lucide-react';
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';

const LaborViewDetailsPage = () => {
  const location = useLocation();
    const booking = location.state?.booking;
    const navigate = useNavigate();

  const {
    bookingId,
    cancellation,
    createdAt,
    laborId,
    paymentStatus,
    quote,
    status,
    updatedAt,
    userId,
    additionalChargeRequest
  } = booking;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

   const coordinates = useMemo(() => ({
    user: {
      latitude: 12.9716,
      longitude: 77.5946
    },
    labor: {
      latitude: 10.8774908,
      longitude: 76.3138677
    }
  }), []);

  useEffect(() => {
    mapboxgl.accessToken = "pk.eyJ1IjoiYXJycnUiLCJhIjoiY202bmtpMDZ0MDdyMzJpcGQ1Y3Q3d3JveCJ9.KjVmyabdUcsKhNFsWLe9-Q";

    if (!mapContainerRef.current) return;

    // Initialize map with control options
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [coordinates.user.longitude, coordinates.user.latitude],
      zoom: 8,
      attributionControl: false,  // Disable default attribution control
      logoPosition: 'bottom-right'
    });

    // Add minimal attribution in a less prominent position
    map.addControl(
      new mapboxgl.AttributionControl({
        compact: true,
        customAttribution: null
      }),
      'bottom-right'
    );

    mapRef.current = map;

    // Rest of your existing map code...
    map.on('load', () => {
      getRoute();

      const userPopup = new mapboxgl.Popup({ offset: 25 })
        .setHTML('<h3>Customer Location</h3>');

      new mapboxgl.Marker({
        color: '#EF4444'
      })
        .setLngLat([coordinates.user.longitude, coordinates.user.latitude])
        .setPopup(userPopup)
        .addTo(map);

      const laborPopup = new mapboxgl.Popup({ offset: 25 })
        .setHTML('<h3>Labor Location</h3>');

      new mapboxgl.Marker({
        color: '#22C55E'
      })
        .setLngLat([coordinates.labor.longitude, coordinates.labor.latitude])
        .setPopup(laborPopup)
        .addTo(map);

      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: []
          }
        }
      });

      map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#2563eb',
          'line-width': 4,
          'line-opacity': 0.8
        }
      });
    });

    async function getRoute() {
      try {
        const query = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates.labor.longitude},${coordinates.labor.latitude};${coordinates.user.longitude},${coordinates.user.latitude}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
          { method: 'GET' }
        );
        const json = await query.json();
        
        const data = json.routes[0];
        const route = data.geometry.coordinates;
        
        const geojson = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: route
          }
        };
        
        if (map.getSource('route')) {
          (map.getSource('route') as mapboxgl.GeoJSONSource).setData(geojson as any);
        }

        const bounds = new mapboxgl.LngLatBounds();
        route.forEach(point => {
          bounds.extend(point as [number, number]);
        });
        
        map.fitBounds(bounds, {
          padding: 50
        });
      } catch (error) {
        console.error('Error fetching route:', error);
      }
    }

    return () => map.remove();
  }, [coordinates]);


  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
           <div className="bg-blue-600 px-6 py-4">
            <div className="flex items-center mb-2">
              <button 
                onClick={() => navigate(-1)} 
                className="flex items-center text-white hover:text-blue-100 transition-colors mr-4"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-white">Booking Details</h1>
            </div>
            <p className="text-blue-100">ID: {bookingId}</p>
          </div>

          {/* Status Banner */}
          <div className={`px-6 py-2 ${status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            <p className="text-sm font-medium">Status: {status.toUpperCase()}</p>
          </div>

          {/* Main Content */}
          <div className="p-6 space-y-6">
            {/* Quote Details */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4">Quote Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Arrival Time</p>
                    <p className="font-medium">{formatDate(quote.arrivalTime)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Estimated Cost</p>
                    <p className="font-medium">${quote.estimatedCost}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">Description</p>
                <p className="mt-1">{quote.description}</p>
              </div>
            </div>

            {/* Customer Details */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
              <div className="flex items-center space-x-4">
                <img 
                  src={userId.ProfilePic} 
                  alt="Profile" 
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-medium">{userId.firstName} {userId.lastName}</p>
                  <p className="text-sm text-gray-500">Customer ID: {userId._id}</p>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium">Payment Status: {paymentStatus.toUpperCase()}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Additional Charge: ${additionalChargeRequest.amount}
                  <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                    {additionalChargeRequest.status}
                  </span>
                </p>
              </div>
            </div>


             {/* Map Section - Updated positioning */}
             <div className="border-b pb-6">
                <h2 className="text-xl font-semibold mb-4">Route to Customer</h2>
                <div className="relative">
                  <div 
                    ref={mapContainerRef} 
                    className="h-96 w-full rounded-lg shadow-md overflow-hidden"
                    style={{ position: 'relative', zIndex: 1 }}
                  />
                  <div className="mt-4 flex justify-between text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span>Labor Location</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                      <span>Customer Location</span>
                    </div>
                  </div>
                </div>
              </div>




            {/* Action Buttons */}
            <div className="flex flex-col gap-4">
              {/* Top Row Buttons (Responsive) */}
              <div className="flex flex-wrap gap-4 justify-center md:justify-between">
                <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors w-full md:w-auto">
                  Cancel Booking
                </button>
                <button className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors w-full md:w-auto">
                  Request Additional Charge
                </button>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full md:w-auto">
                  Reschedule
                </button>
              </div>

              {/* Bottom Centered Button */}
              <div className="flex justify-center">
                <button className="px-6 py-2 bg-green-600 lg:ml-10 text-white rounded-lg hover:bg-green-700 transition-colors w-full md:w-auto">
                  Work Completed
                </button>
              </div>
            </div>


          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 text-sm text-gray-500">
            <p>Created: {formatDate(createdAt)}</p>
            <p>Last Updated: {formatDate(updatedAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaborViewDetailsPage;