import React, { useContext, useEffect } from "react";
import { MyContext } from "../../MyContext";
import { useNavigate } from "react-router-dom";
export default function Cart() {
  const context = useContext(MyContext);
  console.log(context, "sd");
  let { cartItems, setCartItems } = context;
  useEffect(() => {
    let data = localStorage.getItem("books");
    setCartItems(JSON.parse(data));
  }, []);
  const navigate = useNavigate()
  const handleRent = async () => {
    if (cartItems.availableCopy > 0) {
      let req = {
        id: cartItems._id,
        count: cartItems.availableCopy - 1,
      };
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
      };
      let res = await fetch("http://localhost:5000/api/rent", requestOptions)
        .then((response) => response.json())
        .then((data) => {
          return data;
        });
        navigate('/home')
    }
  };
  return (
    <div style={{width:'fit-content',margin:'0 auto'}}>
        <h1>RENT YOUR BOOK {cartItems.name} NOW </h1>
      <div className="cardContainer" style={{width:"100%",marginTop:'2%'}}>
        <span
          className="genreSpan"
          style={
            cartItems.genre === "Fiction"
              ? { background: "red" }
              : cartItems.genre === "Dystopian "
              ? { background: "green" }
              : cartItems.genre === "Fantasy"
              ? { background: "#9a04ff" }
              : cartItems.genre === "Classic"
              ? { background: "#91514b" }
              : cartItems.genre === "Adventure"
              ? { background: "#63914d" }
              : cartItems.genre === "Epic"
              ? { background: "black" }
              : { background: "gray" }
          }
        >
          {cartItems.genre}
        </span>
        <p> {cartItems.name}</p>
        by {cartItems.author}
        <div>
          <span>{cartItems.year}</span>
        </div>
        <button onClick={() => handleRent()}>RENT NOW</button>
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    </div>
  );
}
