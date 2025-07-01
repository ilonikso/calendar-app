import React, { useState } from "react";

const Calendar = () => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [lessonPrice, setLessonPrice] = useState("");

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const urk_months = [
    "Січень",
    "Лютий",
    "Березень",
    "Квітень",
    "Травень",
    "Червень",
    "Липень",
    "Серпень",
    "Вересень",
    "Жовтень",
    "Листопад",
    "Грудень",
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth =
    (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7;

  const handleDateClick = (day) => {
    const dateString = `${String(day).padStart(2, "0")}-${String(
      currentMonth + 1
    ).padStart(2, "0")}-${currentYear}`;

    setSelectedDates((prev) => {
      if (prev.includes(dateString)) {
        return prev.filter((date) => date !== dateString);
      } else {
        return [...prev, dateString].sort((a, b) => {
          // Sort by converting dd-mm-yyyy back to comparable format
          const [dayA, monthA, yearA] = a.split("-").map(Number);
          const [dayB, monthB, yearB] = b.split("-").map(Number);
          const dateA = new Date(yearA, monthA - 1, dayA);
          const dateB = new Date(yearB, monthB - 1, dayB);
          return dateA - dateB;
        });
      }
    });
  };

  const isDateSelected = (day) => {
    const dateString = `${String(day).padStart(2, "0")}-${String(
      currentMonth + 1
    ).padStart(2, "0")}-${currentYear}`;
    return selectedDates.includes(dateString);
  };

  const navigateMonth = (direction) => {
    if (direction === "prev") {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const clearSelection = () => {
    setSelectedDates([]);
  };

  const generateResultString = (withTranslation = false) => {
    if (selectedDates.length === 0) return "";

    const selectedMonth = months[Number(selectedDates[0].split("-")[1] - 1)];
    const selectedMonthTranslated =
      urk_months[Number(selectedDates[0].split("-")[1] - 1)];

    // Convert dd-mm-yyyy to dd-mm format
    const shortDates = selectedDates.map((date) => {
      const [day, month] = date.split("-");
      return `${day}.${month}`;
    });

    const lessonsCount = selectedDates.length;
    const price = parseFloat(lessonPrice) || 0;
    const totalPayment = lessonsCount * price;

    if (withTranslation) {
      return `Заплановані уроки на ${selectedMonthTranslated}: Уроків: ${lessonsCount}, Дати: ${shortDates.join(
        ", "
      )}. ${totalPayment ? `Оплата ${totalPayment}грн` : ""}`;
    }

    return `Planned lessons in ${selectedMonth}: Lessons: ${lessonsCount}, Dates: ${shortDates.join(
      ", "
    )}. ${totalPayment ? `The payment is ${totalPayment}UAH` : ""}`;
  };

  const copyToClipboard = async (withTranslation = false) => {
    const resultString = generateResultString(withTranslation);
    if (resultString) {
      try {
        await navigator.clipboard.writeText(resultString);
        alert("Copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy: ", err);
      }
    }
  };

  const generateCSVString = () => {
    if (selectedDates.length === 0) return "";

    const selectedMonth =
      urk_months[Number(selectedDates[0].split("-")[1] - 1)];

    // Convert dd-mm-yyyy to dd-mm format for CSV
    const shortDates = selectedDates.map((date) => {
      const [day, month] = date.split("-");
      return `${day}-${month}`;
    });

    // Create CSV format with header and each date on a new row
    const csvContent = `${selectedMonth}\n` + shortDates.join("\n");
    return csvContent;
  };

  const copyCSVToClipboard = async () => {
    const csvString = generateCSVString();
    if (csvString) {
      try {
        await navigator.clipboard.writeText(csvString);
        alert("CSV data copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy CSV: ", err);
      }
    }
  };

  const selectAllDaysOfWeek = (dayOfWeekIndex) => {
    const datesOfWeek = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(currentYear, currentMonth, day);
      const currentDayOfWeek = (currentDate.getDay() + 6) % 7; // Convert to Monday-first

      if (currentDayOfWeek === dayOfWeekIndex) {
        const dateString = `${String(day).padStart(2, "0")}-${String(
          currentMonth + 1
        ).padStart(2, "0")}-${currentYear}`;
        datesOfWeek.push(dateString);
      }
    }

    setSelectedDates((prev) => {
      const newDates = [...prev];

      datesOfWeek.forEach((date) => {
        if (!newDates.includes(date)) {
          newDates.push(date);
        }
      });

      return newDates.sort((a, b) => {
        const [dayA, monthA, yearA] = a.split("-").map(Number);
        const [dayB, monthB, yearB] = b.split("-").map(Number);
        const dateA = new Date(yearA, monthA - 1, dayA);
        const dateB = new Date(yearB, monthB - 1, dayB);
        return dateA - dateB;
      });
    });
  };

  // Create calendar grid
  const calendarDays = [];

  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="p-2"></div>);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(
      <button
        key={day}
        onClick={() => handleDateClick(day)}
        className={`p-2 m-1 w-8 h-8 rounded-full text-sm font-medium transition-colors duration-200 hover:bg-blue-100 ${
          isDateSelected(day)
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-gray-100 text-gray-700 hover:bg-blue-100"
        }`}
      >
        <span className="-mt-0.5 block">{day}</span>
      </button>
    );
  }

  return (
    <div className="max-w-[800px] gap-10 mx-auto p-6 bg-white rounded-lg shadow-lg flex flex-col md:flex-row">
      <div className="mb-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateMonth("prev")}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            ←
          </button>
          <h2 className="text-xl font-semibold text-gray-800">
            {months[currentMonth]} {currentYear}
          </h2>
          <button
            onClick={() => navigateMonth("next")}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            →
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
            (day, index) => (
              <button
                key={day}
                onClick={() => selectAllDaysOfWeek(index)}
                className="p-2 text-center text-sm font-medium text-gray-500 hover:bg-blue-100 hover:text-blue-700 rounded transition-colors cursor-pointer"
                title={`Select all ${day}s in current month`}
              >
                {day}
              </button>
            )
          )}
        </div>

        <div className="grid grid-cols-7 gap-1">{calendarDays}</div>

        <hr className="my-4" />

        <div className="mb-4 mt-4">
          <label
            htmlFor="lessonPrice"
            className="block text-sm text-left font-medium text-gray-700 mb-2"
          >
            Lesson Price (UAH):
          </label>
          <input
            id="lessonPrice"
            type="number"
            value={lessonPrice}
            onChange={(e) => setLessonPrice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter lesson price..."
            min="0"
            step="0.01"
          />
        </div>

        <hr className="my-4" />

        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium text-gray-800">
            Selected Dates ({selectedDates.length})
          </h3>
          {selectedDates.length > 0 && (
            <button
              onClick={clearSelection}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="bg-gray-50 p-3 rounded-md min-h-24 overflow-y-auto mb-4">
          {selectedDates.length === 0 ? (
            <p className="text-gray-500 text-sm">No dates selected</p>
          ) : (
            <div className="space-y-1">
              <p className="text-sm text-left font-mono text-gray-700">
                {selectedDates.map((date) => (
                  <div>{`${date}`}</div>
                ))}
              </p>
            </div>
          )}
        </div>
      </div>

      {selectedDates.length > 0 && (
        <div className="mt-6">
          <div className="space-y-3">
            <div className="bg-green-50 p-3 rounded-md border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-green-800">
                  Generated Message:
                </h4>
                <button
                  onClick={copyToClipboard}
                  className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                  Copy
                </button>
              </div>
              <p className="text-left text-sm text-green-900 font-medium">
                {generateResultString()}
              </p>
            </div>

            <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-blue-800">
                  Згенероване повідомлення:
                </h4>
                <button
                  onClick={() => copyToClipboard(true)}
                  className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Копіювати
                </button>
              </div>
              <p className="text-left text-sm text-blue-900 font-medium">
                {generateResultString(true)}
              </p>
            </div>

            <div className="bg-orange-50 p-3 rounded-md border border-orange-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-orange-800">
                  CSV Format:
                </h4>
                <button
                  onClick={copyCSVToClipboard}
                  className="px-2 py-1 text-xs bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                >
                  Copy CSV
                </button>
              </div>
              <pre className="text-left text-xs text-orange-900 font-mono whitespace-pre-wrap">
                {generateCSVString()}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
