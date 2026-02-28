const STORAGE_KEY = "reserveLinkSaaSData";

const state = {
  selectedSlot: "",
  appointments: [],
  history: [],
  alerts: ["🔔 Enable notifications to receive slot updates."],
};

const slotOptions = ["09:00", "10:00", "11:30", "14:00", "15:30", "17:00"];

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function load() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    state.selectedSlot = "";
    state.appointments = parsed.appointments || [];
    state.history = parsed.history || [];
    state.alerts = parsed.alerts || state.alerts;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function showPage(pageId) {
  document.querySelectorAll(".page").forEach((page) => page.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
}

function activateTab(tabName) {
  document.querySelectorAll(".nav-item[data-tab]").forEach((btn) => btn.classList.toggle("active", btn.dataset.tab === tabName));
  document.querySelectorAll(".tab").forEach((tab) => tab.classList.remove("active"));
  document.getElementById(`tab-${tabName}`).classList.add("active");
}

function renderSlotButtons() {
  const grid = document.getElementById("slotGrid");
  grid.innerHTML = "";

  slotOptions.forEach((slot) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `slot-btn ${state.selectedSlot === slot ? "active" : ""}`;
    button.textContent = slot;
    button.addEventListener("click", () => {
      state.selectedSlot = slot;
      renderSlotButtons();
      updateSubmitState();
    });
    grid.appendChild(button);
  });
}

function updateSubmitState() {
  const canSubmit = Boolean(document.getElementById("dateInput").value && state.selectedSlot);
  document.getElementById("submitBtn").disabled = !canSubmit;
}

function renderLists() {
  const appointmentsList = document.getElementById("appointmentsList");
  const historyList = document.getElementById("historyList");
  const alertsList = document.getElementById("alertsList");

  appointmentsList.innerHTML = "";
  historyList.innerHTML = "";
  alertsList.innerHTML = "";

  if (!state.appointments.length) {
    appointmentsList.innerHTML = "<li>No active appointments.</li>";
  } else {
    state.appointments.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = `${item.service} — ${item.date} at ${item.time}`;
      appointmentsList.appendChild(li);
    });
  }

  if (!state.history.length) {
    historyList.innerHTML = "<li>No history yet.</li>";
  } else {
    state.history.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = `${item.service} — ${item.date} at ${item.time}`;
      historyList.appendChild(li);
    });
  }

  state.alerts.forEach((alert) => {
    const li = document.createElement("li");
    li.textContent = alert;
    alertsList.appendChild(li);
  });

  document.getElementById("upcomingCount").textContent = String(state.appointments.length);
  document.getElementById("historyCount").textContent = String(state.history.length);
}

function boot() {
  load();
  renderSlotButtons();
  renderLists();
  updateSubmitState();

  document.getElementById("loginBtn").addEventListener("click", () => {
    showPage("dashboardPage");
    activateTab("dashboard");
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    showPage("landingPage");
  });

  document.querySelectorAll(".nav-item[data-tab]").forEach((button) => {
    button.addEventListener("click", () => activateTab(button.dataset.tab));
  });

  document.getElementById("dateInput").addEventListener("input", updateSubmitState);

  document.getElementById("bookForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const service = document.getElementById("serviceSelect").value;
    const date = document.getElementById("dateInput").value;
    const notes = document.getElementById("notesInput").value.trim();
    if (!date || !state.selectedSlot) return;

    const appointment = {
      service,
      date,
      time: state.selectedSlot,
      notes,
      createdAt: new Date().toISOString(),
    };

    state.appointments.unshift(appointment);
    state.history.unshift(appointment);
    state.alerts.unshift(`✅ New booking confirmed: ${service} on ${date} at ${state.selectedSlot}.`);
    state.alerts = state.alerts.slice(0, 8);

    state.selectedSlot = "";
    document.getElementById("bookForm").reset();
    document.getElementById("successMsg").classList.remove("hidden");
    renderSlotButtons();
    renderLists();
    updateSubmitState();
    save();
  });
}

boot();
