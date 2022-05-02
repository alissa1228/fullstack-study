import React, { useEffect, useState } from "react";
import "./App.css";
import { API } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";

const App = () => {
  const [coins, updateCoins] = useState([]);

  //API 호출을 위한 함수 정의

  const fetchCoins = async () => {
    const data = await API.get("apife7d2e47", "/coins");
    updateCoins(data.coins);
  };

  //컴포넌트가 마운트 될 떄 함수 호출
  useEffect(() => {
    fetchCoins();
  }, []);

  return (
    <div>
      <h1>Hello World!</h1>
      {coins.map((coin, index) => (
        <div key={index}>
          <h2>
            {coin.name}- {coin.symbol}
          </h2>
          <h5>${coin.price_usd}</h5>
        </div>
      ))}
    </div>
  );
};

export default App;
