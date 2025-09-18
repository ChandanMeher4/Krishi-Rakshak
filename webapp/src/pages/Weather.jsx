import React, { useEffect, useState } from "react";
import axios from "axios";

const WeatherSoilDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState({ lat: null, lon: null });

  // Fetch weather + soil data
  const fetchWeatherAndSoil = async (lat, lon) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,soil_temperature_0_to_7cm,soil_moisture_0_to_7cm&daily=precipitation_sum,temperature_2m_max,temperature_2m_min&timezone=auto`
      );

      const responseData = res.data;
      const hourly = responseData.hourly;
      const daily = responseData.daily;
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

      setData(latestData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load weather data.");
    } finally {
      setLoading(false);
    }
  };

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setLocation({ lat, lon });
          fetchWeatherAndSoil(lat, lon);
        },
        (err) => {
          console.error("Geolocation error:", err);
          setError("Unable to get your location. Please allow location access.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation not supported by your browser.");
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-center">
        <div>
          <div className="animate-spin text-6xl mb-4">🌍</div>
          <p className="text-xl text-green-700 font-semibold">
            Detecting location & loading agricultural data...
          </p>
          <div className="mt-4 flex justify-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-center">
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-red-700 mb-2">Access Required</h3>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-center">
        <div>
          <div className="text-5xl mb-4">📡</div>
          <p className="text-xl text-gray-600">No agricultural data available.</p>
        </div>
      </div>
    );
  }

  // -------- ALERTS --------
  const alerts = [];
  if (data.soilMoisture !== null && data.soilMoisture < 0.15) {
    alerts.push({
      icon: "💧",
      type: "warning",
      message: "Soil moisture is critically low — irrigation recommended immediately"
    });
  }
  if (data.dailySummary.rain > 10) {
    alerts.push({
      icon: "🌧️",
      type: "info",
      message: "Heavy rainfall expected — postpone irrigation and secure equipment"
    });
  }
  if (data.wind > 30) {
    alerts.push({
      icon: "💨",
      type: "danger",
      message: "High wind conditions detected — secure crops and farming equipment"
    });
  }
  if (data.temperature > 35) {
    alerts.push({
      icon: "🔥",
      type: "warning",
      message: "Extreme temperature detected — crops may experience heat stress"
    });
  }

  // -------- INTELLIGENT FARMING SUGGESTIONS --------
  const generateFarmingSuggestions = () => {
    const suggestions = [];

    // Irrigation Recommendations
    if (data.soilMoisture !== null) {
      if (data.soilMoisture < 0.15) {
        suggestions.push({
          category: "Irrigation",
          icon: "💧",
          priority: "high",
          title: "Immediate Irrigation Required",
          action: "Apply 25-30mm of water immediately. Check soil moisture after 24 hours.",
          reason: `Current soil moisture (${data.soilMoisture.toFixed(3)}) is below optimal range.`,
          timing: "Today"
        });
      } else if (data.soilMoisture < 0.25) {
        suggestions.push({
          category: "Irrigation",
          icon: "💧",
          priority: "medium",
          title: "Monitor and Prepare for Irrigation",
          action: "Prepare irrigation system. Water within 2-3 days if no rainfall.",
          reason: `Soil moisture (${data.soilMoisture.toFixed(3)}) is approaching low threshold.`,
          timing: "Within 2-3 days"
        });
      } else if (data.soilMoisture > 0.4) {
        suggestions.push({
          category: "Irrigation",
          icon: "⏸️",
          priority: "low",
          title: "Avoid Over-watering",
          action: "Skip irrigation. Ensure proper drainage to prevent waterlogging.",
          reason: `Soil moisture (${data.soilMoisture.toFixed(3)}) is adequate.`,
          timing: "Current"
        });
      }
    }

    // Weather-based Recommendations
    if (data.dailySummary.rain > 15) {
      suggestions.push({
        category: "Weather Management",
        icon: "☔",
        priority: "high",
        title: "Heavy Rain Preparation",
        action: "Ensure drainage channels are clear. Harvest ready crops if possible. Apply fungicides preventively.",
        reason: `${data.dailySummary.rain}mm rainfall expected today.`,
        timing: "Before rainfall"
      });
    } else if (data.dailySummary.rain > 5 && data.dailySummary.rain <= 15) {
      suggestions.push({
        category: "Weather Management",
        icon: "🌦️",
        priority: "medium",
        title: "Moderate Rain Expected",
        action: "Postpone fertilizer application. Good time for transplanting if planned.",
        reason: `${data.dailySummary.rain}mm rainfall will provide natural irrigation.`,
        timing: "Today"
      });
    }

    // Temperature Management
    if (data.temperature > 35) {
      suggestions.push({
        category: "Heat Management",
        icon: "🌡️",
        priority: "high",
        title: "Heat Stress Protection",
        action: "Increase irrigation frequency. Provide shade nets if available. Apply mulch to retain soil moisture.",
        reason: `High temperature (${data.temperature}°C) can cause crop stress.`,
        timing: "Immediate"
      });
    } else if (data.temperature < 5) {
      suggestions.push({
        category: "Cold Protection",
        icon: "❄️",
        priority: "high",
        title: "Frost Protection Needed",
        action: "Cover sensitive crops. Use frost protection methods like smoking or sprinklers.",
        reason: `Low temperature (${data.temperature}°C) risk for frost damage.`,
        timing: "Tonight"
      });
    }

    // Wind Management
    if (data.wind > 25) {
      suggestions.push({
        category: "Wind Protection",
        icon: "💨",
        priority: "high",
        title: "Secure Farm Infrastructure",
        action: "Secure greenhouses, nets, and equipment. Avoid pesticide spraying. Check plant supports.",
        reason: `High wind speed (${data.wind} km/h) can damage crops and equipment.`,
        timing: "Immediate"
      });
    }

    // Soil Temperature Recommendations
    if (data.soilTemp !== null) {
      if (data.soilTemp < 10) {
        suggestions.push({
          category: "Soil Management",
          icon: "🌱",
          priority: "medium",
          title: "Soil Warming Recommended",
          action: "Use mulch or row covers to warm soil. Delay planting of warm-season crops.",
          reason: `Soil temperature (${data.soilTemp}°C) is too low for optimal plant growth.`,
          timing: "Before planting"
        });
      } else if (data.soilTemp > 30) {
        suggestions.push({
          category: "Soil Management",
          icon: "🌡️",
          priority: "medium",
          title: "Soil Cooling Needed",
          action: "Apply organic mulch to cool soil. Increase irrigation frequency.",
          reason: `High soil temperature (${data.soilTemp}°C) may stress plant roots.`,
          timing: "Today"
        });
      }
    }

    // Humidity-based Recommendations
    if (data.humidity > 80) {
      suggestions.push({
        category: "Disease Prevention",
        icon: "🦠",
        priority: "medium",
        title: "High Humidity Disease Risk",
        action: "Monitor for fungal diseases. Ensure good air circulation. Consider preventive fungicide spray.",
        reason: `High humidity (${data.humidity}%) creates favorable conditions for plant diseases.`,
        timing: "Monitor daily"
      });
    } else if (data.humidity < 30) {
      suggestions.push({
        category: "Moisture Management",
        icon: "💨",
        priority: "medium",
        title: "Low Humidity Stress",
        action: "Increase irrigation frequency. Consider misting systems for sensitive crops.",
        reason: `Low humidity (${data.humidity}%) can cause plant water stress.`,
        timing: "Ongoing"
      });
    }

    // General Recommendations based on conditions
    if (data.temperature >= 20 && data.temperature <= 30 && data.humidity >= 40 && data.humidity <= 70) {
      suggestions.push({
        category: "Optimal Conditions",
        icon: "✅",
        priority: "low",
        title: "Ideal Growing Conditions",
        action: "Perfect time for most farming activities. Consider planting, transplanting, or fertilizing.",
        reason: "Weather conditions are optimal for crop growth and farm operations.",
        timing: "Today"
      });
    }

    return suggestions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };

  const farmingSuggestions = generateFarmingSuggestions();

  const getAlertStyle = (type) => {
    switch (type) {
      case 'danger':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 pt-24">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="text-6xl mr-4">🛡️</div>
          <div>
            <h1 className="text-4xl font-bold text-green-800">Krishi Rakshak</h1>
            <p className="text-xl text-green-600">Agricultural Monitoring Dashboard</p>
          </div>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Real-time weather and soil monitoring system designed to protect your crops and optimize farming decisions
        </p>
      </div>

      {/* ALERTS SECTION */}
      {alerts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-3">🚨</span>
            Critical Farm Alerts
          </h2>
          <div className="grid gap-4">
            {alerts.map((alert, idx) => (
              <div key={idx} className={`border-2 rounded-2xl p-4 shadow-lg ${getAlertStyle(alert.type)}`}>
                <div className="flex items-center">
                  <span className="text-3xl mr-4">{alert.icon}</span>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Farm Alert</h3>
                    <p className="text-sm opacity-90">{alert.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CURRENT CONDITIONS */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-3">🌾</span>
          Current Field Conditions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DataCard 
            icon="🌡️" 
            label="Air Temperature" 
            value={`${data.temperature}°C`}
            subtitle="Current field temperature"
            color="bg-gradient-to-br from-orange-400 to-red-500"
          />
          <DataCard 
            icon="💧" 
            label="Humidity" 
            value={`${data.humidity}%`}
            subtitle="Relative air moisture"
            color="bg-gradient-to-br from-blue-400 to-cyan-500"
          />
          <DataCard 
            icon="🌧️" 
            label="Precipitation" 
            value={`${data.precipitation} mm`}
            subtitle="Last hour rainfall"
            color="bg-gradient-to-br from-indigo-400 to-blue-500"
          />
          <DataCard 
            icon="🌬️" 
            label="Wind Speed" 
            value={`${data.wind} km/h`}
            subtitle="Current wind conditions"
            color="bg-gradient-to-br from-gray-400 to-gray-600"
          />
          <DataCard
            icon="🌱"
            label="Soil Temperature"
            value={data.soilTemp !== null ? `${data.soilTemp}°C` : "N/A"}
            subtitle="0-7cm depth"
            color="bg-gradient-to-br from-amber-400 to-orange-500"
          />
          <DataCard
            icon="🪱"
            label="Soil Moisture"
            value={data.soilMoisture !== null ? data.soilMoisture.toFixed(3) : "N/A"}
            subtitle="0-7cm depth level"
            color="bg-gradient-to-br from-green-400 to-emerald-500"
          />
        </div>
      </div>

      {/* INTELLIGENT FARMING SUGGESTIONS */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-3">🧠</span>
          AI-Powered Farming Recommendations
        </h2>
        {farmingSuggestions.length > 0 ? (
          <div className="grid gap-4">
            {farmingSuggestions.map((suggestion, idx) => (
              <SuggestionCard key={idx} suggestion={suggestion} />
            ))}
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">All Systems Normal</h3>
            <p className="text-green-700">Current conditions are within optimal ranges. Continue with regular farming activities.</p>
          </div>
        )}
      </div>

      {/* DAILY FORECAST */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-3">📅</span>
          Today's Agricultural Forecast
        </h2>
        <div className="bg-white/80 backdrop-blur-sm border border-green-200 shadow-xl rounded-3xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-200">
              <div className="text-4xl mb-2">🌡️</div>
              <h3 className="font-semibold text-gray-800 mb-1">Maximum Temperature</h3>
              <p className="text-3xl font-bold text-red-600">{data.dailySummary.maxTemp}°C</p>
              <p className="text-sm text-gray-600 mt-2">Peak field temperature today</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200">
              <div className="text-4xl mb-2">❄️</div>
              <h3 className="font-semibold text-gray-800 mb-1">Minimum Temperature</h3>
              <p className="text-3xl font-bold text-blue-600">{data.dailySummary.minTemp}°C</p>
              <p className="text-sm text-gray-600 mt-2">Lowest field temperature today</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-indigo-200">
              <div className="text-4xl mb-2">🌧️</div>
              <h3 className="font-semibold text-gray-800 mb-1">Expected Rainfall</h3>
              <p className="text-3xl font-bold text-indigo-600">{data.dailySummary.rain} mm</p>
              <p className="text-sm text-gray-600 mt-2">Total precipitation forecast</p>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER INFO */}
      <div className="bg-white/60 backdrop-blur-sm border border-green-200 rounded-2xl p-6 text-center">
        <div className="flex items-center justify-center mb-4">
          <span className="text-2xl mr-2">📍</span>
          <div>
            <p className="font-semibold text-gray-800">Farm Location</p>
            <p className="text-sm text-gray-600">
              Coordinates: {location.lat?.toFixed(4)}, {location.lon?.toFixed(4)}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center text-sm text-gray-500">
          <span className="mr-2">🕒</span>
          Last updated: {new Date(data.time).toLocaleString()}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">Powered by Krishi Rakshak Agricultural Intelligence</p>
          <div className="flex justify-center space-x-4 text-lg">
            <span title="Weather Monitoring">🌦️</span>
            <span title="Soil Analysis">🧪</span>
            <span title="Crop Protection">🛡️</span>
            <span title="Smart Farming">🤖</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Professional reusable card component
const DataCard = ({ icon, label, value, subtitle, color }) => (
  <div className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
    <div className={`${color} p-4 text-white text-center`}>
      <div className="text-4xl mb-2">{icon}</div>
    </div>
    <div className="p-6">
      <h3 className="font-semibold text-gray-800 mb-1">{label}</h3>
      <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
      <p className="text-sm text-gray-600">{subtitle}</p>
    </div>
  </div>
);

// Suggestion Card Component
const SuggestionCard = ({ suggestion }) => {
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'medium':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'low':
        return 'bg-green-50 border-green-200 text-green-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500 text-white';
      case 'medium':
        return 'bg-amber-500 text-white';
      case 'low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className={`border-2 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 ${getPriorityStyle(suggestion.priority)}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <span className="text-4xl mr-4">{suggestion.icon}</span>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-bold text-xl">{suggestion.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getPriorityBadge(suggestion.priority)}`}>
                {suggestion.priority}
              </span>
            </div>
            <p className="text-sm opacity-75 mb-2">
              <span className="font-semibold">Category:</span> {suggestion.category}
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="bg-white/60 rounded-lg p-3">
          <h4 className="font-semibold text-sm mb-1">🎯 Recommended Action:</h4>
          <p className="text-sm">{suggestion.action}</p>
        </div>
        
        <div className="bg-white/60 rounded-lg p-3">
          <h4 className="font-semibold text-sm mb-1">📊 Based on Data:</h4>
          <p className="text-sm">{suggestion.reason}</p>
        </div>
        
        <div className="flex items-center justify-between bg-white/60 rounded-lg p-3">
          <div>
            <h4 className="font-semibold text-sm mb-1">⏰ Timing:</h4>
            <p className="text-sm">{suggestion.timing}</p>
          </div>
          <div className="text-right">
            <button className="px-4 py-2 bg-white/80 hover:bg-white border border-gray-300 rounded-lg text-sm font-medium transition-colors duration-200">
              Mark as Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherSoilDashboard;