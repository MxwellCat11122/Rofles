const votes = {
  edim: 0,
  darina: 0,
  malika: 0,
};

const counters = {
  edim: document.getElementById("count-edim"),
  darina: document.getElementById("count-darina"),
  malika: document.getElementById("count-malika"),
};

const bars = {
  edim: document.getElementById("bar-edim"),
  darina: document.getElementById("bar-darina"),
  malika: document.getElementById("bar-malika"),
};

const sliders = {
  edim: document.getElementById("slider-edim"),
  darina: document.getElementById("slider-darina"),
  malika: document.getElementById("slider-malika"),
};

const stepValues = {
  edim: document.getElementById("step-edim"),
  darina: document.getElementById("step-darina"),
  malika: document.getElementById("step-malika"),
};

function formatNumber(n) {
  return n.toLocaleString("ru-RU");
}

function syncStep(party) {
  stepValues[party].textContent = sliders[party].value;
}

Object.keys(sliders).forEach((party) => {
  sliders[party].addEventListener("input", () => syncStep(party));
  syncStep(party);
});

document.querySelectorAll(".candidate__step").forEach((button) => {
  button.addEventListener("click", () => {
    const party = button.dataset.party;
    const slider = sliders[party];
    const step = button.dataset.action === "plus" ? 1 : -1;
    const next = Math.min(
      Number(slider.max),
      Math.max(Number(slider.min), Number(slider.value) + step)
    );
    slider.value = next;
    syncStep(party);
  });
});

function render() {
  counters.edim.textContent = formatNumber(votes.edim);
  counters.darina.textContent = formatNumber(votes.darina);
  counters.malika.textContent = formatNumber(votes.malika);

  const maxMagnitude = Math.max(
    Math.abs(votes.edim),
    Math.abs(votes.darina),
    Math.abs(votes.malika),
    1
  );

  bars.edim.style.width = `${(Math.abs(votes.edim) / maxMagnitude) * 100}%`;
  bars.darina.style.width = `${(Math.abs(votes.darina) / maxMagnitude) * 100}%`;
  bars.malika.style.width = `${(Math.abs(votes.malika) / maxMagnitude) * 100}%`;
}

function bump(party) {
  const el = counters[party];
  el.classList.remove("bump");
  void el.offsetWidth;
  el.classList.add("bump");
}

document.querySelectorAll(".candidate__vote").forEach((button) => {
  button.addEventListener("click", () => {
    const party = button.dataset.party;
    const value = Number(sliders[party].value);

    if (party === "edim") {
      votes.edim += value * 1_000_000;
    } else {
      votes[party] -= value * 1_000_000_000;
    }

    render();
    bump(party);
  });
});

document.getElementById("reset-btn").addEventListener("click", () => {
  votes.edim = 0;
  votes.darina = 0;
  votes.malika = 0;
  Object.keys(sliders).forEach((party) => {
    sliders[party].value = 1;
    syncStep(party);
  });
  render();
});

render();
