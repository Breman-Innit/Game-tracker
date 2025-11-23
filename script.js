let players = [];
    let targetScore = 10;
    let gameActive = true;

    // Set target score
    function setTargetScore() {
      const targetInput = document.getElementById('targetScore');
      const newTarget = parseInt(targetInput.value);
      
      if (newTarget > 0) {
        targetScore = newTarget;
        document.getElementById('currentTarget').textContent = targetScore;
        document.getElementById('targetDisplay').style.display = 'block';
        
        // Check if anyone already reached the new target
        checkForWinner();
      } else {
        alert("Please enter a valid target score greater than 0!");
      }
    }

    // Create input fields for player names
    function createPlayerInputs() {
      const num = document.getElementById('numPlayers').value;
      const container = document.getElementById('playerNames');
      container.innerHTML = '';
      players = [];

      if(num < 1) {
        alert("Enter at least 1 player!");
        return;
      }

      for(let i = 0; i < num; i++){
        const input = document.createElement('input');
        input.placeholder = `Player ${i+1} Name`;
        input.id = `playerName${i}`;
        container.appendChild(input);
      }
      
      const btn = document.createElement('button');
      btn.textContent = "Start Game";
      btn.onclick = startGame;
      container.appendChild(btn);
    }

    // Store names and create player cards
    function startGame() {
      const num = document.getElementById('numPlayers').value;
      players = [];
      gameActive = true;

      for(let i = 0; i < num; i++){
        const name = document.getElementById(`playerName${i}`).value.trim();
        if(name === '') {
          alert("Enter all player names!");
          return;
        }
        players.push({ 
          name: name, 
          score: 0,
          element: null
        });
      }

      displayPlayers();
      document.getElementById('targetDisplay').style.display = 'block';
    }

    // Display player cards with score and buttons
    function displayPlayers() {
      const board = document.getElementById('scoreBoard');
      board.innerHTML = '';

      players.forEach((player, index) => {
        const card = document.createElement('div');
        card.className = 'player-card';
        card.id = `playerCard${index}`;
        card.innerHTML = `
          <h3>${player.name}</h3>
          <div class="score" id="score${index}">${player.score}</div>
          <button onclick="addScore(${index})">+1 Point</button>
          <button onclick="addCustomScore(${index})">Custom Points</button>
          <button class="reset" onclick="resetPlayerScore(${index})">Reset Score</button>
        `;
        board.appendChild(card);
        player.element = card;
      });
    }

    // Add 1 point to player score
    function addScore(index) {
      if (!gameActive) return;
      
      players[index].score++;
      updateScoreDisplay(index);
      checkForWinner();
    }

    // Add custom points to player score
    function addCustomScore(index) {
      if (!gameActive) return;
      
      const points = prompt(`Enter points to add to ${players[index].name}:`, "1");
      const pointsNum = parseInt(points);
      
      if (!isNaN(pointsNum) && pointsNum > 0) {
        players[index].score += pointsNum;
        updateScoreDisplay(index);
        checkForWinner();
      } else if (points !== null) {
        alert("Please enter a valid positive number!");
      }
    }

    // Reset individual player score
    function resetPlayerScore(index) {
      players[index].score = 0;
      updateScoreDisplay(index);
      
      // Remove winner styling if it was applied
      const card = players[index].element;
      card.classList.remove('winner');
    }

    // Update score display and check for target
    function updateScoreDisplay(index) {
      document.getElementById(`score${index}`).textContent = players[index].score;
      
      // Highlight if player is close to target
      const card = players[index].element;
      if (players[index].score >= targetScore - 2 && players[index].score < targetScore) {
        card.style.borderColor = '#ff9800';
        card.style.background = 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)';
      } else if (players[index].score < targetScore - 2) {
        card.style.borderColor = '#4CAF50';
        card.style.background = 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)';
      }
    }

    // Check if any player reached the target score
    function checkForWinner() {
      if (!gameActive) return;
      
      players.forEach((player, index) => {
        if (player.score >= targetScore) {
          declareWinner(index);
        }
      });
    }

    // Declare winner with animations
    function declareWinner(winnerIndex) {
      gameActive = false;
      const winner = players[winnerIndex];
      
      // Add winner styling to the card
      const winnerCard = winner.element;
      winnerCard.classList.add('winner');
      
      // Show winner modal
      document.getElementById('winnerName').textContent = winner.name;
      document.getElementById('winnerModal').classList.add('show');
      
      // Create confetti effect
      createConfetti();
    }

    // Create confetti animation
    function createConfetti() {
      const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
      const container = document.body;
      
      for (let i = 0; i < 150; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animation = `confetti ${Math.random() * 3 + 2}s linear forwards`;
        confetti.style.animationDelay = Math.random() * 2 + 's';
        container.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
          confetti.remove();
        }, 5000);
      }
    }

    // Close winner modal
    function closeWinnerModal() {
      document.getElementById('winnerModal').classList.remove('show');
      gameActive = true;
    }

    // Reset all scores
    function resetScores() {
      players.forEach((player, index) => {
        player.score = 0;
        updateScoreDisplay(index);
        player.element.classList.remove('winner');
      });
      gameActive = true;
    }

    // Reset entire game
    function resetGame() {
      players = [];
      gameActive = true;
      document.getElementById('scoreBoard').innerHTML = '';
      document.getElementById('playerNames').innerHTML = '';
      document.getElementById('numPlayers').value = '';
      document.getElementById('targetScore').value = '10';
      document.getElementById('targetDisplay').style.display = 'none';
      document.getElementById('winnerModal').classList.remove('show');
      
      // Remove all confetti
      document.querySelectorAll('.confetti').forEach(confetti => confetti.remove());
    }

    // Initialize with default target
    document.addEventListener('DOMContentLoaded', function() {
      document.getElementById('targetScore').value = targetScore;
    });
  