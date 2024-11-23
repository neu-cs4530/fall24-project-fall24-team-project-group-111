import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layout';
import Login from './login';
import EmailVerificationPage from './login/emailVerification';
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
import { FontProvider } from '../contexts/FontContext';
import { TTSProvider } from '../contexts/TTSContext';

// note: any settings-related provider must be wrapped in proctected route
// so that it may utilize User Context
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
    <LoginContext.Provider value={{ setUser }}>
      <TTSProvider>
        <Routes>
          {/* Public Route */}
          <Route path='/' element={<Login />} />
          <Route path='/verify-email' element={<EmailVerificationPage />} />
          <Route path='/account-recovery' element={<AccountRecoveryPage />} />
          <Route path='/reset-password' element={<PasswordResetPage />} />

          {/* Protected Routes */}
          {
            <Route
              element={
                <ProtectedRoute user={user} socket={socket}>
                  <ThemeProvider>
                    <FontProvider>
                      <Layout />
                    </FontProvider>
                  </ThemeProvider>
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
      </TTSProvider>
    </LoginContext.Provider>
  );
};

export default FakeStackOverflow;
