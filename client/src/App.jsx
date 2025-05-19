import { useState, useEffect } from 'react'
import './App.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.css';
import Navigation from './components/Navigation';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import API from './API';
import {
  DefaultLayout, MainLayout, ShowLayout, LoginLayout, RegisterLayout, NotFoundLayout,
  VerifierInfoLayout, VerifierApplyLayout, VerifierOkLayout, ProposeLayout,
  ProposeOkLayout, FaqLayout, ContactsLayout, Profile, LikedOkLayout, ToVerifyLayout, AccOkLayout, RejOkLayout
} from './components/PageLayout';

function App() {

  const [user, setUser] = useState(undefined);
  const [loggedIn, setLoggedIn] = useState(false);

  const [dirty, setDirty] = useState(true);

  const changeDirty = (newDirty) => {
    setDirty(newDirty);
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // here you have the user info, if already logged in
        const user = await API.getUserInfo();
        setLoggedIn(true);
        setUser(user);
      } catch (err) {
        // NO need to do anything: user is simply not yet authenticated
        //handleError(err);
      }
    };
    checkAuth();
  }, []);


  const loginSuccessful = (user) => {
    setUser(user);
    setLoggedIn(true);
    setDirty(true);
  }

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUser(undefined);
    setDirty(true);
  }



  return (
    <BrowserRouter>
      <Container fluid className='navcss'>
        <Navigation user={user} loggedIn={loggedIn} logout={doLogOut} changeDirty={changeDirty} />
        <Routes>
          <Route path="/" element={<DefaultLayout />} >
            <Route index element={<MainLayout user={user} loggedIn={loggedIn} dirty={dirty} changeDirty={changeDirty} />} />
            <Route path='/search/:searchParam?' element={<MainLayout user={user} loggedIn={loggedIn} dirty={true} changeDirty={changeDirty} />} />
            <Route path='/profile' element={<Profile user={user} loggedIn={loggedIn} dirty={true} changeDirty={changeDirty} />} />
            <Route path='show/:pageId' element={<ShowLayout user={user} loggedIn={loggedIn} changeDirty={changeDirty} />} />
            <Route path='verifierInfo' element={<VerifierInfoLayout user={user} loggedIn={loggedIn} changeDirty={changeDirty} />} />
            <Route path='verifierApply' element={<VerifierApplyLayout loginSuccessful={loginSuccessful} changeDirty={changeDirty} />} />
            <Route path='verifierOk' element={<VerifierOkLayout loginSuccessful={loginSuccessful} changeDirty={changeDirty} />} />
            <Route path='accOk' element={<AccOkLayout loginSuccessful={loginSuccessful} changeDirty={changeDirty} />} />
            <Route path='rejOk' element={<RejOkLayout loginSuccessful={loginSuccessful} changeDirty={changeDirty} />} />
            <Route path='show/:pageId/likedOk' element={<LikedOkLayout loginSuccessful={loginSuccessful} changeDirty={changeDirty} />} />
            <Route path='proposeOk' element={<ProposeOkLayout loginSuccessful={loginSuccessful} changeDirty={changeDirty} />} />
            <Route path='toverify/:Id' element={<ToVerifyLayout user={user} loggedIn={loggedIn} loginSuccessful={loginSuccessful} changeDirty={changeDirty} />} />
            <Route path='propose' element={<ProposeLayout loggedIn={loggedIn} loginSuccessful={loginSuccessful} changeDirty={changeDirty} />} />
            <Route path='login' element={loggedIn ? <Navigate replace to='/' /> : <LoginLayout loginSuccessful={loginSuccessful} changeDirty={changeDirty} />} />
            <Route path='register' element={loggedIn ? <Navigate replace to='/' /> : <RegisterLayout loginSuccessful={loginSuccessful} changeDirty={changeDirty} />} />
            <Route path='faq' element={<FaqLayout changeDirty={changeDirty} />} />
            <Route path='contacts' element={<ContactsLayout changeDirty={changeDirty} />} />
            <Route path='*' element={<NotFoundLayout changeDirty={changeDirty} />} />
          </Route>
        </Routes >
      </Container >
    </BrowserRouter >
  )
}

export default App
