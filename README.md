# CryptoBuzz

[Link to website](http://ec2-18-222-37-129.us-east-2.compute.amazonaws.com/)
Username: test
Password: pass

CryptoBuzz is a webapp that helps you compare google search trends with cryptocurrency prices. It does this with the aid of the Google Trends API and CryptoCompare API. CryptoCompare is written for Node.Js and uses bootstrap extensively.

### Requirements

* HTML5/CSS Requirements

Node.js uses .ejs files for storing the HTML5. The most top level HTML-files are located in the "views" folder. You will see references to other ejs files for templating purposes. These partial HTML files can be found in the views/partials folder. When the web server renders the webpage it is a properly formed HTML5 document. The css information can be found in the public/stylesheets folder

* Conisistency of design

As mentioned above, I am making use of templating to give a consistent look, I am also using default bootstrap styling for most of the application.

* "Logged in" features

The charting mechanic is only viewable when logged in. When the user is logged in, the "Login" button in the navbar is replaced with "Welcome username"

* PHP compliance

As discussed in person and over email, Professor Wergeles let me use node.js instead of PHP

* GET/POST behaviour

Get Methods: 
/get_data?startDate=&endDate=&currencyId
For retrieving data for the graph
/login
Get the login page
/register
Get the register page

Post Methods:
/login
For loging in
/register
For registering

The server side code for these calls can be found in app.js

* User feedback

When inputing email addresses into register, it checks if is properly formatted

* Photos

The background image and chart image can be seen once logging in.

* Embedded youtube videos

The welcome page has two youtube videos explaining what cryptocurrencies are

* Javascript/jQuery/bootstrap

My client-side javascript can be found in public/javascripts, I make use of jQuery here. I made extensive use of javascript on the server side. Most of my controls on the webapp are bootstrap controls (can be found in any of the partial views).

* AJAX

The method to retrieve data for the graph is done asynchronously.

### Screenshots


