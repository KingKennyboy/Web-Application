import { useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useProfilesContext } from "../../hooks/useProfileContext";
import { useNavigate } from "react-router-dom";

const ProfileForm = ({checkNewUserStatus}) => {
  const { dispatch } = useProfilesContext();
  const { user } = useAuthContext();

  const [fullName, setfullName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setzipCode] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    const profile = {
      fullName,
      address1,
      address2,
      city,
      state,
      zipCode,
    };

    const response = await fetch("http://localhost:3001/profile", {
      method: "POST",
      body: JSON.stringify(profile),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    console.log(profile)
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      console.log('error: frontend data post req failed')
    }
    if (response.ok) {
      setError(null);
      dispatch({ type: "CREATE_PROFILE", payload: json });
      navigate("/displayProfile")
    }
  };

  return (
    <div className="container">
      <h2>Profile</h2>
      <form className="row p-3 border bg-light gap-1" onSubmit={handleSubmit}>
        {/* fullName */}
        <label className="row">Full Name</label>
        <input
          type="text"
          id="fullName"
          maxLength={50}
          required
          onChange={(e) => setfullName(e.target.value)}
        />

        {/* address1 */}
        <label className="row">
          Address 1
        </label>
        <input
          type="text"
          id="address1"
          required
          maxLength={100}
          onChange={(e) => setAddress1(e.target.value)}
        />

        {/* address2 */}
        <label className="row">
          Address 2
        </label>
        <input
          type="text"
          id="address2"
          maxLength={100}
          onChange={(e) => setAddress2(e.target.value)}
        />

        {/* city */}
        <label className="row">
          City
        </label>
        <input
          type="text"
          id="city"
          maxLength={100}
          onChange={(e) => setCity(e.target.value)}
        />
        <label className="row">State</label>

        {/* state */}
        <select
          defaultValue=""
          name="state"
          id="state"
          onClick={(e) => setState(e.target.value)}
          required
        >
          <option disabled value=""></option>
          <option value="AL">AL</option>
          <option value="AK">AK</option>
          <option value="AZ">AZ</option>
          <option value="AR">AR</option>
          <option value="CA">CA</option>
          <option value="CO">CO</option>
          <option value="CT">CT</option>
          <option value="DE">DE</option>
          <option value="DC">DC</option>
          <option value="FL">FL</option>
          <option value="GA">GA</option>
          <option value="HI">HI</option>
          <option value="ID">ID</option>
          <option value="IL">IL</option>
          <option value="IN">IN</option>
          <option value="IA">IA</option>
          <option value="KS">KS</option>
          <option value="KY">KY</option>
          <option value="LA">LA</option>
          <option value="ME">ME</option>
          <option value="MD">MD</option>
          <option value="MA">MA</option>
          <option value="MI">MI</option>
          <option value="MN">MN</option>
          <option value="MS">MS</option>
          <option value="MO">MO</option>
          <option value="MT">MT</option>
          <option value="NE">NE</option>
          <option value="NV">NV</option>
          <option value="NH">NH</option>
          <option value="NJ">NJ</option>
          <option value="NM">NM</option>
          <option value="NY">NY</option>
          <option value="NC">NC</option>
          <option value="ND">ND</option>
          <option value="OH">OH</option>
          <option value="OK">OK</option>
          <option value="OR">OR</option>
          <option value="PA">PA</option>
          <option value="RI">RI</option>
          <option value="SC">SC</option>
          <option value="SD">SD</option>
          <option value="TN">TN</option>
          <option value="TX">TX</option>
          <option value="UT">UT</option>
          <option value="VT">VT</option>
          <option value="VA">VA</option>
          <option value="WA">WA</option>
          <option value="WV">WV</option>
          <option value="WI">WI</option>
          <option value="WY">WY</option>
        </select>

        {/* zipCode */}
        <label className="row">
          Zipcode
        </label>
        <input
          type="text"
          id="zipCode"
          maxLength={9}
          minLength={5}
          pattern="\d*"
          required
          onChange={(e) => setzipCode(e.target.value)}
        />
        {/* Button */}
        <div className="pt-3">
          <button className="row btn btn-primary rounded-0">Submit</button>
        </div>
      </form>
    </div>
  );
};
export default ProfileForm;
