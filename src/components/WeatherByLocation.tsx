
import { useState, useEffect } from "react";
import type { WeatherResponse } from "../types/weather";

// Type til koordinaterne
interface Coordinates {
    lat: number;
    lon: number;
}

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

function WeatherByLocation() {
    const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
    const [weather, setWeather] = useState<WeatherResponse | null>(null);
    const [error, setError] = useState<string>("");

    // Hent brugerens placering
    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Geolocation understøttes ikke");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCoordinates({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                });
            },
            () => {
                setError("Kunne ikke hente din placering");
            }
        );
    }, []);

    // Hent vejret ud fra koordinater
    useEffect(() => {
        if (!coordinates) return;

        const { lat, lon } = coordinates;

        async function getWeather() {
            try {
                setError("");

                const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error("Kunne ikke hente vejrdata");
                }

                const data = (await response.json()) as WeatherResponse;
                setWeather(data);

            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError("Ukendt fejl");
                }
            }
        }

        getWeather();
    }, [coordinates]);

    return (
        <div>
            <h2>Weather by Location</h2>

            {error && <p>{error}</p>}

            {weather && (
                <div>
                    <h3>{weather.name}</h3>
                    <p>Temperatur: {weather.main.temp} °C</p>
                    <p>Luftfugtighed: {weather.main.humidity}%</p>
                    <p>Vind: {weather.wind.speed} m/s</p>
                </div>
            )}
        </div>
    );
}

export default WeatherByLocation;
