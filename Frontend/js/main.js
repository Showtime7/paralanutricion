document.addEventListener("DOMContentLoaded", function () {
  // =============================================
  // 1. INICIALIZACIÓN Y VERIFICACIONES
  // =============================================
  console.log("Iniciando sistema de reservas...");

  if (typeof bootstrap === "undefined" || !bootstrap.Modal) {
    console.error("ERROR: Bootstrap no está cargado correctamente");
    alert("Error crítico: La biblioteca Bootstrap no se cargó correctamente");
    return;
  }

  // =============================================
  // 2. ELEMENTOS DEL DOM
  // =============================================
  const modalElement = document.getElementById("bookingModal");
  const reservarBtn = document.getElementById("reservarHoraBtn");
  const enviarComprobanteBtn = document.getElementById("enviarComprobante");
  const comprobanteInput = document.getElementById("comprobante");
  const patientDataForm = document.getElementById("patientDataForm");

  const step1 = document.getElementById("step1");
  const step2 = document.getElementById("step2");
  const step3 = document.getElementById("step3");

  const btnToStep2 = document.getElementById("toStep2");
  const displayFechaHora = document.getElementById("selectedDateTime");
  const divHoraSeleccionada = document.getElementById("selectedTimeDisplay");
  const detallesConfirmacion = document.getElementById("confirmationDetails");
  const prevWeekBtn = document.getElementById("prevWeek");
  const nextWeekBtn = document.getElementById("nextWeek");
  const backToStep1Btn = document.getElementById("backToStep1");

  // =============================================
  // 3. VARIABLES DE ESTADO
  // =============================================
  let fechaActual = new Date();
  let fechaSeleccionada = null;
  let horaSeleccionada = null;

  const horariosManana = ["09:00", "10:00", "11:00"];
  const horariosTarde = ["14:00", "15:00", "16:00", "17:00", "18:00"];

  // =============================================
  // 4. INICIALIZACIÓN DEL MODAL
  // =============================================
  let bookingModal;
  try {
    bookingModal = new bootstrap.Modal(modalElement, {
      keyboard: false,
      backdrop: "static",
    });
  } catch (error) {
    console.error("Error al inicializar el modal:", error);
    return;
  }

  // =============================================
  // 5. FUNCIONES DE MODAL Y FORMULARIO
  // =============================================
  function mostrarModalTransferencia() {
    if (!bookingModal) return;

    try {
      bookingModal.show();
      setTimeout(() => {
        const modalVisible =
          modalElement.classList.contains("show") &&
          getComputedStyle(modalElement).display === "block";

        if (!modalVisible) forzarVisualizacionModal();
      }, 100);
    } catch {
      forzarVisualizacionModal();
    }
  }

  function forzarVisualizacionModal() {
    modalElement.style.display = "block";
    modalElement.classList.add("show");
    document.body.classList.add("modal-open");

    let backdrop = document.querySelector(".modal-backdrop");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.className = "modal-backdrop fade show";
      document.body.appendChild(backdrop);
    }
  }

  function validarFormulario() {
    const campos = ["nombre", "rut", "email", "telefono", "fechaNacimiento"];
    let valido = true;

    document.querySelectorAll(".is-invalid").forEach((el) => {
      el.classList.remove("is-invalid");
      const error = el.nextElementSibling;
      if (error?.classList.contains("invalid-feedback")) error.remove();
    });

    campos.forEach((id) => {
      const campo = document.getElementById(id);
      if (!campo.value.trim()) {
        mostrarError(campo, "Este campo es obligatorio");
        valido = false;
      }
    });

    const email = document.getElementById("email");
    if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      mostrarError(email, "Ingrese un email válido");
      valido = false;
    }

    const confirmCheckbox = document.getElementById("confirmData");
    if (!confirmCheckbox.checked) {
      mostrarError(confirmCheckbox, "Debe confirmar los datos");
      valido = false;
    }

    return valido;
  }

  function mostrarError(campo, mensaje) {
    campo.classList.add("is-invalid");
    let errorDiv = campo.nextElementSibling;

    if (!errorDiv || !errorDiv.classList.contains("invalid-feedback")) {
      errorDiv = document.createElement("div");
      errorDiv.className = "invalid-feedback";
      campo.parentNode.appendChild(errorDiv);
    }

    errorDiv.textContent = mensaje;
  }

  // =============================================
  // 6. CALENDARIO Y HORARIOS
  // =============================================
  function formatearFecha(fecha) {
    return fecha.toLocaleDateString("es-CL", {
      weekday: "short",
      day: "numeric",
      month: "long",
    });
  }

  function generarDiasSemana(fechaRef) {
    const container = document.getElementById("weekDaysContainer");
    container.innerHTML = "";

    const lunes = new Date(fechaRef);
    lunes.setDate(
      fechaRef.getDate() -
        fechaRef.getDay() +
        (fechaRef.getDay() === 0 ? -6 : 1)
    );

    document.getElementById("currentMonth").textContent = `${lunes
      .toLocaleDateString("es-CL", { month: "long" })
      .toUpperCase()} ${lunes.getFullYear()}`;

    for (let i = 0; i < 7; i++) {
      const dia = new Date(lunes);
      dia.setDate(lunes.getDate() + i);

      const esFin = dia.getDay() === 0 || dia.getDay() === 6;
      const esPasado = dia < new Date(new Date().setHours(0, 0, 0, 0));
      const esHoy = dia.toDateString() === new Date().toDateString();

      const div = document.createElement("div");
      div.className = "col px-1";

      let cardClass = "card h-100 rounded-0 border";
      let dayClass = "small day-name";
      let numClass = "fw-bold day-number";

      if (esPasado || esFin) {
        cardClass += " disabled-day border-light";
        dayClass += " text-muted";
        numClass += " text-muted";
      } else if (esHoy) {
        cardClass += " current-day border-success";
        numClass += " text-success";
      } else {
        cardClass += " border-success";
      }

      div.innerHTML = `
        <div class="${cardClass}">
          <div class="card-body text-center p-1">
            <div class="${dayClass}">${dia
        .toLocaleDateString("es-CL", { weekday: "short" })
        .toUpperCase()
        .replace(".", "")}</div>
            <div class="${numClass}">${dia.getDate()}</div>
          </div>
        </div>`;

      if (!esPasado && !esFin) {
        div.addEventListener("click", function () {
          document
            .querySelectorAll("#weekDaysContainer .card")
            .forEach((card) => {
              card.classList.remove("selected-day");
              card.querySelector(".day-name").classList.remove("text-white");
              card.querySelector(".day-number").classList.remove("text-white");
            });

          const cardSel = this.querySelector(".card");
          cardSel.classList.add("selected-day");
          cardSel.querySelector(".day-name").classList.add("text-white");
          cardSel.querySelector(".day-number").classList.add("text-white");

          fechaSeleccionada = dia;
          actualizarVistaHora();
          btnToStep2.disabled = !horaSeleccionada;
        });
      }

      container.appendChild(div);
    }
  }

  function generarHoras() {
    const contManana = document.getElementById("morningSlots");
    const contTarde = document.getElementById("afternoonSlots");
    contManana.innerHTML = "";
    contTarde.innerHTML = "";

    horariosManana.forEach((h) =>
      contManana.appendChild(crearBotonHora(h, "AM"))
    );
    horariosTarde.forEach((h) =>
      contTarde.appendChild(crearBotonHora(h, "PM"))
    );
  }

  function crearBotonHora(hora, periodo) {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "btn btn-outline-success btn-sm rounded-0 time-slot";
    boton.textContent = `${hora} ${periodo}`;
    boton.dataset.time = `${hora}:00`;
    boton.addEventListener("click", () => seleccionarHora(boton));
    return boton;
  }

  function seleccionarHora(boton) {
    document.querySelectorAll(".time-slot").forEach((b) => {
      b.classList.remove("selected", "btn-success", "text-white");
      b.classList.add("btn-outline-success");
    });

    boton.classList.add("selected", "btn-success", "text-white");
    boton.classList.remove("btn-outline-success");

    horaSeleccionada = boton.dataset.time;
    actualizarVistaHora();
    btnToStep2.disabled = !fechaSeleccionada;
  }

  function actualizarVistaHora() {
    if (fechaSeleccionada && horaSeleccionada) {
      const texto = `${formatearFecha(
        fechaSeleccionada
      )} a las ${horaSeleccionada.slice(0, 5)}`;
      displayFechaHora.textContent = texto;
      divHoraSeleccionada.textContent = texto;
      detallesConfirmacion.textContent = texto;
    } else {
      displayFechaHora.textContent = "";
      divHoraSeleccionada.textContent = "";
      detallesConfirmacion.textContent = "";
    }
  }

  // =============================================
  // 7. EVENTOS DE NAVEGACIÓN Y ENVÍO
  // =============================================
  reservarBtn.addEventListener("click", mostrarModalTransferencia);

  btnToStep2.addEventListener("click", () => {
    if (!fechaSeleccionada || !horaSeleccionada) return;
    step1.classList.add("d-none");
    step2.classList.remove("d-none");
  });

  backToStep1Btn.addEventListener("click", () => {
    step2.classList.add("d-none");
    step1.classList.remove("d-none");
  });

  enviarComprobanteBtn.addEventListener("click", () => {
    if (!validarFormulario()) return;

    const file = comprobanteInput.files[0];
    if (!file) {
      alert("Debe adjuntar un comprobante.");
      return;
    }

    alert("Reserva enviada correctamente");
    bookingModal.hide();
  });

  prevWeekBtn.addEventListener("click", () => {
    fechaActual.setDate(fechaActual.getDate() - 7);
    generarDiasSemana(fechaActual);
  });

  nextWeekBtn.addEventListener("click", () => {
    fechaActual.setDate(fechaActual.getDate() + 7);
    generarDiasSemana(fechaActual);
  });

  // =============================================
  // 8. INICIALIZACIÓN DE CALENDARIO
  // =============================================
  generarDiasSemana(fechaActual);
  generarHoras();
});
