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

  const handleCalculation = () => {
    const gallons = parseFloat(gallonsReq);
    const price = parseFloat(suggestedPrice);
    var margin = 0;
    if (gallons>1000){
      margin = (price*(0.02-0.01+0.02+0.1))
    }
    else{
      margin = (price*(0.02-0.01+0.03+0.1))
    }

    if (!isNaN(gallons) && !isNaN(price)) {
      const calculatedTotal = gallons * (price+margin);
      setTotalAmountDue(calculatedTotal);
    } else {
      setTotalAmountDue(""); 
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch('http://localhost:3001/profile', {
        headers: {'Authorization': `Bearer ${user.token}`},
      })
      const json = await response.json()
      console.log(json)
      setbackendData(json)
      setIsLoading(false);

      if (response.ok) {
        dispatch({type: 'SET_PROFILES', payload: json})
      }
    }

    if (user) {
      fetchProfile()
    }
  }, [dispatch, user])

   // Suggested Price = Current Price + Margin
   var currentPrice = 1.5
   var location = 0
   // doesn't need [0] in js code but does need it in the html code (after return statement)
   if (backendData.address1 == 'TX') {
     location = 0.02 
   }
   else {
    location = 0.04
   }
   var margin = currentPrice + location


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    const price = {
      gallonsReq,
      deliveryAddress,
      deliveryDate,
      suggestedPrice,
      totalAmountDue,
    };

    const response = await fetch("http://localhost:3001/prices", {
      method: "POST",
      body: JSON.stringify(price),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    console.log(price)
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
      <h2>Test: ${margin}</h2>
      <div class="row">
        <div class="col">
          {/* gallonsReq */}
          <h6>Gallons Requested</h6>
          <input
            type="text"
            id="gallonsReq"
            required
            onChange={(e) => setGallonsReq(e.target.value)}
            onBlur={handleCalculation}
          />

          {/* deliveryAddress */}
          {backendData.length > 0 ? (
          <h6>Delivery Address: {backendData[0].address1}</h6>
          ) : (
          <p></p>
          )}
          {/* <h6>address1: {backendData[0].address1}</h6> */}

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
          <h6>Suggested Price (change it to 1.5 constant)</h6>
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
      <div className="fQButton">
        <button type="submit" class="btn btn-primary">
          Calculate
        </button>
      </div>
    </form>
  );
};

export default FuelQuote;
