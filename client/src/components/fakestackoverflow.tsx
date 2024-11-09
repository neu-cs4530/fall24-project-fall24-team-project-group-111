import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layout';
import Login from './login';
import AccountRecoveryPage from './login/accountRecovery';
import PasswordResetPage from './login/passwordReset';
import { FakeSOSocket, User } from '../types';
import LoginContext from '../contexts/LoginContext';
import UserContext from '../contexts/UserContext';
import QuestionPage from './main/questionPage';
import TagPage from './main/tagPage';
import NewQuestionPage from './main/newQuestion';
import NewAnswerPage from './main/newAnswer';
import AnswerPage from './main/answerPage';
import SettingsPage from './main/settings';
import { ThemeProvider } from '../contexts/ThemeContext';

const ProtectedRoute = ({
  user,
  socket,
  children,
}: {
  user: User | null;
  socket: FakeSOSocket | null;
  children: JSX.Element;
}) => {
  if (!user || !socket) {
    return <Navigate to='/' />;
  }

  return <UserContext.Provider value={{ user, socket }}>{children}</UserContext.Provider>;
};

/**
 * Represents the main component of the application.
 * It manages the state for search terms and the main title.
 */
const FakeStackOverflow = ({ socket }: { socket: FakeSOSocket | null }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <ThemeProvider>
      <LoginContext.Provider value={{ setUser }}>
        <Routes>
          {/* Public Route */}
          <Route path='/' element={<Login />} />
          <Route path='/account-recovery' element={<AccountRecoveryPage />} />
          <Route path='/reset-password/:token' element={<PasswordResetPage />} />

          {/* Protected Routes */}
          {
            <Route
              element={
                <ProtectedRoute user={user} socket={socket}>
                  <Layout />
                </ProtectedRoute>
              }>
              <Route path='/home' element={<QuestionPage />} />
              <Route path='tags' element={<TagPage />} />
              <Route path='/question/:qid' element={<AnswerPage />} />
              <Route path='/new/question' element={<NewQuestionPage />} />
              <Route path='/new/answer/:qid' element={<NewAnswerPage />} />
              <Route path='/settings' element={<SettingsPage />} />
            </Route>
          }
        </Routes>
      </LoginContext.Provider>
    </ThemeProvider>
  );
};

export default FakeStackOverflow;
