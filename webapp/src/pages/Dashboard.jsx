import React, { useState, useEffect } from "react";
import { 
  Menu, X, Home, Map, TrendingUp, Cloud, Bell, User, Settings, LogOut, 
  Download, ZoomIn, Calendar, Droplets, Thermometer, AlertTriangle, 
  BarChart3, ClipboardList, Truck, Wifi, WifiOff, CloudRain, Sun, Clock
} from "lucide-react";

// The mock data is kept here for reference or fallback
const mockFarmData = {
  farmName: "Green Valley Farms",
  location: "Sacramento Valley, CA",
  fields: [
    { 
      id: "field-1", 
      name: "North Field - Wheat", 
      area: "120 acres", 
      cropType: "Winter Wheat",
      plantingDate: "2023-10-15",
      expectedHarvest: "2024-06-20",
      soilType: "Clay Loam",
      irrigation: "Center Pivot"
    },
    { 
      id: "field-2", 
      name: "South Field - Corn", 
      area: "85 acres", 
      cropType: "Field Corn",
      plantingDate: "2024-04-10",
      expectedHarvest: "2024-09-15",
      soilType: "Silt Loam",
      irrigation: "Drip"
    },
    { 
      id: "field-3", 
      name: "East Field - Soybeans", 
      area: "95 acres", 
      cropType: "Soybeans",
      plantingDate: "2024-05-05",
      expectedHarvest: "2024-10-01",
      soilType: "Sandy Loam",
      irrigation: "Linear Move"
    }
  ],
  currentField: "field-1",
  stats: {
    healthIndex: 82,
    pestRisk: "Medium",
    soilMoisture: 65,
    temperature: 24.5,
    growthStage: "Stem Extension",
    ndvi: 0.72,
    precipitation: 15.2
  },
  healthData: [
    { day: "Mon", health: 78, moisture: 62, temp: 22.1 },
    { day: "Tue", health: 80, moisture: 58, temp: 23.4 },
    { day: "Wed", health: 82, moisture: 61, temp: 24.7 },
    { day: "Thu", health: 85, moisture: 67, temp: 25.3 },
    { day: "Fri", health: 82, moisture: 65, temp: 24.5 },
    { day: "Sat", health: 81, moisture: 63, temp: 23.8 },
    { day: "Sun", health: 82, moisture: 65, temp: 24.2 }
  ],
  weatherForecast: [
    { day: "Today", condition: "Sunny", high: 26, low: 15, precipitation: 0 },
    { day: "Tomorrow", condition: "Partly Cloudy", high: 24, low: 14, precipitation: 10 },
    { day: "Wed", condition: "Light Rain", high: 22, low: 13, precipitation: 70 },
    { day: "Thu", condition: "Cloudy", high: 21, low: 12, precipitation: 30 },
    { day: "Fri", condition: "Sunny", high: 25, low: 14, precipitation: 0 }
  ],
  alerts: [
    { 
      id: 1, 
      type: "irrigation", 
      message: "Moisture low in Zone 3 - irrigate within 24 hrs", 
      priority: "high",
      time: "2 hours ago",
      zone: "Northwest quadrant",
      action: "Start irrigation cycle 4B"
    },
    { 
      id: 2, 
      type: "pest", 
      message: "High pest risk detected - spray recommended on Day 2", 
      priority: "medium",
      time: "5 hours ago",
      pestType: "Corn earworm",
      action: "Schedule spraying for Thursday AM"
    },
    { 
      id: 3, 
      type: "health", 
      message: "NDVI dropping by 15% compared to last week", 
      priority: "low",
      time: "Yesterday",
      affectedArea: "Southeast section",
      action: "Schedule soil nutrient test"
    }
  ],
  equipment: [
    { id: 1, name: "Tractor A", status: "Active", fuel: 85, location: "Field 2", lastMaintenance: "2024-05-15" },
    { id: 2, name: "Irrigation Pivot B", status: "Idle", fuel: "N/A", location: "Field 1", lastMaintenance: "2024-04-20" },
    { id: 3, name: "Harvester C", status: "Maintenance", fuel: 45, location: "Shed", lastMaintenance: "2024-06-01" }
  ],
  tasks: [
    { id: 1, name: "Soil testing", due: "2024-06-15", assigned: "John D.", status: "Pending" },
    { id: 2, name: "Fertilizer application", due: "2024-06-18", assigned: "Mike T.", status: "In Progress" },
    { id: 3, name: "Pest control inspection", due: "2024-06-20", assigned: "Team", status: "Scheduled" }
  ]
};

