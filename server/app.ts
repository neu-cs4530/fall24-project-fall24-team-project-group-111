// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
// startServer() is a function that starts the server
// the server will listen on .env.CLIENT_URL if set, otherwise 8000
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { Server } from 'socket.io';
import * as http from 'http';
import path from 'path';

import answerController from './controller/answer';
import questionController from './controller/question';
import tagController from './controller/tag';
import commentController from './controller/comment';
import userController from './controller/user';
import googleAuthController from './controller/google';
import { FakeSOSocket } from './types';
import OpenAI from 'openai';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('JWT_SECRET is not defined in environment variables');
  process.exit(1);
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const MONGO_URL = `${process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017'}/fake_so`;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
const port = parseInt(process.env.PORT || '8000');

mongoose
  .connect(MONGO_URL)
  .catch(err => console.log('MongoDB connection error: ', err));

const app = express();
const server = http.createServer(app);
const socket: FakeSOSocket = new Server(server, {
  cors: { origin: '*' },
});

const openai = new OpenAI({
  organization: 'org-ILR5PGHDz2TMN7TbELizo9ld',
  project: 'proj_HRv67erRpJfTx2bUo3Qt7htF',
  apiKey: OPENAI_API_KEY,
});

function startServer() {
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

socket.on('connection', socket => {
  console.log('A user connected ->', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

process.on('SIGINT', () => {
  server.close(() => {
    mongoose.disconnect();
    console.log('Server closed.');
    process.exit(0);
  });
  socket.close();
});

app.use(
  cors({
    credentials: true,
    origin: [CLIENT_URL],
  }),
);

app.use(express.json());

app.post("/chat", async (req, res) => {
  const { prompt } = req.body;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
          {
            role: 'system',
            content: 'You are helping a user brainstorm questions for a forum called "Fake Stack Overflow". Please only respond in plain text',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
  });
  res.send(completion.choices[0].message.content);
});

app.get('/', (req: Request, res: Response) => {
  res.send('hello world');
  res.end();
});

app.use('/question', questionController(socket));
app.use('/tag', tagController());
app.use('/answer', answerController(socket));
app.use('/comment', commentController(socket));
app.use('/user', userController(socket, JWT_SECRET));
app.use('/api', googleAuthController(JWT_SECRET));

// Export the app instance
export { app, server, startServer, OPENAI_API_KEY };
