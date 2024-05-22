document.addEventListener("DOMContentLoaded", function() {
  const autoBetForm = document.getElementById("autoBetForm");
  const autoBetStatus = document.getElementById("autoBetStatus");

  autoBetForm.addEventListener("submit", async function(e) {
    e.preventDefault();
    const stopLimit = parseFloat(document.getElementById("stopLimit").value);
    const numberOfRolls = parseInt(document.getElementById("numberOfRolls").value, 10);

    if (stopLimit <= 0 || numberOfRolls <= 0) {
      alert("Stop Limit and Number of Rolls must be greater than 0");
      return;
    }

    autoBetStatus.innerHTML = "Auto betting started...";
    this.querySelector("button[type='submit']").disabled = true;

    try {
      for (let roll = 0; roll < numberOfRolls; roll++) {
        const response = await fetch('/game/autoBet', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ stopLimit, rollNumber: roll + 1 }),
        });

        if (!response.ok) {
          throw new Error('Failed to place bet');
        }

        const result = await response.json();

        if (result.win) {
          autoBetStatus.innerHTML += `<br>Roll ${roll + 1}: Win. Payout: ${result.payout}`;
        } else {
          autoBetStatus.innerHTML += `<br>Roll ${roll + 1}: Loss`;
        }

        if (result.balance <= stopLimit) {
          autoBetStatus.innerHTML += "<br>Reached stop limit. Stopping...";
          break;
        }
      }
    } catch (error) {
      console.error("Error during auto betting: ", error);
      autoBetStatus.innerHTML += "<br>Error: " + error.message;
    } finally {
      this.querySelector("button[type='submit']").disabled = false;
      autoBetStatus.innerHTML += "<br>Auto betting finished.";
      console.log("Auto betting process completed.");
    }
  });
});