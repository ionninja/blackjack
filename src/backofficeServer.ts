import express from 'express';
import { authenticateStaff } from './auth';
import { getGameHistory, getUsers } from './backoffice';

const app = express();
const port = 3000;

app.use(express.json());

// Middleware to authenticate staff
app.use(async (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token || !(await authenticateStaff(token.replace('Bearer ', '')))) {
        return res.status(403).send('Forbidden');
    }
    next();
});

// Serve the backoffice panel
app.use(express.static('public'));

// API endpoints for backoffice
app.get('/api/users', async (req, res) => {
    res.json(await getUsers());
});

app.get('/api/game-history/:userId', async (req, res) => {
    const { userId } = req.params;
    res.json(await getGameHistory(userId));
});

app.listen(port, () => {
    console.log(`Backoffice server running at http://localhost:${port}`);
});