const dbKey = "reserveLinkDB";

const hospitals = [
  {
    name: "Clinique Lumière",
    specialities: {
      Dentisterie: ["Dr. Dubois", "Dr. Malki"],
      Ophtalmologie: ["Dr. Martin", "Dr. Messaoudi"],
      Dermatologie: ["Dr. Khatri"],
    },
  },
  {
    name: "Hôpital Saint-Care",
    specialities: {
      Cardiologie: ["Dr. Benali", "Dr. Pereira"],
      Pédiatrie: ["Dr. Nadir"],
      ORL: ["Dr. Azizi"],
    },
  },
  {
    name: "Centre Médical Nova",
    specialities: {
      Gynécologie: ["Dr. Farah"],
      Neurologie: ["Dr. Simon"],
      Dentisterie: ["Dr. Amina"],
    },
  },
];

const state = {
  currentMonth: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  selectedDate: new Date(),
  selectedSlot: null,
  user: null,
  selection: null,
  appointments: [],
  dayAlerts: {},
  notifications: [],
};

const slotHours = ["10:00", "11:00", "14:00", "15:30", "16:30"];
const maxAppointments = 2;

function saveDB() {
  localStorage.setItem(
    dbKey,
    JSON.stringify({
      user: state.user,
      selection: state.selection,
      appointments: state.appointments,
      dayAlerts: state.dayAlerts,
      notifications: state.notifications,
    })
  );
}

function loadDB() {
  const raw = localStorage.getItem(dbKey);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    state.user = parsed.user || null;
    state.selection = parsed.selection || null;
    state.appointments = parsed.appointments || [];
    state.dayAlerts = parsed.dayAlerts || {};
    state.notifications = parsed.notifications || [];
  } catch {
    localStorage.removeItem(dbKey);
  }
}

function showPage(pageId) {
  document.querySelectorAll(".page").forEach((section) => section.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
}

function fillHospitalOptions() {
  const hospitalSelect = document.getElementById("hospitalSelect");
  hospitalSelect.innerHTML = hospitals.map((h) => `<option value="${h.name}">${h.name}</option>`).join("");
  updateSpecialityOptions();
}

function updateSpecialityOptions() {
  const hospitalName = document.getElementById("hospitalSelect").value;
  const hospital = hospitals.find((entry) => entry.name === hospitalName) || hospitals[0];
  const specialitySelect = document.getElementById("specialitySelect");
  specialitySelect.innerHTML = Object.keys(hospital.specialities)
    .map((speciality) => `<option value="${speciality}">${speciality}</option>`)
    .join("");
  updateDoctorOptions();
}

function updateDoctorOptions() {
  const hospitalName = document.getElementById("hospitalSelect").value;
  const speciality = document.getElementById("specialitySelect").value;
  const hospital = hospitals.find((entry) => entry.name === hospitalName) || hospitals[0];
  const doctors = hospital.specialities[speciality] || [];
  const doctorSelect = document.getElementById("doctorSelect");
  doctorSelect.innerHTML = doctors.map((doctor) => `<option value="${doctor}">${doctor}</option>`).join("");
}

function dayKey(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

function slotKey(date, hour) {
  return `${dayKey(date)}T${hour}`;
}

function closedDay(date) {
  return (
    date.getMonth() === state.currentMonth.getMonth() &&
    date.getFullYear() === state.currentMonth.getFullYear() &&
    date.getDate() === 27
  );
}

function isBooked(key) {
  return state.appointments.some((appointment) => appointment.slotKey === key);
}

function hasAvailability(date) {
  if (closedDay(date)) return false;
  return slotHours.some((hour) => !isBooked(slotKey(date, hour)));
}

function formatMonth(date) {
  return date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}

function formatLongDate(date) {
  return date.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });
}

function addNotification(message) {
  state.notifications.unshift(message);
  state.notifications = state.notifications.slice(0, 8);
  saveDB();
}

function updateProfileCard() {
  const user = state.user || {};
  const nameInput = document.getElementById("profileName");
  const emailInput = document.getElementById("profileEmail");
  const phoneInput = document.getElementById("profilePhone");

  if (!nameInput.value) nameInput.value = user.name || "";
  if (!emailInput.value) emailInput.value = user.email || "";
  if (!phoneInput.value) phoneInput.value = user.phone || "";

  const name = nameInput.value.trim() || "Patient";
  const email = emailInput.value.trim() || "email@exemple.com";
  const phone = phoneInput.value.trim() || "+33 6 00 00 00 00";

  document.getElementById("patientName").textContent = name;
  document.getElementById("patientEmail").textContent = email;
  document.getElementById("patientPhone").textContent = phone;
  document.getElementById("profileAvatar").src = `https://i.pravatar.cc/120?u=${encodeURIComponent(email)}`;

  state.user = { name, email, phone };
  saveDB();
}

