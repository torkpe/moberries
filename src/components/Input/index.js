import React from "react";
import './index.scss';

export default function Input(props) {
  return (
    <div className={props.isSmall ? "form-group form-group__small" : "form-group"}>
      <label className="form-label">{props.title}</label>
      <input
        className={props.error ? "form-input form-input__error" : "form-input"}
        name={props.name}
        type={props.type}
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder}
      />
      {props.error && <div className="error-message">{props.errorMessage}</div>}
    </div>
  );
}
