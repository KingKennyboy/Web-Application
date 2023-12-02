import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import format from "date-fns/format";
import { useState, useEffect } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFuelPricesContext } from "../../hooks/useFuelPricesContext";
import { useProfilesContext } from "../../hooks/useProfileContext";
import "./FuelQuote.css";

const FuelQuote = () => {
  const { dispatch } = useFuelPricesContext();
  const { dispatch2 } = useProfilesContext();
  const { user } = useAuthContext();
  const [gallonsReq, setGallonsReq] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [suggestedPrice, setSuggestedPrice] = useState("");
  const [totalAmountDue, setTotalAmountDue] = useState("");
  const [error, setError] = useState(null);
  const [backendData, setbackendData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleDateChange = (selectedDate) => {
    const formattedDate = format(selectedDate, "MM/dd/yyyy");
    setDeliveryDate(formattedDate);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch("http://localhost:3001/profile", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const json = await response.json();
      console.log(json);
      setbackendData(json);
      setIsLoading(false);

      if (response.ok) {
        dispatch({ type: "SET_PROFILES", payload: json });
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [dispatch, user]);

  const handleCalculation = () => {
    const gallons = parseFloat(gallonsReq);
    const price = parseFloat(suggestedPrice);

    if (!isNaN(gallons) && !isNaN(price)) {
      const calculatedTotal = gallons * price;
      setTotalAmountDue(calculatedTotal);
    } else {
      setTotalAmountDue("");
    }
  };

  useEffect(() => {
    // Check if relevant state values have changed
    if (gallonsReq !== "" && suggestedPrice !== "" && totalAmountDue !== "") {
      handleSubmit({ preventDefault: () => {} });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }
    handleCalculation();
    setDeliveryAddress(backendData[0].address1);

    const price = {
      gallonsReq,
      deliveryAddress,
      deliveryDate,
      suggestedPrice,
      totalAmountDue,
    };
    console.log(price);

    const response = await fetch("http://localhost:3001/prices", {
      method: "POST",
      body: JSON.stringify(price),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    console.log(price);
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }
    if (response.ok) {
      setgallonsReq("");
      setdeliveryAddress(null);
      setdeliveryDate("");
      setsuggestedPrice("");
      settotalAmountDue("");
      setError(null);
      dispatch({ type: "CREATE_FUELPRICE", payload: json });
    }
  };

  return (
    <form className="fQ" onSubmit={handleSubmit}>
      <h2>Fuel Quote</h2>
      <div class="row">
        <div class="col">
          {/* gallonsReq */}
          <h6>Gallons Requested</h6>
          <input
            type="text"
            id="gallonsReq"
            required
            onChange={(e) => setGallonsReq(e.target.value)}
            // onBlur={handleCalculation}
          />

          {/* deliveryAddress */}
          {backendData.length > 0 ? (
            <h6>Delivery Address: {backendData[0].address1}</h6>
          ) : (
            <p></p>
          )}

          {/* deliveryDate */}
          <h6>Delivery Date</h6>
          <DatePicker
            id="deliveryDate"
            placeholderText="Enter A Date"
            selected={deliveryDate ? new Date(deliveryDate) : null}
            dateFormat="MM/dd/yyyy"
            onChange={handleDateChange}
          />
        </div>
        <div class="col">
          {/* suggestedPrice */}
          <h6> <strong>Suggested Price</strong></h6>
          <input
            type="text"
            id="suggestedPrice"
            required
            onChange={(e) => setSuggestedPrice(e.target.value)}
            onBlur={handleCalculation}
          />

          {/* totalAmountDue */}
          <h6>Total Amount Due</h6>
          <input
            type="text"
            id="totalAmountDue"
            readOnly
            value={totalAmountDue}
          />
        </div>
      </div>
      <div>
        {gallonsReq != '' && deliveryDate ? (
          <div className="fQButton">
          <button onClick={handleCalculation} class="btn btn-primary">
            Get Quote
          </button>
          <button type="submit" class="btn btn-primary">
            Submit Quote
          </button>
          </div>
        ) : (
          <h1></h1>
        )}
       
      </div>
    </form>
  );
};

export default FuelQuote;
