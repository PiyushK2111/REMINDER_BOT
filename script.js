document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('deadline-form');
    const deadlinesList = document.getElementById('deadlines');
    let deadlines = [];

    // Request notification permission
    if ('Notification' in window) {
        Notification.requestPermission();
    }

    // Fetch deadlines from server
    async function fetchDeadlines() {
        try {
            const response = await fetch('/api/deadlines');
            deadlines = await response.json();
            displayDeadlines();
        } catch (error) {
            console.error('Error fetching deadlines:', error);
        }
    }

    // Display deadlines
    function displayDeadlines() {
        deadlinesList.innerHTML = '';
        deadlines.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
        deadlines.forEach((deadline) => {
            const li = document.createElement('li');
            const deadlineDate = new Date(deadline.datetime);
            const now = new Date();
            const timeDiff = deadlineDate - now;
            const hoursLeft = Math.floor(timeDiff / (1000 * 60 * 60));
            const minutesLeft = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            let status = '';
            if (timeDiff < 0) {
                status = 'Overdue';
                li.style.backgroundColor = 'rgba(255, 235, 238, 0.3)';
            } else if (hoursLeft < 1) {
                status = `Due in ${minutesLeft} minutes`;
                li.style.backgroundColor = 'rgba(255, 243, 224, 0.3)';
            } else if (hoursLeft < 24) {
                status = `Due in ${hoursLeft} hours`;
                li.style.backgroundColor = 'rgba(255, 243, 224, 0.3)';
            } else {
                status = deadlineDate.toLocaleString();
            }
            li.innerHTML = `
                <div class="deadline-info">
                    <strong>${deadline.name}</strong><br>
                    ${status}
                </div>
                <button class="delete-btn" data-id="${deadline.id}">Delete</button>
            `;
            deadlinesList.appendChild(li);
        });
    }

    // Add deadline
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const datetime = `${date}T${time}`;
        try {
            const response = await fetch('/api/deadlines', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, datetime })
            });
            if (response.ok) {
                await fetchDeadlines();
                form.reset();
            }
        } catch (error) {
            console.error('Error adding deadline:', error);
        }
    });

    // Delete deadline
    deadlinesList.addEventListener('click', async function(e) {
        if (e.target.classList.contains('delete-btn')) {
            const id = e.target.getAttribute('data-id');
            try {
                const response = await fetch(`/api/deadlines/${id}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    await fetchDeadlines();
                }
            } catch (error) {
                console.error('Error deleting deadline:', error);
            }
        }
    });

    // Delete all deadlines
    document.getElementById('delete-all-btn').addEventListener('click', async function() {
        if (confirm('Are you sure you want to delete all past deadlines? This action cannot be undone.')) {
            try {
                const response = await fetch('/api/deadlines', {
                    method: 'DELETE'
                });
                if (response.ok) {
                    await fetchDeadlines();
                }
            } catch (error) {
                console.error('Error deleting past deadlines:', error);
            }
        }
    });

    // Check for reminders
    async function checkReminders() {
        const now = new Date();
        for (const deadline of deadlines) {
            const deadlineDate = new Date(deadline.datetime);
            const timeDiff = deadlineDate - now;
            const hoursLeft = timeDiff / (1000 * 60 * 60);
            if (timeDiff <= 0 && !deadline.notified) {
                showNotification(`Deadline Alert: ${deadline.name} is now due!`);
                deadline.notified = true;
                try {
                    await fetch(`/api/deadlines/${deadline.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ notified: 1 })
                    });
                } catch (error) {
                    console.error('Error updating notified status:', error);
                }
            }
        }
    }

    const modal = document.getElementById('reminder-modal');
    const reminderMessage = document.getElementById('reminder-message');
    const closeBtn = document.querySelector('.close');
    const dismissBtn = document.getElementById('dismiss-reminder');

    // Modal event listeners
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }

    dismissBtn.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    // Show notification
    function showNotification(message) {
        // Show modal popup
        reminderMessage.textContent = message;
        modal.style.display = 'block';

        // Also try browser notification
        if (Notification.permission === 'granted') {
            new Notification('Deadline Reminder', { body: message });
        }
    }

    // Initial load
    fetchDeadlines();

    // Check reminders every minute
    setInterval(checkReminders, 60000);
});