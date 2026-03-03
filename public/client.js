// Socket connection for live results
const socket = io();

socket.on("connect", () => console.log("✅ Connected to real-time server"));

socket.on("liveResults", data => {
  console.log("🔥 Live Results Update:", data);
  
  const resultsDiv = document.getElementById('resultsDisplay');
  if (!resultsDiv) return;
  
  resultsDiv.innerHTML = '<h4>Presidential Results</h4>';
  
  // Presidential results
  const presResults = {};
  // MP results
  const mpResults = {};
  
  data.forEach(item => {
    if (item._id && item._id.president) {
      presResults[item._id.president] = item.total;
    }
    if (item._id && item._id.mp) {
      mpResults[item._id.mp] = item.total;
    }
  });
  
  // Display presidential results
  if (Object.keys(presResults).length === 0) {
    resultsDiv.innerHTML += '<p>No presidential votes yet</p>';
  } else {
    for (let [candidate, votes] of Object.entries(presResults)) {
      resultsDiv.innerHTML += `<p><strong>${candidate}</strong>: ${votes} votes</p>`;
    }
  }
  
  resultsDiv.innerHTML += '<h4>MP Results</h4>';
  
  // Display MP results
  if (Object.keys(mpResults).length === 0) {
    resultsDiv.innerHTML += '<p>No MP votes yet</p>';
  } else {
    for (let [candidate, votes] of Object.entries(mpResults)) {
      resultsDiv.innerHTML += `<p><strong>${candidate}</strong>: ${votes} votes</p>`;
    }
  }
  
  // Add timestamp
  resultsDiv.innerHTML += `<small>Last updated: ${new Date().toLocaleTimeString()}</small>`;
});

// Load initial results when page loads
window.onload = function() {
  fetch('/results')
    .then(r => r.json())
    .then(data => {
      console.log("Initial results:", data);
      const resultsDiv = document.getElementById('resultsDisplay');
      if (resultsDiv) {
        resultsDiv.innerHTML = '<h4>Presidential Results</h4>';
        
        if (data.length === 0) {
          resultsDiv.innerHTML += '<p>No votes yet</p>';
        } else {
          data.forEach(item => {
            resultsDiv.innerHTML += `<p><strong>${item._id.president}</strong>: ${item.total} votes</p>`;
          });
        }
      }
    })
    .catch(err => console.error("Error loading results:", err));
};