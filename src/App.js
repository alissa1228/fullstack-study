import React, { useEffect, useState } from "react";
import "./App.css";
import { API } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";

const App = () => {
  const [coins, updateCoins] = useState([]);
  
  //limit 및 start에 대한 사용자 입력을 저장할 상태 추가.
  const [input, updateInput] = useState({limit: 5, start:0});

  //사용자가 입력값을 수정할 수 있는 함수 
  const updateInputValues = (type, value) => {
    updateInput({...input, [type]:value});
  }


  //API 호출을 위한 함수 정의 (limit 및 start 이용할 수 있게 함수 수정)

  const fetchCoins = async () => {
    const {limit, start} = input;
    const data = await API.get("apife7d2e47", `/coins?limit=${limit}&start=${start}`);
    updateCoins(data.coins);
  };

  //컴포넌트가 마운트 될 떄 함수 호출
  useEffect(() => {
    fetchCoins();
  }, []);

  return (
    <div>
      <h1>Hello World!</h1>
      <input 
      onChange={e => updateInputValues('limit', e.target.value)}
      placeholder='limit'
      />
            <input 
      onChange={e => updateInputValues('start', e.target.value)}
      placeholder='start'
      />
      <button onClick={fetchCoins}>클릭!</button>
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
