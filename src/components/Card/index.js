import React from "react";
import "./index.scss";

export default function Card(props) {
  return (
    <button
      className={
        props.isSelected
          ? "card-container card-container__selected"
          : `card-container`
      }
      onClick={props.onClick}
    >
      <h1>{props.duration_months} months</h1>
      <h3>${props.price_usd_per_gb} / GB</h3>
    </button>
  );
}
