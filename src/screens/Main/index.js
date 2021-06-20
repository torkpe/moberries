import React, { useEffect, useState } from "react";
import Card from "../../components/Card";
import { getPlans } from "../../services/plans";
import "./index.scss";
import Select from "react-select";
import { gigabytes } from "../../utils/constants";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

export default function Main(props) {
  const initialData = {
    selectedPlan: 12,
    upfrontPayment: false,
    selectedLimit: "5",
  };
  const [plans, setPlans] = useState([]);
  const [payload, setPayload] = useState(initialData);
  const history = useHistory();
  const data = localStorage.getItem("data");

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    if (data) {
      const parsedData = JSON.parse(data);
      setPayload(parsedData);
    }
  }, [data]);

  async function fetchPlans() {
    try {
      const result = await getPlans();
      setPlans(result);
    } catch (error) {
      toast(error?.response?.message || "Something went wrong", {
        type: 'error'
      });
    }
  }

  const customStyles = {
    menu: (provided, state) => ({
      ...provided,
      width: "15rem",
      fontSize: "1.3rem",
      borderBottom: "1px dotted pink",
      color: state.selectProps.menuColor,
    }),

    control: (_, { selectProps: { width } }) => ({
      width: "15rem",
      display: "flex",
      fontSize: "1.3rem",
      border: "1px solid #EFEFEF",
      borderRadius: "4px",
    }),
  };

  const getTotalFee = () => {
    const plan = plans.find(
      (item) => item.duration_months === payload.selectedPlan
    );
    const totalFee =
      parseInt(payload.selectedLimit) * parseInt(plan?.price_usd_per_gb);
    let discountedPrice = totalFee;
    if (payload.upfrontPayment) {
      const discount = totalFee * 0.1;
      discountedPrice = totalFee - discount;
    }
    return { totalFee, discountedPrice };
  };

  const submit = () => {
    localStorage.setItem(
      "data",
      JSON.stringify({ ...payload, ...getTotalFee() })
    );
    history.push("/payment");
  };

  return plans.length ? (
    <div className="main-container">
      <div className="header">
        <h1>Select payment plan</h1>
      </div>
      <hr />
      <section className="content">
        {plans?.map((plan) => (
          <Card
            key={plan.duration_months}
            onClick={() =>
              setPayload({ ...payload, selectedPlan: plan.duration_months })
            }
            {...plan}
            isSelected={plan.duration_months === payload.selectedPlan}
          />
        ))}
      </section>
      <section className="content">
        <div className="limit">
          <div className="limit-label">Limit</div>
          <Select
            width={"5rem"}
            styles={customStyles}
            onChange={(e) => setPayload({ ...payload, selectedLimit: e.value })}
            placeholder="Limit"
            value={gigabytes.filter(
              (item) => item.value === payload.selectedLimit
            )}
            options={gigabytes}
          />
        </div>
      </section>
      <section className="content">
        <div className="upfront-payment">
          <input
            type="checkbox"
            onChange={(e) =>
              setPayload({
                ...payload,
                upfrontPayment: !payload.upfrontPayment,
              })
            }
            checked={payload.upfrontPayment}
          />
          <p className="question">I will like to make an upfront payment(Includes 10% discount)</p>
        </div>
      </section>
      {plans.length ? (
        <section className="content">
          <div className="card-container card-container__details">
            <div className="payment-row">
              <div className="payment-key">Fee</div>:{" "}
              <h1 className="payment-value">${getTotalFee().totalFee}</h1>
            </div>
            <div className="payment-row">
              <div className="payment-key">Total fee</div>:{" "}
              <h1 className="payment-value">
                ${getTotalFee().discountedPrice}
              </h1>
            </div>
            <div className="payment-row">
              <div className="payment-key">Duration</div>:{" "}
              <h1 className="payment-value">{payload.selectedPlan} Months</h1>
            </div>
          </div>
        </section>
      ) : (
        ""
      )}
      <section className="action-button">
        <button onClick={submit} className="btn">
          continue
        </button>
      </section>
    </div>
  ) : (
    ""
  );
}
