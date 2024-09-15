import React, { useState } from "react";
import "./App.css";

function App() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [calendarDays, setCalendarDays] = useState("");
  const [businessDays, setBusinessDays] = useState("");
  const [workingDays, setWorkingDays] = useState("");
  const [holidaysInRange, setHolidaysInRange] = useState([]);

  const calculateDelays = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      alert("La date de fin doit être après la date de départ.");
      return;
    }

    setCalendarDays(calculateCalendarDays(start, end));
    setBusinessDays(calculateBusinessDays(start, end));
    setWorkingDays(calculateWorkingDays(start, end));
    setHolidaysInRange(getHolidaysInRange(start, end));
  };

  const calculateCalendarDays = (start, end) => {
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const calculateBusinessDays = (start, end) => {
    let count = 0;
    let currentDate = new Date(start);
    const holidays = getFrenchHolidays(
      currentDate.getFullYear(),
      end.getFullYear()
    ).map((holiday) => holiday.date);

    while (currentDate <= end) {
      const dayOfWeek = currentDate.getDay();
      const formattedDate = currentDate.toISOString().split("T")[0];

      if (dayOfWeek !== 0 && !holidays.includes(formattedDate)) {
        count++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return count;
  };

  const calculateWorkingDays = (start, end) => {
    let count = 0;
    let currentDate = new Date(start);
    const holidays = getFrenchHolidays(
      currentDate.getFullYear(),
      end.getFullYear()
    ).map((holiday) => holiday.date);

    while (currentDate <= end) {
      const dayOfWeek = currentDate.getDay();
      const formattedDate = currentDate.toISOString().split("T")[0];

      if (
        dayOfWeek >= 1 &&
        dayOfWeek <= 5 &&
        !holidays.includes(formattedDate)
      ) {
        count++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return count;
  };

  const getHolidaysInRange = (start, end) => {
    const holidays = getFrenchHolidays(start.getFullYear(), end.getFullYear());
    return holidays.filter((holiday) => {
      const holidayDate = new Date(holiday.date);
      return holidayDate >= start && holidayDate <= end;
    });
  };

  const getFrenchHolidays = (startYear, endYear) => {
    const holidays = [];
    const holidayList = [
      { date: "01-01", name: "Jour de l'an" },
      { date: "05-01", name: "Fête du travail" },
      { date: "05-08", name: "Victoire 1945" },
      { date: "07-14", name: "Fête Nationale" },
      { date: "08-15", name: "Assomption" },
      { date: "11-01", name: "Toussaint" },
      { date: "11-11", name: "Armistice 1918" },
      { date: "12-25", name: "Noël" },
    ];

    for (let year = startYear; year <= endYear; year++) {
      holidayList.forEach((holiday) => {
        holidays.push({
          date: `${year}-${holiday.date}`,
          name: holiday.name,
        });
      });
      holidays.push({
        date: getEasterDate(year),
        name: "Dimanche de Pâques",
      });
      holidays.push({
        date: getEasterMonday(year),
        name: "Lundi de Pâques",
      });
      holidays.push({
        date: getAscensionDay(year),
        name: "Jeudi de l'Ascension",
      });
      holidays.push({
        date: getWhitMonday(year),
        name: "Lundi de Pentecôte",
      });
    }
    return holidays;
  };

  const getEasterDate = (year) => {
    const f = Math.floor;
    const G = year % 19;
    const C = f(year / 100);
    const H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30;
    const I =
      H - f(H / 28) * (1 - f(H / 28) * f(29 / (H + 1)) * f((21 - G) / 11));
    const J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7;
    const L = I - J;
    const month = 3 + f((L + 40) / 44);
    const day = L + 28 - 31 * f(month / 4);

    let date = new Date(Date.UTC(year, month - 1, day));
    return date.toISOString().split("T")[0];

    // Ajout des console.log pour chaque variable
    console.log(`Year: ${year}`);
    console.log(`G: ${G}`);
    console.log(`C: ${C}`);
    console.log(`H: ${H}`);
    console.log(`I: ${I}`);
    console.log(`J: ${J}`);
    console.log(`L: ${L}`);
    console.log(`Month: ${month}`);
    console.log(`Day: ${day}`);
  };

  const getEasterMonday = (year) => {
    const easterDate = new Date(getEasterDate(year));
    easterDate.setDate(easterDate.getDate() + 1);
    return easterDate.toISOString().split("T")[0];
  };

  const getAscensionDay = (year) => {
    const easterDate = new Date(getEasterDate(year));
    easterDate.setDate(easterDate.getDate() + 39);
    return easterDate.toISOString().split("T")[0];
  };

  const getWhitMonday = (year) => {
    const easterDate = new Date(getEasterDate(year));
    easterDate.setDate(easterDate.getDate() + 50);
    return easterDate.toISOString().split("T")[0];
  };

  return (
    <div className="App">
      <h1>Calcul de délais</h1>
      <form>
        <div>
          <label htmlFor="startDate">Date de départ:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="endDate">Date de fin:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <button type="button" onClick={calculateDelays}>
          Calculer
        </button>
      </form>
      <div className="results">
        <p>Jours calendaires: {calendarDays}</p>
        <p>Jours ouvrables: {businessDays}</p>
        <p>Jours ouvrés: {workingDays}</p>
        <p>Jours fériés dans l'intervalle:</p>
        <ul>
          {holidaysInRange.map((holiday, index) => (
            <li key={index}>
              {holiday.date} - {holiday.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
