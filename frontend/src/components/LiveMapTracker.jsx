import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Truck, Navigation, Clock, ShieldCheck, Thermometer, Gauge, PhoneCall, UserCheck, AlertCircle } from 'lucide-react';

// Custom Leaflet Icons using SVG Data URIs
const createCustomIcon = (color, isTruck = false) => {
  const svgMarkup = isTruck ? `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" fill="${color}" stroke="#ffffff" stroke-width="1.5">
      <circle cx="12" cy="12" r="11" fill="#090D16" stroke="${color}" stroke-width="2"/>
      <path d="M1 3h15v13H1z" fill="${color}"/>
      <path d="M16 8h4l3 3v5h-7V8z" fill="${color}"/>
      <circle cx="5.5" cy="18.5" r="2.5" fill="#ffffff"/>
      <circle cx="18.5" cy="18.5" r="2.5" fill="#ffffff"/>
    </svg>
  ` : `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="${color}">
      <circle cx="12" cy="12" r="8" fill="${color}" stroke="#ffffff" stroke-width="2"/>
    </svg>
  `;
  return new L.Icon({
    iconUrl: `data:image/svg+xml;utf8,${encodeURIComponent(svgMarkup)}`,
    iconSize: isTruck ? [36, 36] : [24, 24],
    iconAnchor: isTruck ? [18, 18] : [12, 12],
    popupAnchor: [0, -18],
  });
};

const truckIcon = createCustomIcon('#ff6b00', true);
const passedIcon = createCustomIcon('#22c55e', false);
const pendingIcon = createCustomIcon('#64748b', false);

// Component to dynamically re-center map when active shipment changes
function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, 7, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

const LiveMapTracker = ({ shipment, onSelectAnother }) => {
  if (!shipment) return null;

  const [animatedCoords, setAnimatedCoords] = useState([shipment.current_lat, shipment.current_lng]);

  // Simulate subtle real-time truck micro-movement on map
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedCoords(prev => [
        prev[0] + (Math.random() - 0.5) * 0.0015,
        prev[1] + (Math.random() - 0.5) * 0.0015
      ]);
    }, 4000);
    return () => clearInterval(interval);
  }, [shipment]);

  const waypoints = shipment.waypoints || [];
  const polylineCoords = waypoints.map(w => [w.lat, w.lng]);
  const centerPos = [shipment.current_lat, shipment.current_lng];

  return (
    <div id="live-map-section" className="py-12 bg-[#090D16] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                ACTIVE SHIPMENT #{shipment.tracking_code}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Live GPS Active
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {shipment.origin_city} ➔ {shipment.destination_city}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectAnother('BHL-NG-88492')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${shipment.tracking_code === 'BHL-NG-88492' ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-300'}`}
            >
              Lagos-Abuja Route
            </button>
            <button
              onClick={() => onSelectAnother('BHL-NG-90144')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${shipment.tracking_code === 'BHL-NG-90144' ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-300'}`}
            >
              PH-Kano Cold Chain
            </button>
            <button
              onClick={() => onSelectAnother('BHL-NG-31088')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${shipment.tracking_code === 'BHL-NG-31088' ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-300'}`}
            >
              Lagos Urban Express
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Map Box (Takes 2 Columns on Large Screen) */}
          <div className="lg:col-span-2 glass-panel p-2 rounded-2xl relative min-h-[480px] h-[520px] shadow-2xl border border-slate-800">
            <MapContainer
              center={centerPos}
              zoom={7}
              scrollWheelZoom={false}
              className="w-full h-full rounded-xl"
            >
              <MapRecenter center={centerPos} />
              
              {/* TileLayer using Dark CartoDB Style */}
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />

              {/* Highway Route Polyline */}
              {polylineCoords.length > 1 && (
                <Polyline
                  positions={polylineCoords}
                  pathOptions={{ color: '#ff6b00', weight: 4, opacity: 0.8, dashArray: '8, 8' }}
                />
              )}

              {/* Waypoint Markers */}
              {waypoints.map((wp, idx) => (
                <Marker
                  key={idx}
                  position={[wp.lat, wp.lng]}
                  icon={wp.passed ? passedIcon : pendingIcon}
                >
                  <Popup>
                    <div className="text-xs space-y-1">
                      <div className="font-bold text-slate-100">{wp.location_name}</div>
                      <div className={wp.passed ? 'text-green-400 font-semibold' : 'text-slate-400'}>
                        {wp.passed ? 'Passed Checkpoint' : 'Upcoming Waypoint'}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Animated Truck Live GPS Marker */}
              <Marker position={animatedCoords} icon={truckIcon}>
                <Popup>
                  <div className="text-xs space-y-1">
                    <div className="font-bold text-orange-400">B.HARRY FLEET #{shipment.truck_number}</div>
                    <div className="text-slate-200">{shipment.current_location_name}</div>
                    <div className="text-slate-400 font-mono">Speed: {shipment.speed_kmh} km/h</div>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>

            {/* Floating Live Telemetry Badge over Map */}
            <div className="absolute top-5 right-5 z-[400] glass-panel p-3 rounded-xl border border-slate-700/80 shadow-lg text-xs space-y-2 hidden sm:block">
              <div className="flex items-center gap-2 text-slate-300">
                <Gauge className="w-4 h-4 text-orange-400" />
                <span>Speed: <strong className="text-white">{shipment.speed_kmh} km/h</strong></span>
              </div>
              {shipment.temperature_celsius && (
                <div className="flex items-center gap-2 text-slate-300">
                  <Thermometer className="w-4 h-4 text-cyan-400" />
                  <span>Cargo Temp: <strong className="text-cyan-300">{shipment.temperature_celsius}°C</strong></span>
                </div>
              )}
              <div className="flex items-center gap-2 text-slate-300">
                <Navigation className="w-4 h-4 text-green-400" />
                <span>Status: <strong className="text-green-400 uppercase">{shipment.status}</strong></span>
              </div>
            </div>
          </div>

          {/* Shipment & Telemetry Information Drawer */}
          <div className="space-y-6">
            
            {/* Driver & Truck Details Card */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center justify-between">
                <span>Driver & Fleet Info</span>
                <ShieldCheck className="w-4 h-4 text-green-400" />
              </h3>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-lg">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-white text-base">{shipment.driver_name}</div>
                  <div className="text-xs text-slate-400 font-mono">{shipment.truck_number}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
                <div>
                  <div className="text-slate-400">Current Position</div>
                  <div className="text-slate-200 font-medium truncate" title={shipment.current_location_name}>
                    {shipment.current_location_name}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Estimated Delivery</div>
                  <div className="text-orange-400 font-bold">
                    {new Date(shipment.estimated_delivery).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>

              <a
                href={`tel:${shipment.driver_phone}`}
                className="mt-4 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-orange-400" />
                <span>Call Driver ({shipment.driver_phone})</span>
              </a>
            </div>

            {/* Highway Waypoint Timeline */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 max-h-[300px] overflow-y-auto">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-400" />
                <span>Route Waypoint Timeline</span>
              </h3>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                {waypoints.map((wp, idx) => (
                  <div key={idx} className="relative">
                    <div className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 border-[#090D16] ${wp.passed ? 'bg-green-500 shadow-sm shadow-green-500' : 'bg-slate-700'}`} />
                    <div>
                      <div className={`text-xs font-semibold ${wp.passed ? 'text-white' : 'text-slate-400'}`}>
                        {wp.location_name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {wp.passed ? (wp.passed_at ? new Date(wp.passed_at).toLocaleTimeString() : 'Checkpoint Passed') : 'Pending Arrival'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default LiveMapTracker;
