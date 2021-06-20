import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Input from "../../components/Input";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.scss";
import { subscribeToPlan } from "../../services/plans";

export default function Summary(props) {
  const data = localStorage.getItem("data");
  const [payload, setPayload] = useState({
    email: "",
    agreedToTermsAndCondtions: false,
  });
  const [errors, setErrors] = useState({
    email: false,
    agreedToTermsAndCondtions: false,
  });
  const history = useHistory();

  useEffect(() => {
    if (data) {
      setPayload({ ...payload, ...JSON.parse(data) });
    }
  }, [data]);

  const validateEmail = (email) => {
    let emailRegex = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
    return emailRegex.test(String(email).toLowerCase());
  };

  const submit = async () => {
    let formErrors = {};
    if (!validateEmail(payload.email)) {
      formErrors = {
        ...formErrors,
        email: true,
      };
    }
    if (!payload.agreedToTermsAndCondtions) {
      formErrors = {
        ...formErrors,
        agreedToTermsAndCondtions: true,
      };
    }
    const hasErrors = Object.values(formErrors).some((item) => item === true);
    setErrors(formErrors)
    if (hasErrors) {
      return;
    }
    try {
      await subscribeToPlan(payload);
      localStorage.clear();
      history.push("/");
    } catch (error) {
      toast(error?.response?.message || "Something went wrong", {
        type: 'error'
      });
    }
  };

  const onChange = (event) => {
    setPayload({
      ...payload,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div className="main-container">
      <div className="header">
        <h1>Summary</h1>
      </div>
      <hr />
      <div className="card-container card-container__details card-container__summary">
        <div className="payment-row">
          <div className="payment-key">Fee</div>:{" "}
          <h1 className="payment-value">${payload.totalFee}</h1>
        </div>
        <div className="payment-row">
          <div className="payment-key">Total fee</div>:{" "}
          <h1 className="payment-value">${payload.discountedPrice} </h1>
          {payload.discountedPrice !== payload.totalFee && (
            <div className="payment-value"> (10% discount)</div>
          )}
        </div>
        <div className="payment-row">
          <div className="payment-key">Duration</div>:{" "}
          <h1 className="payment-value">{payload.selectedPlan} Months</h1>
        </div>
      </div>
      <Input
        title="Email"
        placeholder="Email"
        name="email"
        onChange={onChange}
        error={errors.email}
        errorMessage="Email is not valid"
      />
      <div className="agreement-container">
        <div className="upfront-payment">
          <input
            type="checkbox"
            onChange={(e) =>
              setPayload({
                ...payload,
                agreedToTermsAndCondtions: !payload.agreedToTermsAndCondtions,
              })
            }
            checked={payload.agreedToTermsAndCondtions}
          />
          <div className="question">
            By clicking this, I agree to the terms and conditons
          </div>
        </div>
        {errors.agreedToTermsAndCondtions && (
          <div className="error-message">This field is required</div>
        )}
      </div>
      <section className="action-button">
        <button onClick={() => history.goBack()} className="btn btn__back">
          back
        </button>
        <button onClick={submit} className="btn">
          continue
        </button>
      </section>
    </div>
  );
}
