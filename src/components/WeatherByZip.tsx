
import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import type { WeatherResponse } from "../types/weather";

interface ZipSearch {
    zip: string;
    country: string;
}

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

function WeatherByZip() {
    const [zip, setZip] = useState<string>("");
    const [country, setCountry] = useState<string>("DK");
    const [search, setSearch] = useState<ZipSearch | null>(null);
    const [weather, setWeather] = useState<WeatherResponse | null>(null);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!search) return;

        const { zip: selectedZip, country: selectedCountry } = search;

        async function getWeather() {
            try {
                setLoading(true);
                setError("");
                setWeather(null);

                const url = `https://api.openweathermap.org/data/2.5/weather?zip=${encodeURIComponent(selectedZip)},${encodeURIComponent(selectedCountry)}&appid=${API_KEY}&units=metric`;

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
                    setError("Ukendt fejl");
                }
            } finally {
                setLoading(false);
            }
        }

        getWeather();
    }, [search]);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!zip.trim() || !country.trim()) return;

        setSearch({
            zip: zip.trim(),
            country: country.trim().toUpperCase()
        });
    }

    return (
        <div>
            <h2>Find vejret via postnummer</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Postnummer"
                    value={zip}
                    onChange={(event) => setZip(event.target.value)}
                />

                <input
                    type="text"
                    placeholder="Landekode"
                    value={country}
                    onChange={(event) => setCountry(event.target.value)}
                />

                <button type="submit">Søg</button>
            </form>

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

export default WeatherByZip;
