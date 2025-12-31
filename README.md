# Deadline Reminder Bot

A full-stack web application for students to manage and get reminded about academic deadlines.

## Features

- Add deadlines with name, date, and time
- View upcoming deadlines sorted by date
- Automatic reminders via modal pop-ups and browser notifications
- Persistent storage using SQLite database
- Dark, dynamic theme with study-themed backgrounds and stickers
- Responsive design

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Styling**: Custom CSS with animations and glassmorphism

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/deadline-reminder-bot.git
   cd deadline-reminder-bot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Open your browser and go to `http://localhost:3000`

## Deployment

### Heroku
1. Create a Heroku account and install Heroku CLI
2. Login to Heroku: `heroku login`
3. Create a new app: `heroku create your-app-name`
4. Push to Heroku: `git push heroku master`

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel`

## Usage

- Fill in the deadline form and click "Add Deadline"
- View your deadlines in the list below
- Get reminded 1 hour before each deadline
- Delete deadlines when completed

## API Endpoints

- `GET /api/deadlines` - Fetch all deadlines
- `POST /api/deadlines` - Add a new deadline
- `DELETE /api/deadlines/:id` - Delete a deadline
- `PUT /api/deadlines/:id` - Update a deadline

## Contributing

Feel free to fork and contribute to this project!

## License

MIT License