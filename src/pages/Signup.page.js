
/** @jsxImportSource @emotion/react */

import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/user.context";
import * as styles  from '../components/styles/Login.css'
import {LoginTextInput, FormGroup} from '../components/Form.components'
import {Image} from '../components/Image.components'
import {ButtonText} from '../components/Buttons.components'

function SignUpForm({onSubmit, buttonText}) {
    
  const [form, setForm] = useState({
      email: "",
      password: "",
      passwordConfirmation: ""
    });

    function handleChange(event) {
      const { id, value } = event.target;
      setForm((prevForm) => ({
        ...prevForm,
        [id]: value,
      }));
    }

  function handleSubmit() {
    onSubmit(form)
  }

  return (
    <form
      css={styles.formStyle}
    >
      <FormGroup>
        <LoginTextInput id="email" placeholder="Email" onChange={handleChange}/>
      </FormGroup>
      <FormGroup>
        <LoginTextInput id="password" type="password" placeholder="Password" onChange={handleChange}/>
      </FormGroup>
      <FormGroup>
        <LoginTextInput id="passwordConfirmation" type="password" placeholder="Repeat password" onChange={handleChange}/>
      </FormGroup>
      <FormGroup>
        <ButtonText 
        variant="login"  
        onClick={handleSubmit}
        disabled={form.email.length === 0 || form.password.length === 0 || form.passwordConfirmation.length === 0}
        >{buttonText}</ButtonText>
      </FormGroup>
    </form>
  )
}

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // As explained in the Login page.
  const { emailPasswordSignup } = useContext(UserContext);

  // As explained in the Login page.
  const redirectNow = () => {
    const redirectTo = location.search.replace("?redirectTo=", "");
    navigate(redirectTo ? redirectTo : "/");
  }

  // As explained in the Login page.
  const onSubmit = async (formData) => {
    try {
      const user = await emailPasswordSignup(formData.email, formData.password);
      if (user) {
        redirectNow();
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div css={styles.containerStyle}> 
      <div css={styles.loginConteinerStyle}>
        <div css={styles.loginHeaderStyle}>
          <h4 css={styles.headingLoginStyle} >CREATE ACCOUNT</h4>
          <Image imageName="dog_sit.png" width="40" height="50" />
        </div>
          <SignUpForm onSubmit={onSubmit} buttonText="Continue"/>
          <div css={styles.elementsInRow}>
            <p>Have an account already? <Link to="/login"  css={styles.linkSignup}>Login</Link></p>
          </div>
      </div>
    </div>
    )
}

export default Signup;