document.addEventListener("DOMContentLoaded", function () {
  const bookingModal = new bootstrap.Modal(
    document.getElementById("bookingModal")
  );
  let currentDate = new Date();
  let selectedDate = null;
  let selectedTime = null;
  const morningSlots = ["09:00", "10:00", "11:00"];
  const afternoonSlots = ["14:00", "15:00", "16:00", "17:00", "18:00"];
  const consultaValue = 45000;

  function formatDate(date) {
    return date.toLocaleDateString("es-CL", {
      weekday: "short",
      day: "numeric",
      month: "long",
    });
  }

  function generateWeekDays(date) {
    const weekDaysContainer = document.getElementById("weekDaysContainer");
    weekDaysContainer.innerHTML = "";

    const monday = new Date(date);
    monday.setDate(
      date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1)
    );

    document.getElementById("currentMonth").textContent = `${monday
      .toLocaleDateString("es-CL", { month: "long" })
      .toUpperCase()} ${monday.getFullYear()}`;

    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);

      const dayElement = document.createElement("div");
      dayElement.className = "col px-1";

      const isWeekend = day.getDay() === 0 || day.getDay() === 6;
      const isPast = day < new Date(new Date().setHours(0, 0, 0, 0));
      const isToday = day.toDateString() === new Date().toDateString();

      let cardClasses = "card h-100 rounded-0 border";
      let dayNameClasses = "small day-name";
      let dayNumberClasses = "fw-bold day-number";

      if (isPast || isWeekend) {
        cardClasses += " disabled-day border-light";
        dayNameClasses += " text-muted";
        dayNumberClasses += " text-muted";
      } else if (isToday) {
        cardClasses += " current-day border-success";
        dayNumberClasses += " text-success";
      } else {
        cardClasses += " border-success";
      }

      dayElement.innerHTML = `
        <div class="${cardClasses}">
          <div class="card-body text-center p-1">
            <div class="${dayNameClasses}">${day
        .toLocaleDateString("es-CL", { weekday: "short" })
        .toUpperCase()
        .replace(".", "")}</div>
            <div class="${dayNumberClasses}">${day.getDate()}</div>
          </div>
        </div>`;

      if (!isPast && !isWeekend) {
        dayElement.addEventListener("click", function () {
          document
            .querySelectorAll("#weekDaysContainer .card")
            .forEach((card) => {
              card.classList.remove("selected-day");
              card.querySelector(".day-name").classList.remove("text-white");
              card.querySelector(".day-number").classList.remove("text-white");
            });

          const card = this.querySelector(".card");
          card.classList.add("selected-day");
          card.querySelector(".day-name").classList.add("text-white");
          card.querySelector(".day-number").classList.add("text-white");

          selectedDate = day;
          updateSelectedTimeDisplay();
          document.getElementById("toStep2").disabled = !selectedTime;
        });
      }

      weekDaysContainer.appendChild(dayElement);
    }
  }

  function generateTimeSlots() {
    const morningContainer = document.getElementById("morningSlots");
    const afternoonContainer = document.getElementById("afternoonSlots");

    morningContainer.innerHTML = "";
    afternoonContainer.innerHTML = "";

    morningSlots.forEach((time) => {
      const slot = createSlotButton(time, "AM");
      morningContainer.appendChild(slot);
    });

    afternoonSlots.forEach((time) => {
      const slot = createSlotButton(time, "PM");
      afternoonContainer.appendChild(slot);
    });
  }

  function createSlotButton(time, period) {
    const slot = document.createElement("button");
    slot.type = "button";
    slot.className = "btn btn-outline-success btn-sm rounded-0 time-slot";
    slot.textContent = `${time} ${period}`;
    slot.dataset.time = `${time}:00`;

    slot.addEventListener("click", () => selectTimeSlot(slot));
    return slot;
  }

  function selectTimeSlot(slot) {
    document.querySelectorAll(".time-slot").forEach((s) => {
      s.classList.remove("selected", "btn-success", "text-white");
      s.classList.add("btn-outline-success");
    });

    slot.classList.add("selected", "btn-success", "text-white");
    slot.classList.remove("btn-outline-success");

    selectedTime = slot.dataset.time;
    updateSelectedTimeDisplay();
    document.getElementById("toStep2").disabled = !selectedDate;
  }

  function updateSelectedTimeDisplay() {
    if (selectedDate && selectedTime) {
      const [hours, minutes] = selectedTime.split(":");
      const dateTime = new Date(selectedDate);
      dateTime.setHours(hours, minutes);

      document.getElementById("selectedDateTime").textContent = `${formatDate(
        dateTime
      )} a las ${dateTime.toLocaleTimeString("es-CL", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;

      document.getElementById("selectedTimeDisplay").classList.remove("d-none");
    }
  }

  document.getElementById("prevWeek").addEventListener("click", () => {
    currentDate.setDate(currentDate.getDate() - 7);
    generateWeekDays(currentDate);
    resetTimeSelection();
  });

  document.getElementById("nextWeek").addEventListener("click", () => {
    currentDate.setDate(currentDate.getDate() + 7);
    generateWeekDays(currentDate);
    resetTimeSelection();
  });

  function resetTimeSelection() {
    selectedTime = null;
    document.querySelectorAll(".time-slot").forEach((s) => {
      s.classList.remove("btn-success", "text-white");
      s.classList.add("btn-outline-success");
    });
    document.getElementById("selectedTimeDisplay").classList.add("d-none");
    document.getElementById("toStep2").disabled = true;
  }

  document.getElementById("toStep2").addEventListener("click", () => {
    document.getElementById("step1").classList.add("d-none");
    document.getElementById("step2").classList.remove("d-none");
  });

  document.getElementById("backToStep1").addEventListener("click", () => {
    document.getElementById("step2").classList.add("d-none");
    document.getElementById("step1").classList.remove("d-none");
  });

  document
    .getElementById("patientDataForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      const nombre = document.getElementById("nombre").value;
      const email = document.getElementById("email").value;
      const tipo = document.querySelector(
        'input[name="tipoConsulta"]:checked'
      ).value;
      const prevision = document.getElementById("prevision").value;

      const [hours, minutes] = selectedTime.split(":");
      const dateTime = new Date(selectedDate);
      dateTime.setHours(hours, minutes);

      try {
        const checkResponse = await fetch(
          "http://localhost:5000/api/consultas/check",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ fecha: dateTime }),
          }
        );

        const checkResult = await checkResponse.json();

        if (!checkResult.disponible) {
          alert("El horario ya está reservado. Por favor selecciona otro.");
          return;
        }

        const nuevaConsulta = {
          nombre,
          email,
          fecha: dateTime,
          tipo,
          previsión: prevision,
          valor: consultaValue,
          pagado: false,
        };

        const response = await fetch("http://localhost:5000/api/consultas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(nuevaConsulta),
        });

        const result = await response.json();

        if (result.success) {
          document.getElementById(
            "confirmationDetails"
          ).textContent = `Tu consulta ha sido agendada para el ${formatDate(
            dateTime
          )} a las ${dateTime.toLocaleTimeString("es-CL", {
            hour: "2-digit",
            minute: "2-digit",
          })}.`;
          document.getElementById("step2").classList.add("d-none");
          document.getElementById("step3").classList.remove("d-none");
        } else {
          alert("Error al agendar la consulta: " + result.error);
        }
      } catch (error) {
        console.error("Error al enviar consulta:", error);
        alert("Hubo un problema al conectar con el servidor.");
      }
    });

  generateWeekDays(currentDate);
  generateTimeSlots();
});