function renderSelectionSummary() {
  const box = document.getElementById("selectionSummary");
  if (!state.selection) {
    box.textContent = "Aucune sélection établissement.";
    return;
  }
  box.innerHTML = `🏥 <strong>${state.selection.hospital}</strong> • 🩺 ${state.selection.speciality} • 👨‍⚕️ ${state.selection.doctor}`;
}

function renderCalendar() {
  const monthTitle = document.getElementById("monthTitle");
  const calendarGrid = document.getElementById("calendarGrid");

  monthTitle.textContent = formatMonth(state.currentMonth);
  calendarGrid.innerHTML = "";

  ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"].forEach((label) => {
    const cell = document.createElement("div");
    cell.className = "weekday";
    cell.textContent = label;
    calendarGrid.appendChild(cell);
  });

  const firstDay = new Date(state.currentMonth);
  const mondayOffset = (firstDay.getDay() + 6) % 7;
  firstDay.setDate(firstDay.getDate() - mondayOffset);

  for (let i = 0; i < 42; i += 1) {
    const date = new Date(firstDay);
    date.setDate(firstDay.getDate() + i);

    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "day-cell";

    const isCurrentMonth = date.getMonth() === state.currentMonth.getMonth();
    if (!isCurrentMonth) cell.classList.add("other-month");

    const key = dayKey(date);
    if (key === dayKey(state.selectedDate)) cell.classList.add("selected");

    const full = !hasAvailability(date);
    if (full) cell.classList.add("full");
    if (closedDay(date)) cell.classList.add("closed");

    const dayNum = document.createElement("span");
    dayNum.textContent = String(date.getDate());
    cell.appendChild(dayNum);

    if (full && isCurrentMonth) {
      const alertBtn = document.createElement("span");
      alertBtn.className = `bell-toggle ${state.dayAlerts[key] ? "active" : ""}`;
      alertBtn.textContent = state.dayAlerts[key] ? "🔔" : "🔕";
      cell.appendChild(alertBtn);
    } else if (isCurrentMonth) {
      const dot = document.createElement("span");
      dot.className = "day-dot";
      cell.appendChild(dot);
    }

    cell.addEventListener("click", () => {
      state.selectedDate = date;
      state.selectedSlot = null;
      renderBooking();
    });

    cell.addEventListener("dblclick", () => {
      if (!full || !isCurrentMonth) return;
      state.dayAlerts[key] = !state.dayAlerts[key];
      addNotification(
        state.dayAlerts[key]
          ? `🔔 Alerte activée pour ${formatLongDate(date)}.`
          : `🔕 Alerte retirée pour ${formatLongDate(date)}.`
      );
      renderBooking();
    });

    calendarGrid.appendChild(cell);
  }
}

function renderSlots() {
  const selectedDayLabel = document.getElementById("selectedDayLabel");
  const slotsGrid = document.getElementById("slotsGrid");
  const bookBtn = document.getElementById("bookBtn");

  slotsGrid.innerHTML = "";
  const selectedDate = new Date(state.selectedDate);
  selectedDayLabel.textContent = formatLongDate(selectedDate);

  slotHours.forEach((hour) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "slot-btn";
    button.textContent = hour;

    const key = slotKey(selectedDate, hour);
    const booked = isBooked(key);
    const closed = closedDay(selectedDate);

    if (closed || booked) {
      button.classList.add(closed ? "closed" : "booked");
      button.textContent = `${hour} (${closed ? "Fermé" : "Complet"})`;
      button.disabled = true;
    }
    if (state.selectedSlot === key) button.classList.add("selected");

    button.addEventListener("click", () => {
      state.selectedSlot = key;
      renderSlots();
    });

    slotsGrid.appendChild(button);
  });

  if (!state.selectedSlot) {
    bookBtn.disabled = true;
    bookBtn.textContent = "Confirmer la réservation";
    return;
  }

  const [datePart, hour] = state.selectedSlot.split("T");
  bookBtn.disabled = false;
  bookBtn.textContent = `Confirmer la réservation pour ${formatLongDate(new Date(datePart))} à ${hour}`;
}

function renderAppointments() {
  const list = document.getElementById("appointmentsList");
  list.innerHTML = "";

  if (!state.appointments.length) {
    const empty = document.createElement("li");
    empty.className = "appointment-item";
    empty.textContent = "Aucun RDV actif.";
    list.appendChild(empty);
    return;
  }

  state.appointments
    .slice()
    .sort((a, b) => a.slotKey.localeCompare(b.slotKey))
    .forEach((appointment) => {
      const item = document.createElement("li");
      item.className = "appointment-item";

      item.innerHTML = `<strong>${appointment.hospital}</strong><div>${appointment.speciality} • ${appointment.doctor}</div><div class="appointment-meta">${formatLongDate(
        new Date(appointment.dateKey)
      )}, ${appointment.hour}</div>`;

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "Gérer / Annuler";
      deleteBtn.addEventListener("click", () => {
        state.appointments = state.appointments.filter((entry) => entry.id !== appointment.id);
        if (state.dayAlerts[appointment.dateKey]) {
          addNotification(`✅ Créneau libéré le ${formatLongDate(new Date(appointment.dateKey))} à ${appointment.hour}.`);
        }
        saveDB();
        renderBooking();
      });

      item.appendChild(deleteBtn);
      list.appendChild(item);
    });
}

