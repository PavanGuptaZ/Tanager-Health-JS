import PropTypes from 'prop-types';
import styles from '../styles/RegisterAndLoginPage.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import adminSrc from '../assets/images/admin.png'
import doctorSrc from '../assets/images/doctor.png'
import userSrc from '../assets/images/user.png';
import bgSrc from '../assets/images/tanager.png';
import { useContext, useEffect, useState } from 'react';
import { IoMdEyeOff, IoMdEye } from "react-icons/io";
import { emailPattern, namePattern, passwordPattern } from '../utils/regex';
import { toast } from 'react-toastify';
import DisplayValues from '../utils/json/RegisterAndLoginPageValues.json';
import { useMutation } from '@tanstack/react-query'
import RegisterAndLoginApi from '../apis/auth/RegisterAndLoginApi.js'
import { UserContext } from '../hooks/ContextProvider.jsx';
import { useGetUser } from '../hooks/index.js';
import favIcon from '../assets/images/favicon.ico';

const initialInputValues = { role: 1, name: "", email: "", password: "", password2: "", phone: "", terms: false, stayLogin: true }
const initialUiUpdatesValues = { checks: false, password: true, password2: true }

export const RegisterAndLoginPage = ({ type }) => {
  const [inputValues, setInputValues] = useState(initialInputValues)
  const [uiUpdates, setUichanges] = useState(initialUiUpdatesValues)

  const { dispatchData } = useContext(UserContext)
  const navigator = useNavigate()
  const location = useLocation()
  let user = useGetUser()

  useEffect(() => {
    setInputValues(initialInputValues)
    setUichanges(initialUiUpdatesValues)
  }, [location.pathname])

  useEffect(() => {
    if (user) {
      navigator('/')
    }
  }, [navigator, user])

  const RegisterAndLoginMutation = useMutation({
    mutationKey: [`${type}`],
    mutationFn: () => RegisterAndLoginApi(type, inputValues),
    onSuccess: (data) => {

      if (data.status === 'success') {
        dispatchData({ type: 'addUser', payload: data })
        toast.info("Welcome " + data.user.name, {
          icon: () => <img src={favIcon} className='tosterIcon' />
        })
      } else if (data?.message) {
        toast.warning(data.message, {
          icon: () => <img src={favIcon} className='tosterIcon' />
        })
      }
    }
  })
  const handleRegister = (e) => {
    e.preventDefault()
    if (nameCheck && EmailCheck01 && PasswordCheck && PasswordCheck02 && PhoneCheck) {
      RegisterAndLoginMutation.mutate()
    } else {
      toast.warning("Register failed, Check all input values", {
        icon: () => <img src={favIcon} className='tosterIcon' />
      })
    }
    setUichanges((prev) => ({ ...prev, checks: true }))
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (EmailCheck01 && PasswordCheck) {
      RegisterAndLoginMutation.mutate()
    } else {
      toast.error("login failed, Check all input values", {
        icon: () => <img src={favIcon} className='tosterIcon' />
      })
    }
    setUichanges((prev) => ({ ...prev, checks: true }))
  }

  let nameCheck = namePattern.test(inputValues.name.trim());
  let EmailCheck01 = emailPattern.test(inputValues.email.trim());
  let PasswordCheck = passwordPattern.test(inputValues.password.trim())
  let PasswordCheck02 = inputValues.password.trim() === inputValues.password2.trim() && inputValues.password2.trim().length > 3;
  let PhoneCheck = inputValues.phone < 10000000000 && inputValues.phone > 6999999999


  return (
    <div className={styles.RegisterAndLoginPageBox}>
      <div className={styles.diaplayContent}>
        <div className={styles.showPiece}>
          <img src={bgSrc} alt="" width={"100%"} style={{ margin: "auto" }} />
          <div className={styles.Mainheading}>{DisplayValues[type].title}</div>
        </div>
        <form className={styles.formBox} onSubmit={type === "register" ? handleRegister : handleLogin}>
          <div className={styles.roleBox}>
            <div className={styles.imageBox}>
              <div className={styles.image} style={{ transform: `translateX(-${inputValues.role - 1}00px)` }}>
                <img src={userSrc} className={styles.img} alt="" />
                <img src={doctorSrc} className={styles.img} alt="" />
                <img src={adminSrc} className={styles.img} alt="" />
              </div>
            </div>
            <div className={styles.roleSelector}>
              {DisplayValues[type].title} as role
              <select name="role" className={styles.roleInput} value={inputValues.role}
                onChange={(e) => setInputValues((prev) => ({ ...prev, role: e.target.value }))}>
                <option value={1}>User</option>
                <option value={2}>Doctor</option>
                {type !== "register" && <option value={3}>Admin</option>}
              </select>
            </div>
          </div>

          {type === "register" && <>
            <div className={styles.inputBox}>
              <label htmlFor="nameinput" className={styles.asideLabel}>Name</label>
              <input id='nameinput' type="text" placeholder='Name Input Here' className={styles.input}
                value={inputValues.name} onChange={(e) => setInputValues((prev) => ({ ...prev, name: e.target.value }))} />
            </div>
            {uiUpdates.checks && !nameCheck &&
              <div className={styles.warning}>one or two words, no extra spacing & between 5 to 30 characters.</div>}
          </>}

          <div className={styles.inputBox}>
            <label htmlFor="emailinput" className={styles.asideLabel}>Email</label>
            <input id='emailInput' type="email" placeholder='Email Input Here' className={styles.input}
              value={inputValues.email} onChange={(e) => setInputValues((prev) => ({ ...prev, email: e.target.value }))} />
          </div>
          {uiUpdates.checks && !EmailCheck01 &&
            <div className={styles.warning}>3 to 40 characters before &apos;@&apos;, total 50 characters.</div>}

          <div className={styles.inputBox}>
            <label htmlFor="passwordinput" className={styles.asideLabel}>Password</label>
            <div className={styles.eyeIcon} onClick={() => setUichanges((prev) => ({ ...prev, password: !uiUpdates.password }))}>
              {uiUpdates.password ? <IoMdEyeOff /> : <IoMdEye />}</div>
            <input id='passwordinput' type={uiUpdates.password ? "password" : "text"} placeholder='Password Input Here' className={styles.input}
              value={inputValues.password} onChange={(e) => setInputValues((prev) => ({ ...prev, password: e.target.value }))} />
          </div>
          {uiUpdates.checks && !PasswordCheck &&
            <div className={styles.warning}>no Spacing, atleast contain one capital, small letter, number and one from @, &, *, #, $, !, ? and limit of 3 to 20.</div>}

          {type === "register" && <>
            <div className={styles.inputBox}>
              <label htmlFor="password2input" className={styles.asideLabel}>Password again</label>
              <div className={styles.eyeIcon} onClick={() => setUichanges((prev) => ({ ...prev, password2: !uiUpdates.password2 }))}>
                {uiUpdates.password2 ? <IoMdEyeOff /> : <IoMdEye />}</div>
              <input id='password2input' type={uiUpdates.password2 ? "password" : "text"} placeholder='Password again Here' className={styles.input}
                value={inputValues.password2} onChange={(e) => setInputValues((prev) => ({ ...prev, password2: e.target.value }))} />
            </div>
            {uiUpdates.checks && !PasswordCheck02 &&
              <div className={styles.warning}>Both the Password should be same.</div>}

            <div className={styles.inputBox}>
              <label htmlFor="phoneinput" className={styles.asideLabel}>Phone Number</label>
              <input id='phoneinput' type="number" max={9999999999} min={6999999999}
                placeholder='Phone Number Input Here' className={styles.input + " " + styles.numberInput}
                value={inputValues.phone} onChange={(e) => setInputValues((prev) => ({ ...prev, phone: e.target.value }))} />
            </div>
            {uiUpdates.checks && !PhoneCheck &&
              <div className={styles.warning}>Valid 10 digits number.</div>}
          </>}

          <div className={styles.terms}>
            <input type="checkbox" name="terms" id="terms" className={styles.termsCheck}
              value={inputValues.terms} checked={inputValues.terms}
              onChange={() => setInputValues((prev) => ({ ...prev, terms: !inputValues.terms }))} />
            <label htmlFor="terms" >By clicking here, I state that I have read and understood the terms and conditions</label>
          </div>

          <div className={styles.terms}>
            <input type="checkbox" name="stayLogin" id="stayLogin" className={styles.termsCheck}
              value={inputValues.terms} checked={inputValues.stayLogin}
              onChange={() => setInputValues((prev) => ({ ...prev, stayLogin: !inputValues.stayLogin }))} />
            <label htmlFor="stayLogin" >By clicking here, I like to Stay Login</label>
          </div>

          <div className={styles.controlBox}>
            <div className={styles.changeMessage}>
              {DisplayValues[type].changemessage}&nbsp;
              <span className={styles.clickText} onClick={() => navigator(DisplayValues[type].link)}>
                {DisplayValues[type].linkname}
              </span>
            </div>

            <button type='submit' className={styles.submitBTN} disabled={RegisterAndLoginMutation.isFetching}>{DisplayValues[type].btnText}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

RegisterAndLoginPage.propTypes = {
  type: PropTypes.string.isRequired
}