// Custom Components
const Button = ({ children, onClick, className = "", variant = "primary", size = "md", href }) => {
  const baseClasses = "rounded-xl font-bold transition-all flex items-center justify-center";
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };
  const variantClasses = {
    primary: "text-white bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600",
    secondary: "bg-white text-green-700 border border-green-300 hover:bg-green-50",
    danger: "bg-red-100 text-red-700 hover:bg-red-200"
  };

  const element = href ? (
    <a href={href} className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}>
      {children}
    </a>
  ) : (
    <button
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );

  return element;
};

const Card = ({ children, className = "", title, action }) => (
  <div className={`bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-5 ${className}`}>
    {(title || action) && (
      <div className="flex justify-between items-center mb-4">
        {title && <h3 className="font-semibold text-gray-800">{title}</h3>}
        {action && <div>{action}</div>}
      </div>
    )}
    {children}
  </div>
);

const Select = ({ value, onChange, options, className = "" }) => (
  <select
    className={`px-3 py-2 border rounded-lg text-gray-800 bg-white ${className}`}
    value={value}
    onChange={e => onChange(e.target.value)}
  >
    {options.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
  </select>
);

const ProgressBar = ({ value, max = 100, color = "green" }) => {
  const colorClasses = {
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
    blue: "bg-blue-500"
  };
  
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div 
        className={`h-2.5 rounded-full ${colorClasses[color]}`} 
        style={{ width: `${(value / max) * 100}%` }}
      ></div>
    </div>
  );
};

