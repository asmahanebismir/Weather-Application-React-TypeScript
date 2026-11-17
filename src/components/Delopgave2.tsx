import WeatherByZip from "./WeatherByZip";
import WeatherByLocation from "./WeatherByLocation";

function Delopgave2() {
    return (
        <div>
            <h1>Delopgave 2 - Vejr efter postnummer</h1>

            <WeatherByZip />

            <hr />

            <h2>Ekstraopgave - Geolocation</h2>
            <WeatherByLocation />
        </div>
    );
}

export default Delopgave2;
