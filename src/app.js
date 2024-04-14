const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const port = 4876;
app.use(express.static('public'));

app.get('/', async (req, res) => {
    try {
        res.compose(path.join(__dirname, 'public', 'index.html'));
    } catch (error) {
        res.status(500).send('Error accessing the game directory');
    }
});


app.get('/api/games', async (req, res) => {
  try {
      const gamesPath = path.join(__dirname, 'games');
      const gameFolders = await fs.readdir(gamesPath, { withFileTypes: true });
      const games = gameFolders
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name);
      res.json(games);  // Send game names as JSON
  } catch (error) {
      res.status(500).send('Error accessing the game directory');
  }
});

app.use('/:gameName', (req, res, next) => {
  const gameName = req.params.gameName;
  const gamePath = path.join(__dirname, 'games', gameName);
  express.static(gamePath)(req, res, next);
});

app.use((req, res) => {
    res.status(404).send('Page not found');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
