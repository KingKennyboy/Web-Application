import React, { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useFuelPricesContext } from "../hooks/useFuelPricesContext";
const FuelQuoteHistory = () => {
  const { user } = useAuthContext();
  const {dispatch} = useFuelPricesContext()
  const [backendData, setbackendData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const fetchQuotes = async () => {
      const response = await fetch('http://localhost:3001/prices', {
        headers: {'Authorization': `Bearer ${user.token}`},
      })
      const json = await response.json()
      setbackendData(json)
      setIsLoading(false);

      if (response.ok) {
        dispatch({type: 'SET_FUELPRICES', payload: json})
      }
    }

    if (user) {
      fetchQuotes()
    }
  }, [dispatch, user])

  
  return (
    <div className="container">
      <h2>Fuel Quote History</h2>
      <div className="p-3 border bg-light">
        <div className="divTable">
          <div className="divTableBody">
            <div className="divTableRow">
              <div className="divTableCell"> <strong>Gallons Requested</strong></div>
              <div className="divTableCell"> <strong>Delivery Address</strong></div>
              <div className="divTableCell"> <strong>Delivery Date</strong></div>
              <div className="divTableCell"> <strong>Suggested Price</strong></div>
              <div className="divTableCell"> <strong>Total Amount Due</strong></div>
            </div>

            {isLoading ? (
              <div className="divTableRow">
                <div className="divTableCell">Loading...</div>
              </div>
            ) : (
              backendData.map((item) => (
                <div className="divTableRow" key={item._id}>
                  <div className="divTableCell">{item.gallonsReq}</div>
                  <div className="divTableCell">{item.deliveryAddress}</div>
                  <div className="divTableCell">{item.deliveryDate}</div>
                  <div className="divTableCell">{item.suggestedPrice}</div>
                  <div className="divTableCell">{item.totalAmountDue}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FuelQuoteHistory;
