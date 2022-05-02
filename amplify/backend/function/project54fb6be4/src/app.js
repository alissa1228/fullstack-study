/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/




const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});


/**********************
 * Example get method *
 **********************/

app.get('/item', function(req, res) {
  // Add your code here
  res.json({success: 'get call succeed!', url: req.url});
});

app.get('/item/*', function(req, res) {
  // Add your code here
  res.json({success: 'get call succeed!', url: req.url});
});

/*새 경로를 만들어 데이터 반환. 리스트 객체를 반환하는 /coins

해당 경로로 함수가 호출되면 coins를 키로 하고 코인의 정보를 갖고 있는 배열을 값으로 가진 객체를 반환.

app.get('/coins', function(req, res) {
  const coins = [
    {name: 'Bitcoin', symbol:'BTC', price_usd:'1000000'},
    {name: 'Ethereum', symbol:'ETH', price_usd:'400000'},
    {name: 'Klayton', symbol:'Klay', price_usd:'1300'},
  ]
  res.json({
    coins
  })
})
*/

const axios = require('axios');
app.get('/coins', function(req, res){
  //기본 url 정의
  let apiUrl = `https://api.coinlore.com/api/tickers/?start=0&limit=10`

  //쿼리스트링 매개변수가 있는 경우 기본 URL 수정

  //req 매개변수에는 event와 context 변수를 포함하는 apiGateway 속성이 있음.
  //방금 정의한 함수에서 event가 있는지 확인하고 event의 queryStringParameters 속성을 확인
  //속성이 있다면 해당 값을 사용해서 기본 url을 수정한다.
  
  if(req.apiGateway && req.apiGateway.event.queryStringParameters) {
    const {start = 0, limit=10} = req.apiGateway.event.queryStringParameters
    apiUrl =`https://api.coinlore.com/api/tickers/?start=${start}&limit=${limit}`
  }

  //api 호출 및 반환
  axios.get(apiUrl)
  .then((response)=>{
    res.json({coins : response.data.data})
  })
  .catch((err)=>{res.json({error: err})})
})

/****************************
* Example post method *
****************************/

app.post('/item', function(req, res) {
  // Add your code here
  res.json({success: 'post call succeed!', url: req.url, body: req.body})
});

app.post('/item/*', function(req, res) {
  // Add your code here
  res.json({success: 'post call succeed!', url: req.url, body: req.body})
});

/****************************
* Example put method *
****************************/

app.put('/item', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

app.put('/item/*', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

/****************************
* Example delete method *
****************************/

app.delete('/item', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.delete('/item/*', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
