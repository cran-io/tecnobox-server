var mongoose = require('mongoose');
var url;

if (process.env.NODE_ENV === 'production') {
  url = 'mongodb://localhost/tecnobox-prod';
} else if (process.env.NODE_ENV === 'development') {
  url = 'mongodb://localhost/tecnobox-dev';
} else if (process.env.NODE_ENV === 'test') {
  url = 'mongodb://localhost/tecnobox-test';
} else {
  //default url is for dev
  url = 'mongodb://localhost/tecnobox-dev';
}

mongoose.connect(url);