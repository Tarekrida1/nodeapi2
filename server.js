const express = require("express");
const dotenv = require("dotenv");
const logger = require('./middleware/logger');
const path = require('path');
const morgan = require('morgan');
const connectDB = require('./config/db');
const colors = require('colors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');

// load env
dotenv.config({ path: "./config/config.env" });

// connect to database
connectDB();

// route files 
const bootcamps = require('./api/bootcamps/routes/bootcamp');
const courses = require('./api/courses/routes/course');
const auth = require('./api/users/routes/auth');



const app = express();

// Body Parser
app.use(express.json());

// cookie parser
app.use(cookieParser());
// app.use(logger);

// dev logging middleware
if (process.env.NODE_DEV === 'development') {
    app.use(morgan('dev'));  
}

// file upload 
// default options
app.use(fileUpload());

// set static folder
// app.use(express.static(path.join(__dirname, 'public')))
app.use('/public', express.static(path.join(__dirname, 'public')))
// app.use('/', express.static(__dirname + '/public/'));
// console.log(path.join(__dirname, '/public'));
// mount routes
app.use('/bootcamps', bootcamps);
app.use('/courses', courses);
app.use('/auth', auth);
app.get('/', (req, res) => {
  res.setHeader('content-type', 'text/html');

  res.write(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>first node js api</title>
  </head>
  <body>
      <h3>hello world from my first node js api</h3>
  <p>my api now Contains</p>
  <ol>
      <li>  <a href="/employees">Employees</a></li>
      <li>  <a href="/auth">Login</a></li>
      <li>  <a href="/users">Registration</a></li>
      <li>admin permissions rol : like delete employee</li>
  </ol>
  <table>
    <tbody>
      <tr>
        <td>GET</td>
        <td>
          <a href="/employees">/employees</a>
        </td>
      </tr>
      <tr>
          <td>POST</td>
          <td>
            <a href="/employees">/employees</a>
          </td>
        </tr>
        <tr>
          <td>DELETE</td>
          <td>
            <a href="/employees/1">/employees/1 ( admin only )</a>
          </td>
        </tr>
        <tr>
          <td>Registration ( POST )</td>
          <td>
            <a href="/users">/users</a>
          </td>
        </tr>
      
      <tr>
        <td>Login ( POST )</td>
        <td>
          <a href="/auth">/auth</a>
        </td>
      </tr>
    
    
      <tr>
          <td>User Profile ( GET )</td>
          <td>
            <a href="/users/profile">/User Profile</a>
          </td>
        </tr>
    
    </tbody>
  </table>
  
  </body>
  </html>

  `);
  res.end();
});



app.use(errorHandler);

const PORT = process.env.PORT || 8080;

const  server = app.listen(
  PORT,
  console.log(`Server Rurining in ${process.env.NODE_DEV} mode on port ${PORT}`.yellow.bold)
);


// handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
   console.log(`Error: ${err.message}`.red);
   // Close server & exist process
   server.close(() => process.exit(1));

})