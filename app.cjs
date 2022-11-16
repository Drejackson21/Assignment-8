const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const https = require('https');

const app = express();

// Bodyparser Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Static folder
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function(req,res){
  res.sendFile(__dirname + "/signup.html")
  })
// Signup Route
app.post('/signup', (req, res) => {
  const { firstName, lastName, email } = req.body;

  // Make sure fields are filled
  if (!firstName || !lastName || !email) {
    res.redirect('/fail.html');
    return;
  }

  // Construct req data
  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const postData = JSON.stringify(data);
  const URL="https://us18.api.mailchimp.com/3.0/lists/a0438c27a4"
  const option={

    method: 'POST',
    
      Authorization: 'auth: 7917be6b1d333fa6fe27548c9410c262-us18'
    

  }
  const request = https.request(URL, option, function(response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + '/success.html')
    }
    response.on("data", function(data){
      console.log(JSON.parse(data))
    })
  })
     
  request.write(postData)
  request.end()
      


    
      
      
    //.catch(err => console.log(err))
})

const PORT = process.env.PORT || 4000;

app.listen(PORT, console.log(`Server started on ${PORT}`));


