// Match Prediction Data and Dashboard Controller
const MATCHES_DATA = [
  {
    id: "match-rm-barca",
    league: "La Liga",
    homeTeam: "Real Madrid",
    homeLogo: "RM",
    awayTeam: "Barcelona",
    awayLogo: "BAR",
    probabilities: { home: 45, draw: 20, away: 35 },
    time: "Today, 20:00",
    formations: { home: "4-3-1-2", away: "4-3-3" },
    intensity: 85
  },
  {
    id: "match-bayern-bvb",
    league: "Bundesliga",
    homeTeam: "Bayern Munich",
    homeLogo: "FCB",
    awayTeam: "Borussia Dortmund",
    awayLogo: "BVB",
    probabilities: { home: 78, draw: 12, away: 10 }, // Highest Home Win Prob
    time: "Tomorrow, 17:30",
    formations: { home: "4-3-3", away: "4-2-3-1" },
    intensity: 92
  },
  {
    id: "match-mci-ars",
    league: "Premier League",
    homeTeam: "Manchester City",
    homeLogo: "MCI",
    awayTeam: "Arsenal",
    awayLogo: "ARS",
    probabilities: { home: 62, draw: 20, away: 18 },
    time: "Sunday, 16:00",
    formations: { home: "3-2-4-1", away: "4-3-3" },
    intensity: 89
  }
];

document.addEventListener("DOMContentLoaded", () => {
  renderMatches();
  setupEventListeners();
});

function renderMatches() {
  const grid = document.getElementById("matches-grid");
  if (!grid) return;

  grid.innerHTML = MATCHES_DATA.map(match => `
    <div class="prediction-card" data-match-id="${match.id}">
      <div class="card-header">
        <span class="league-tag">${match.league}</span>
        <span class="match-time">${match.time}</span>
      </div>
      <div class="teams-container">
        <div class="team-row">
          <div class="team-info">
            <div class="team-logo">${match.homeLogo}</div>
            <span class="team-name">${match.homeTeam}</span>
          </div>
        </div>
        <div class="team-row">
          <div class="team-info">
            <div class="team-logo">${match.awayLogo}</div>
            <span class="team-name">${match.awayTeam}</span>
          </div>
        </div>
      </div>
      <div class="probability-bar-container">
        <div class="probability-labels">
          <span>Home Win: <strong>${match.probabilities.home}%</strong></span>
          <span>Away Win: <strong>${match.probabilities.away}%</strong></span>
        </div>
        <div class="probability-bar">
          <div class="prob-home" style="width: ${match.probabilities.home}%" title="Home Win: ${match.probabilities.home}%"></div>
          <div class="prob-draw" style="width: ${match.probabilities.draw}%" title="Draw: ${match.probabilities.draw}%"></div>
          <div class="prob-away" style="width: ${match.probabilities.away}%" title="Away Win: ${match.probabilities.away}%"></div>
        </div>
      </div>
    </div>
  `).join("");
}

function setupEventListeners() {
  const grid = document.getElementById("matches-grid");
  const overlay = document.getElementById("detail-overlay");
  const closeBtn = document.getElementById("close-btn");

  if (grid) {
    grid.addEventListener("click", (e) => {
      const card = e.target.closest(".prediction-card");
      if (!card) return;
      const matchId = card.getAttribute("data-match-id");
      const match = MATCHES_DATA.find(m => m.id === matchId);
      if (match) {
        showMatchDetails(match);
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      if (overlay) {
        overlay.classList.remove("active");
      }
    });
  }

  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.classList.remove("active");
      }
    });
  }
}

function showMatchDetails(match) {
  const overlay = document.getElementById("detail-overlay");
  if (!overlay) return;

  // Set league
  document.getElementById("detail-league").innerText = match.league;
  
  // Set home team
  document.getElementById("detail-home-logo").innerText = match.homeLogo;
  document.getElementById("detail-home-name").innerText = match.homeTeam;
  
  // Set away team
  document.getElementById("detail-away-logo").innerText = match.awayLogo;
  document.getElementById("detail-away-name").innerText = match.awayTeam;
  
  // Set tactical details
  document.getElementById("detail-home-formation").innerText = match.formations.home;
  document.getElementById("detail-away-formation").innerText = match.formations.away;
  
  // Set dynamic visual bar
  const intensityBar = document.getElementById("detail-intensity-bar");
  if (intensityBar) {
    intensityBar.style.width = `${match.intensity}%`;
    document.getElementById("detail-intensity-value").innerText = `${match.intensity}%`;
  }

  overlay.classList.add("active");
}
