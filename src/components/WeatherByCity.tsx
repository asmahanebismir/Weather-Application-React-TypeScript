import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import type { WeatherResponse } from "../types/weather";

function WeatherByCity() {
    const [city, setCity] = useState<string>("");
    const [searchCity, setSearchCity] = useState<string>("");
    const [weather, setWeather] = useState<WeatherResponse | null>(null);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

    function handleCityChange(event: ChangeEvent<HTMLInputElement>) {
        setCity(event.target.value);
    }

    useEffect(() => {
        if (!searchCity) return;

        async function getWeather() {
            try {
                setLoading(true);
                setError("");
                setWeather(null);

                const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(searchCity)}&appid=${API_KEY}&units=metric`;

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error("Kunne ikke hente vejret");
                }

                const data = (await response.json()) as WeatherResponse;
                setWeather(data);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError("Der opstod en ukendt fejl");
                }
            } finally {
                setLoading(false);
            }
        }

        getWeather();
    }, [searchCity]);

    return (
        <div>
            <h2>Find vejret i din by</h2>

            <input
                type="text"
                placeholder="Indtast by"
                value={city}
                onChange={handleCityChange}
            />

            <button onClick={() => setSearchCity(city.trim())}>
                Søg
            </button>

            {loading && <p>Henter vejrdata...</p>}

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

export default WeatherByCity;
