import './Register.css'
import '@coreui/coreui/dist/css/coreui.min.css'
import React from 'react'
import { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { app } from "../../../server/config";



// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

function updateUsername(e) {
  updateProfile(auth.currentUser, {
    displayName: e,
  }).then(() => {
    // Profile updated!
    // ...
  }).catch((error) => {
    // An error occurred
    // ...
  });
}


function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        if (password !== repeatPassword) {
            setPopupMessage('Passwords do not match');
            setShowPopup(true);
            return;
        }
        console.log('Username: ', username);
        console.log('Email: ', email);
        console.log('Password: ', password);
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            console.log('User:', user);
            updateUsername(username);
            // ...
            setPopupMessage('Account created successfully');
            setShowPopup(true);
            setTimeout(() => {
                window.location.href = '/Dashboard';
            }, 1500);
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Error:', errorCode, errorMessage);
            // ..
          });
            
        // }, successCallback, errorCallback);
    };

    const successCallback = (data) => {
        console.log('Success:', data);
        localStorage.setItem('token', data.Token);
        localStorage.setItem('username', data.UserName); // Store the username
        window.location.href = '/';
      }
  
      const errorCallback = (error) => {
          console.error('Error:', error);
      }

    return (
        <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center register-content">
          <CContainer>
            <CRow className="justify-content-center">
              <CCol md={9} lg={7} xl={6}>
                <CCard className="mx-4">
                  <CCardBody className="p-4">
                    <CForm onSubmit={handleSubmit}>
                      <h1>Register</h1>
                      <p className="text-body-secondary">Create your account</p>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput 
                            placeholder="Username" 
                            autoComplete="username" 
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>@</CInputGroupText>
                        <CFormInput 
                            placeholder="Email" 
                            autoComplete="email" 
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                            type="password"
                            placeholder="Password"
                            autoComplete="new-password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-4">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                            type="password"
                            placeholder="Repeat password"
                            autoComplete="new-password"
                            onChange={(e) => setRepeatPassword(e.target.value)}
                            required
                        />
                      </CInputGroup>
                      <div className="d-grid">
                        <CButton type='submit' color="primary">Create Account</CButton>
                      </div>
                    </CForm>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          </CContainer>
            {showPopup && (
                <CAlert className='popup' color='primary' dismissible visible={showPopup} onClose={() => setShowPopup(false)}>
                    <p>{popupMessage}</p>
                </CAlert>
            )}
        </div>
    )
}

export default Register