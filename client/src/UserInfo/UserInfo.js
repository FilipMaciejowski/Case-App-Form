import React, { useState } from "react";
import axios from "axios";

import "./UserInfo.css";

const UserInfo = () => {
  const defaultFormFields = {
    name: "",
    email: "",
    phone: "",
    postCode: "",
    message: "",
  };

  const [formFields, setFormFields] = useState(defaultFormFields);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [validationErrors, setValidationErros] = useState([]);

  const handleInput = (e) => {
    setFormFields({ ...formFields, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    setValidationErros([]);
    e.preventDefault();
    const errors = [];
    if (formFields.name.length < 2) {
      errors.push("Navn må inneholde minst to bokstaver!");
    }
    if (formFields.phone.length < 8) {
      errors.push("Telefonnummer må inneholde åtte siffer!");
    }
    if (formFields.postCode.length < 4) {
      errors.push("Postnummer må inneholde fire siffer!");
    }
    if (errors.length > 0) {
      setValidationErros(errors);
    } else {
      try {
        await axios.post("/api/message", formFields);
        setFormFields(defaultFormFields);
        setFormSubmitted(true);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const errors = validationErrors.map((error) => (
    <li>
      <span className="Error">{error}</span>
    </li>
  ));

  const { name, email, phone, postCode, message } = formFields;

  return (
    <>
      <div className="Form__main">
        <span className="Form__name">Informasjon</span>
        <form onSubmit={(e) => handleSubmit(e)}>
          <label>Navn:</label>
          <input
            required
            type="text"
            name="name"
            value={name}
            placeholder="oppgi et navn"
            onChange={(e) => handleInput(e)}
          />
          <label>E-post:</label>
          <input
            required
            type="email"
            name="email"
            value={email}
            placeholder="oppgi epost"
            onChange={(e) => handleInput(e)}
          />
          <label>Telefon:</label>
          <input
            required
            type="number"
            name="phone"
            value={phone}
            placeholder="oppgi et telefonnummer"
            onChange={(e) => handleInput(e)}
          />
          <label>Postnummer:</label>
          <input
            required
            type="number"
            name="postCode"
            value={postCode}
            placeholder="oppgi et postnummer"
            onChange={(e) => handleInput(e)}
          />
          <label>Kommentar:</label>
          <textarea
            name="message"
            value={message}
            placeholder="skriv kommentar"
            onChange={(e) => handleInput(e)}
          />
          <button className="Btn" type="submit" value="Submit" block="true">
            Send inn!
          </button>

          <div></div>
        </form>
      </div>
      {validationErrors.length > 0 && <ul className="Error__box">{errors}</ul>}
      {formSubmitted && (
        <div className="Success__box">
          <div className="Sucess__icon"></div>Sendt!
        </div>
      )}
    </>
  );
};

export default UserInfo;
