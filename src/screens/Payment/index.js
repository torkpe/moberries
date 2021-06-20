import React, { useEffect, useState } from "react";
import Input from "../../components/Input";
import "./index.scss";
import { useHistory } from "react-router-dom";

export default function Payment(props) {
  const history = useHistory();
  const [payload, setPayload] = useState({
    cardNumber: "",
    expDate: "",
    securityCode: "",
  });
  const [errors, setErrors] = useState({
    cardNumber: false,
    expDate: false,
    securityCode: false,
  });
  const data = localStorage.getItem("data");

  useEffect(() => {
    if (data) {
      setPayload({ ...payload, ...JSON.parse(data) });
    }
  }, [data]);

  const formatCardNumber = (value) => {
    const regex = /^(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})$/g;
    const onlyNumbers = value.replace(/[^\d]/g, "");

    return onlyNumbers.replace(regex, (regex, $1, $2, $3, $4) =>
      [$1, $2, $3, $4].filter((group) => !!group).join(" ")
    );
  };

  const formatDate = (value) => {
    const regex = /^(\d{0,2})(\d{0,})$/g;
    const onlyNumbers = value.replace(/[^\d]/g, "");

    return onlyNumbers.replace(regex, (regex, $1, $2) =>
      [$1, $2].filter((group) => !!group).join("/")
    );
  };

  const onChange = (event) => {
    if (event.target.name === "cardNumber") {
      if (
        event.target.value.length > 19 ||
        !/^[0-9 ]*$/.test(event.target.value.trim())
      ) {
        return;
      }
    }
    if (event.target.name === "expDate") {
      if (
        event.target.value.length > 5 ||
        !/^[0-9 /]*$/.test(event.target.value.trim())
      ) {
        return;
      }
    }
    if (event.target.name === "securityCode") {
      if (
        event.target.value.length > 3 ||
        !/^[0-9]*$/.test(event.target.value.trim())
      ) {
        return;
      }
    }
    setPayload({
      ...payload,
      [event.target.name]: event.target.value.trim(),
    });
  };

  const submit = () => {
    const { cardNumber, expDate, securityCode } = payload;
    let formErrors = {};
    if (cardNumber.length < 19 || !/^[0-9 ]*$/.test(cardNumber)) {
      formErrors = {
        ...formErrors,
        cardNumber: true,
      };
    }
    if (expDate.length < 5 || !/^[0-9 /]*$/.test(expDate)) {
      formErrors = {
        ...formErrors,
        expDate: true,
      };
    }
    const splitExpDate = expDate.split('/');
    if (parseInt(splitExpDate[0]) > 12) {
      formErrors = {
        ...formErrors,
        expDate: true,
      };
    }
    if (parseInt(splitExpDate[1]) < 21) {
      formErrors = {
        ...formErrors,
        expDate: true,
      };
    }
    if (securityCode.length < 3 || !/^[0-9]*$/.test(securityCode)) {
      formErrors = {
        ...formErrors,
        securityCode: true,
      };
    }
    setErrors(formErrors);
    const hasErrors = Object.values(formErrors).some(item => item === true);
    if (hasErrors) {
      return
    }
    localStorage.setItem('data', JSON.stringify(payload));
    history.push('/summary');
  };

  return (
    <div className="main-container">
      <div className="header">
        <h1>Payment</h1>
      </div>
      <hr />
      <section className="content">
        <div className="payment-content">
          <Input
            title="Card number"
            placeholder="Card number"
            name="cardNumber"
            value={formatCardNumber(payload.cardNumber.trim())}
            onChange={onChange}
            placeholder="Card number"
            error={errors.cardNumber}
            errorMessage="Value must be 16 didgits"
          />
          <section className="content">
            <Input
              title="Expiration date"
              placeholder="Expiration date"
              isSmall={true}
              name="expDate"
              onChange={onChange}
              value={formatDate(payload.expDate)}
              placeholder="MM/YY"
              error={errors.expDate}
              errorMessage="Date is not valid"
            />
            <Input
              title="Security code"
              isSmall={true}
              name="securityCode"
              onChange={onChange}
              value={payload.securityCode}
              placeholder="123"
              errorMessage="Security code must be 3 digits"
              error={errors.securityCode}
            />
          </section>
        </div>
        <div className="card-container card-container__details">
          <div className="payment-row">
            <div className="payment-key">Fee</div>:{" "}
            <h1 className="payment-value">${payload.totalFee}</h1>
          </div>
          <div className="payment-row">
            <div className="payment-key">Total fee</div>:{" "}
            <h1 className="payment-value">${payload.discountedPrice}</h1>
          </div>
          <div className="payment-row">
            <div className="payment-key">Duration</div>:{" "}
            <h1 className="payment-value">{payload.selectedPlan} Months</h1>
          </div>
        </div>
      </section>
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