function renderNotifications() {
  const list = document.getElementById("notificationLog");
  list.innerHTML = "";

  const active = state.notifications.filter((entry) => entry.includes("🔔") || entry.includes("✅"));
  if (!active.length) {
    const empty = document.createElement("li");
    empty.className = "log-item";
    empty.textContent = "Aucune alerte active.";
    list.appendChild(empty);
    return;
  }

  active.forEach((entry) => {
    const item = document.createElement("li");
    item.className = "log-item";
    item.textContent = entry;
    list.appendChild(item);
  });
}

function renderHomeAppointments() {
  const wrapper = document.getElementById("homeAppointments");
  wrapper.innerHTML = "";

  if (!state.appointments.length) {
    wrapper.innerHTML = '<div class="log-item">Aucun rendez-vous enregistré.</div>';
    return;
  }

  state.appointments
    .slice()
    .sort((a, b) => a.slotKey.localeCompare(b.slotKey))
    .forEach((appointment) => {
      const row = document.createElement("div");
      row.className = "log-item";
      row.textContent = `${appointment.hospital} • ${appointment.speciality} • ${appointment.doctor} — ${formatLongDate(
        new Date(appointment.dateKey)
      )} à ${appointment.hour}`;
      wrapper.appendChild(row);
    });
}

function renderBooking() {
  renderSelectionSummary();
  renderCalendar();
  renderSlots();
  renderAppointments();
  renderNotifications();
  updateProfileCard();
}

function bootFlow() {
  loadDB();
  fillHospitalOptions();

  if (!state.user) {
    showPage("loginPage");
    return;
  }
  if (!state.selection) {
    showPage("selectionPage");
    return;
  }

  showPage("homePage");
  renderHomeAppointments();
}

document.getElementById("googleLoginBtn").addEventListener("click", () => {
  state.user = {
    name: "Alex Durand",
    email: "alexdurand@gmail.com",
    phone: "+33 95 7355",
  };
  saveDB();
  showPage("selectionPage");
});

document.getElementById("hospitalSelect").addEventListener("change", updateSpecialityOptions);
document.getElementById("specialitySelect").addEventListener("change", updateDoctorOptions);

document.getElementById("selectionForm").addEventListener("submit", (event) => {
  event.preventDefault();
  state.selection = {
    hospital: document.getElementById("hospitalSelect").value,
    speciality: document.getElementById("specialitySelect").value,
    doctor: document.getElementById("doctorSelect").value,
  };
  saveDB();
  showPage("bookingPage");
  renderBooking();
});

["profileName", "profileEmail", "profilePhone"].forEach((id) => {
  document.getElementById(id).addEventListener("input", updateProfileCard);
});

document.getElementById("prevMonth").addEventListener("click", () => {
  state.currentMonth = new Date(state.currentMonth.getFullYear(), state.currentMonth.getMonth() - 1, 1);
  state.selectedDate = new Date(state.currentMonth.getFullYear(), state.currentMonth.getMonth(), 1);
  state.selectedSlot = null;
  renderBooking();
});

document.getElementById("nextMonth").addEventListener("click", () => {
  state.currentMonth = new Date(state.currentMonth.getFullYear(), state.currentMonth.getMonth() + 1, 1);
  state.selectedDate = new Date(state.currentMonth.getFullYear(), state.currentMonth.getMonth(), 1);
  state.selectedSlot = null;
  renderBooking();
});

document.getElementById("bookBtn").addEventListener("click", () => {
  if (!state.selectedSlot || !state.selection) return;

  if (state.appointments.length >= maxAppointments) {
    addNotification("🔔 Limite atteinte : seulement 2 RDV actifs autorisés.");
    renderNotifications();
    return;
  }

  const [datePart, hour] = state.selectedSlot.split("T");
  const dateKeyOnly = dayKey(new Date(datePart));
  state.appointments.push({
    id: crypto.randomUUID(),
    slotKey: state.selectedSlot,
    dateKey: dateKeyOnly,
    hour,
    hospital: state.selection.hospital,
    speciality: state.selection.speciality,
    doctor: state.selection.doctor,
  });

  state.selectedSlot = null;
  saveDB();
  showPage("homePage");
  renderHomeAppointments();
});

document.getElementById("goBookBtn").addEventListener("click", () => {
  showPage("selectionPage");
});

document.getElementById("seeAppointmentsBtn").addEventListener("click", () => {
  renderHomeAppointments();
});

bootFlow();
