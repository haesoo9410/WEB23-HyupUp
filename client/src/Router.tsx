import React, { useEffect } from 'react';
import { Route, Switch, Redirect, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import MainPage from './pages/MainPage';
import WorkPage from './pages/WorkPage';
import { useRecoilState } from 'recoil';
import userAtom from '@/recoil/user';
import AdminPage from './pages/AdminPage';
import LogInPage from './pages/LogInPage';
import SignUpPage from './pages/SignUpPage';
import { getUser } from './lib/api/user';
import { taskSortByUpdate } from './lib/utils/sort';
import { UserState } from './contexts/userContext';
import { useMemo } from 'react';
import { useSocketSend } from '@/lib/hooks';

const Router = () => {
  const [userState, setUserState] = useRecoilState(userAtom);
  const emitLoginEvent = useSocketSend('LOGIN');
  useEffect(() => {
    if (!document.cookie.match('status')) return;
    (async () => {
      const userData = (await getUser('')) as UserState;
      if (userData.id) {
        userData.privateTasks!.sort((a, b) => taskSortByUpdate(a, b));
        userData.projectTasks!.sort((a, b) => taskSortByUpdate(a, b));
      }
      if (userData.projects && userData.projects?.length > 0) {
        userData.currentProjectId = userData.projects[0].id;
        userData.currentProjectName = userData.projects[0].name;
      }
      setUserState(userData);
    })();
  }, [setUserState]);

  useEffect(() => {
    if (!document.cookie.match('status') || !userState.id || !userState.organization) return;
    emitLoginEvent({ userId: userState.id, organizationId: userState.organization });
  }, [emitLoginEvent, userState]);

  const { search } = useLocation();
  const query = useMemo(() => new URLSearchParams(search), [search]);

  return (
    <>
      <Switch>
        <Route exact path="/" render={() => (userState?.email ? <MainPage /> : <LandingPage />)} />
        <Route
          exact
          path="/work"
          render={() => (userState?.email ? <WorkPage /> : <LandingPage />)}
        />
        <Route
          exact
          path="/setting"
          render={() => (userState?.email ? <AdminPage /> : <LandingPage />)}
        />
        <Route
          exact
          path="/login"
          render={() => (userState?.email ? <Redirect to="/" /> : <LogInPage />)}
        />
        <Route
          exact
          path="/signup"
          render={() =>
            userState?.email ? <Redirect to="/" /> : <SignUpPage token={query.get('token') ?? ''} />
          }
        />
        <Redirect from="*" to="/" />
      </Switch>
    </>
  );
};

export default Router;