// Weather API Integration Component
const WeatherDataCard = ({ weatherData, location }) => {
  if (!weatherData) return null;

  const getWeatherIcon = (condition) => {
    const iconMap = {
      "Sunny": Sun,
      "Partly Cloudy": Cloud,
      "Cloudy": Cloud,
      "Light Rain": CloudRain,
      "Clear": Sun,
      "Rain": CloudRain,
      "Snow": CloudRain
    };
    
    const IconComponent = iconMap[condition] || Cloud;
    return <IconComponent size={20} />;
  };

  return (
    <Card title="Live Weather Data" className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
          <div className="flex justify-center mb-2">
            <Thermometer className="text-orange-500" size={24} />
          </div>
          <p className="text-2xl font-bold text-orange-600">{weatherData.temperature}°C</p>
          <p className="text-sm text-gray-600">Current Temperature</p>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
          <div className="flex justify-center mb-2">
            <Droplets className="text-blue-500" size={24} />
          </div>
          <p className="text-2xl font-bold text-blue-600">{weatherData.humidity}%</p>
          <p className="text-sm text-gray-600">Humidity</p>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
          <div className="flex justify-center mb-2">
            <CloudRain className="text-indigo-500" size={24} />
          </div>
          <p className="text-2xl font-bold text-indigo-600">{weatherData.precipitation}mm</p>
          <p className="text-sm text-gray-600">Precipitation</p>
        </div>
      </div>
      
      {weatherData.alerts && weatherData.alerts.length > 0 && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <h4 className="font-semibold text-yellow-800 mb-2">Weather Alerts</h4>
          {weatherData.alerts.map((alert, index) => (
            <div key={index} className="text-sm text-yellow-700">
              ⚠️ {alert.message}
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-500 text-center">
        Location: {location?.lat?.toFixed(4)}, {location?.lon?.toFixed(4)} • 
        Last updated: {weatherData.time ? new Date(weatherData.time).toLocaleTimeString() : 'N/A'}
      </div>
    </Card>
  );
};

// Main Component
export default function FarmDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [farmData, setFarmData] = useState(mockFarmData); // Initial state with mock data
  const [selectedField, setSelectedField] = useState("field-1");
  const [selectedTab, setSelectedTab] = useState("overview");
  const [satelliteView, setSatelliteView] = useState("ndvi");
  const [mapZoom, setMapZoom] = useState(100);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userLocation, setUserLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // New state for loading farm data
  const [loadingFarmData, setLoadingFarmData] = useState(true);
  const [farmDataError, setFarmDataError] = useState(null);

  const selectedFieldData = farmData?.fields.find(f => f.id === selectedField);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // EFFECT TO FETCH FARM DATA FROM FASTAPI
  useEffect(() => {
    const fetchFarmData = async () => {
      try {
        setLoadingFarmData(true);
        // Fetch data from the FastAPI /sensor endpoint
        const response = await fetch("http://127.0.0.1:8000/sensor");
        if (!response.ok) {
          throw new Error('Failed to fetch sensor data from FastAPI.');
        }
        const data = await response.json();
        
        // Update a copy of the mock data with the new sensor data
        setFarmData(prevData => {
          if (data && data.length > 0) {
            const latestSensorData = data[data.length - 1];
            return {
              ...prevData,
              stats: {
                ...prevData.stats,
                // Update the stats with real-time data
                soilMoisture: latestSensorData.soil_moisture,
                temperature: latestSensorData.temperature,
                // Placeholder for other data you might fetch
                // humidity: latestSensorData.humidity
              }
            };
          }
          return prevData;
        });
        setFarmDataError(null);
      } catch (err) {
        console.error('Error fetching farm data:', err);
        setFarmDataError('Failed to load farm data from local API. Using demo data.');
      } finally {
        setLoadingFarmData(false);
      }
    };

    fetchFarmData();
    // Re-fetch data every 30 seconds for live updates
    const interval = setInterval(fetchFarmData, 30000); 
    return () => clearInterval(interval);
  }, []);

  // Get user location and fetch weather data
  useEffect(() => {
    const fetchWeatherData = async (lat, lon) => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,soil_temperature_0_to_7cm,soil_moisture_0_to_7cm&daily=precipitation_sum,temperature_2m_max,temperature_2m_min&timezone=auto`
        );
        
        if (!response.ok) {
          throw new Error('Weather API request failed');
        }
        
        const data = await response.json();
        const hourly = data.hourly;
        const daily = data.daily;
        const lastIndex = hourly.time.length - 1;

        const latestData = {
          temperature: hourly.temperature_2m[lastIndex],
          humidity: hourly.relative_humidity_2m[lastIndex],
          precipitation: hourly.precipitation[lastIndex],
          wind: hourly.wind_speed_10m[lastIndex],
          soilTemp: hourly.soil_temperature_0_to_7cm[lastIndex],
          soilMoisture: hourly.soil_moisture_0_to_7cm[lastIndex],
          time: hourly.time[lastIndex],
          dailySummary: {
            rain: daily.precipitation_sum[0],
            maxTemp: daily.temperature_2m_max[0],
            minTemp: daily.temperature_2m_min[0],
          },
        };

        // Generate alerts based on weather conditions
        const alerts = [];
        if (latestData.soilMoisture !== null && latestData.soilMoisture < 0.15) {
          alerts.push({
            type: "warning",
            message: "Soil moisture is critically low — irrigation recommended immediately"
          });
        }
        if (latestData.dailySummary.rain > 10) {
          alerts.push({
            type: "info",
            message: "Heavy rainfall expected — postpone irrigation and secure equipment"
          });
        }
        if (latestData.wind > 30) {
          alerts.push({
            type: "danger",
            message: "High wind conditions detected — secure crops and farming equipment"
          });
        }

        setWeatherData({ ...latestData, alerts });
        setError(null);
      } catch (err) {
        console.error('Error fetching weather data:', err);
        setError('Failed to load weather data. Using demo data.');
      } finally {
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lon: longitude });
          fetchWeatherData(latitude, longitude);
        },
        (err) => {
          console.error('Geolocation error:', err);
          setError('Location access denied. Using demo location.');
          // Set default location (San Francisco) if geolocation fails
          const defaultLocation = { lat: 37.7749, lon: -122.4194 };
          setUserLocation(defaultLocation);
          fetchWeatherData(defaultLocation.lat, defaultLocation.lon);
        }
      );
    } else {
      setError('Geolocation not supported. Using demo location.');
      const defaultLocation = { lat: 37.7749, lon: -122.4194 };
      setUserLocation(defaultLocation);
      fetchWeatherData(defaultLocation.lat, defaultLocation.lon);
    }
  }, []);

  // Function to handle field image with different analysis views
  const renderFieldImage = () => {
    const imageUrls = {
      ndvi: "https://placeholder-image-service.onrender.com/image/600x400?prompt=Aerial%20NDVI%20vegetation%20index%20map%20of%20a%20farm%20field%20with%20color%20gradients%20from%20red%20to%20green%20showing%20plant%20health&id=ndvi-1",
      moisture: "https://placeholder-image-service.onrender.com/image/600x400?prompt=Soil%20moisture%20map%20of%20agricultural%20field%20with%20blue%20color%20gradients%20showing%20water%20content%20levels&id=moisture-1",
      elevation: "https://placeholder-image-service.onrender.com/image/600x400?prompt=Topographic%20elevation%20map%20of%20a%20farm%20with%20contour%20lines%20and%20height%20variations&id=elevation-1",
      yield: "https://placeholder-image-service.onrender.com/image/600x400?prompt=Predicted%20crop%20yield%20map%20with%20color-coded%20zones%20from%20low%20to%20high%20productivity&id=yield-1"
    };
    
    return (
      <div className="relative rounded-xl overflow-hidden shadow-md">
        <img 
          src={imageUrls[satelliteView]} 
          alt={`${satelliteView.toUpperCase()} analysis view of ${selectedFieldData?.name}`}
          className="w-full h-64 object-cover"
          style={{ transform: `scale(${mapZoom/100})` }}
        />
        <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
          {selectedFieldData?.name} - {satelliteView.toUpperCase()} View
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          <button 
            onClick={() => setMapZoom(Math.min(150, mapZoom + 10))}
            className="bg-white/90 p-1.5 rounded-full shadow-sm"
          >
            <ZoomIn size={16} />
          </button>
          <button 
            onClick={() => setMapZoom(Math.max(50, mapZoom - 10))}
            className="bg-white/90 p-1.5 rounded-full shadow-sm"
          >
            <ZoomIn size={16} className="rotate-180" />
          </button>
        </div>
      </div>
    );
  };

  if (loadingFarmData) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="text-center p-8 bg-white/80 rounded-xl shadow-lg">
          <div className="animate-spin text-4xl mb-4">🌱</div>
          <p className="text-lg text-green-700">Connecting to local AI model...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 overflow-hidden">
      {/* Sidebar */}
      <div className={`bg-white/90 border-r border-gray-200 transition-all duration-300 flex flex-col ${isSidebarOpen ? "w-64" : "w-20"}`}>
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
          {isSidebarOpen && <h1 className="font-black text-lg text-green-800">Krishi Rakhak</h1>}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-600 hover:text-green-700"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        <div className="p-4 border-b border-gray-200">
          {isSidebarOpen && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">Active Farm</p>
              <p className="font-semibold text-gray-800">{farmData?.farmName}</p>
              {userLocation && (
                <p className="text-xs text-gray-500">
                  Location: {userLocation.lat.toFixed(4)}, {userLocation.lon.toFixed(4)}
                </p>
              )}
            </div>
          )}
          <Select 
            value={selectedField} 
            onChange={setSelectedField} 
            options={farmData?.fields || []}
            className="w-full"
          />
        </div>
        
        <nav className="p-4 flex-1 flex flex-col gap-1">
          {[
            {icon: Home, label: "Dashboard", id: "overview"},
            {icon: Map, label: "Field Maps", id: "maps"},
            {icon: TrendingUp, label: "Analytics", id: "analytics"},
            {icon: Cloud, label: "Weather", id: "weather"},
            {icon: Bell, label: "Alerts", id: "alerts"},
            {icon: ClipboardList, label: "Tasks", id: "tasks"},
            {icon: Truck, label: "Equipment", id: "equipment"}
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedTab(item.id)}
              className={`flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${selectedTab === item.id ? 'bg-green-100 text-green-800' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <item.icon size={20}/>
              {isSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <button className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-100 rounded-lg w-full">
            <Settings size={20} />
            {isSidebarOpen && <span className="text-sm">Settings</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h2 className="font-semibold text-gray-800 text-xl">{selectedFieldData?.name}</h2>
            <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
              {selectedFieldData?.cropType}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock size={16} />
              <span>{currentTime.toLocaleTimeString()}</span>
              <span>{currentTime.toLocaleDateString()}</span>
            </div>
            <Button
              href="http://localhost:8501/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <BarChart3 size={16} className="mr-2" />
              AI Analysis
            </Button>
            <Button>
              <Download size={16} className="mr-2" />
              Export Report
            </Button>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto p-6 pt-20">
          {/* Show error message for farm data */}
          {farmDataError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-700">{farmDataError}</p>
            </div>
          )}
          {/* Show loading state for weather data */}
          {loading && (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <div className="animate-spin text-4xl mb-4">🌍</div>
                <p className="text-lg text-green-700">Loading weather data...</p>
              </div>
            </div>
          )}

          {/* Show error message for weather data */}
          {error && !loading && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <p className="text-yellow-700">{error}</p>
            </div>
          )}

          {/* Tab-based content rendering */}
          {selectedTab === "overview" && (
            <div className="space-y-6">
              {/* Real-time Weather Data */}
              {weatherData && <WeatherDataCard weatherData={weatherData} location={userLocation} />}

              {/* Field Image and Analysis */}
              <Card title="Field Analysis" action={
                <select 
                  value={satelliteView} 
                  onChange={e => setSatelliteView(e.target.value)}
                  className="text-sm border rounded-lg px-2 py-1"
                >
                  <option value="ndvi">NDVI</option>
                  <option value="moisture">Moisture</option>
                  <option value="elevation">Elevation</option>
                  <option value="yield">Yield Potential</option>
                </select>
              }>
                {renderFieldImage()}
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{farmData?.stats.healthIndex}/100</div>
                    <div className="text-sm text-gray-600">Health Index</div>
                    <ProgressBar value={farmData?.stats.healthIndex} className="mt-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{farmData?.stats.ndvi}</div>
                    <div className="text-sm text-gray-600">NDVI Score</div>
                    <ProgressBar value={farmData?.stats.ndvi * 100} color="blue" className="mt-2" />
                  </div>
                </div>
              </Card>

              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Droplets className="text-blue-500 mr-2" size={20} />
                    <span className={`text-xl font-bold ${farmData?.stats.soilMoisture < 60 ? "text-red-600" : "text-blue-600"}`}>
                      {farmData?.stats.soilMoisture}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">Soil Moisture</p>
                </Card>

                <Card className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Thermometer className="text-orange-500 mr-2" size={20} />
                    <span className="text-xl font-bold text-orange-600">{farmData?.stats.temperature}°C</span>
                  </div>
                  <p className="text-sm text-gray-700">Temperature</p>
                </Card>

                <Card className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <AlertTriangle className={`mr-2 ${farmData?.stats.pestRisk === "High" ? "text-red-500" : farmData?.stats.pestRisk === "Medium" ? "text-yellow-500" : "text-green-500"}`} size={20} />
                    <span className={`text-xl font-bold ${farmData?.stats.pestRisk === "High" ? "text-red-600" : farmData?.stats.pestRisk === "Medium" ? "text-yellow-600" : "text-green-600"}`}>
                      {farmData?.stats.pestRisk}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">Pest Risk</p>
                </Card>

                <Card className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <CloudRain className="text-gray-500 mr-2" size={20} />
                    <span className="text-xl font-bold text-gray-700">{farmData?.stats.precipitation}mm</span>
                  </div>
                  <p className="text-sm text-gray-700">Precipitation</p>
                </Card>
              </div>

              {/* Weather Forecast */}
              <Card title="5-Day Weather Forecast">
                <div className="grid grid-cols-5 gap-2">
                  {farmData?.weatherForecast.map((day, index) => (
                    <div key={index} className="text-center p-2 rounded-lg bg-gray-50">
                      <p className="font-medium text-sm">{day.day}</p>
                      <div className="my-2">
                        {day.condition === "Sunny" && <Sun className="mx-auto text-yellow-500" size={20} />}
                        {day.condition === "Partly Cloudy" && <Cloud className="mx-auto text-gray-400" size={20} />}
                        {day.condition === "Cloudy" && <Cloud className="mx-auto text-gray-500" size={20} />}
                        {day.condition === "Light Rain" && <CloudRain className="mx-auto text-blue-500" size={20} />}
                      </div>
                      <p className="text-xs text-gray-600">{day.condition}</p>
                      <p className="font-bold">{day.high}°/{day.low}°</p>
                      <p className="text-xs text-blue-600">{day.precipitation}% rain</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Recent Alerts */}
              <Card title="Recent Alerts" action={
                <Button size="sm" variant="secondary">View All</Button>
              }>
                <div className="space-y-3">
                  {farmData?.alerts.slice(0, 3).map(alert => (
                    <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                      alert.priority === "high" ? "border-red-400 bg-red-50" : 
                      alert.priority === "medium" ? "border-yellow-400 bg-yellow-50" : 
                      "border-blue-400 bg-blue-50"
                    }`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{alert.message}</p>
                          <p className="text-sm text-gray-600 mt-1">{alert.time} • {alert.zone}</p>
                        </div>
                        <Button size="sm" className="whitespace-nowrap">Take Action</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
          {/* Weather Tab */}
          {selectedTab === "weather" && (
            <div className="space-y-6">
              {weatherData ? (
                <>
                  <Card title="Live Weather Conditions">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200">
                        <Thermometer className="mx-auto text-orange-500 mb-3" size={32} />
                        <p className="text-3xl font-bold text-orange-600">{weatherData.temperature}°C</p>
                        <p className="text-sm text-gray-600">Current Temperature</p>
                      </div>
                      
                      <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                        <Droplets className="mx-auto text-blue-500 mb-3" size={32} />
                        <p className="text-3xl font-bold text-blue-600">{weatherData.humidity}%</p>
                        <p className="text-sm text-gray-600">Humidity</p>
                      </div>
                      
                      <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                        <CloudRain className="mx-auto text-indigo-500 mb-3" size={32} />
                        <p className="text-3xl font-bold text-indigo-600">{weatherData.precipitation}mm</p>
                        <p className="text-sm text-gray-600">Precipitation</p>
                      </div>
                      
                      <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                        <AlertTriangle className="mx-auto text-gray-500 mb-3" size={32} />
                        <p className="text-3xl font-bold text-gray-700">{weatherData.wind} km/h</p>
                        <p className="text-sm text-gray-600">Wind Speed</p>
                      </div>
                      
                      <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                        <Thermometer className="mx-auto text-amber-500 mb-3" size={32} />
                        <p className="text-3xl font-bold text-amber-600">{weatherData.soilTemp}°C</p>
                        <p className="text-sm text-gray-600">Soil Temperature</p>
                      </div>
                      
                      <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                        <Droplets className="mx-auto text-green-500 mb-3" size={32} />
                        <p className="text-3xl font-bold text-green-600">{weatherData.soilMoisture?.toFixed(3)}</p>
                        <p className="text-sm text-gray-600">Soil Moisture</p>
                      </div>
                    </div>
                  </Card>

                  {weatherData.alerts && weatherData.alerts.length > 0 && (
                    <Card title="Weather Alerts">
                      <div className="space-y-3">
                        {weatherData.alerts.map((alert, index) => (
                          <div key={index} className={`p-4 rounded-lg border-l-4 ${
                            alert.type === "danger" ? "border-red-400 bg-red-50" : 
                            alert.type === "warning" ? "border-yellow-400 bg-yellow-50" : 
                            "border-blue-400 bg-blue-50"
                          }`}>
                            <div className="flex items-center">
                              <span className="text-2xl mr-3">⚠️</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}
                </>
              ) : (
                <div className="text-center text-gray-500">
                  <p>Weather data is not available.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}