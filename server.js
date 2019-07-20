// server.js
// TEST PUBLISHING PROJECT INTO GITHUB
// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 9000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var mqtt = require('mqtt');
var deviceRoot = "demo/device/";
var collection,mqtt_client;
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var configDB = require('./config/database.js');
var http = require('http').Server(app);

//var io = require('socket.io')(http);
//----------------------------------------------------------------------------------
// MQTT Service
//----------------------------------------------------------------------------------
// MQTT Client config
mqtt_client = mqtt.connect(
{ 	
	host: 'localhost', 
	port: 1883, 
	keepalive: 60000,
	username: 'trieu.le',
	password: 'trieu.le',
	protocolId: 'MQIsdp',
	protocolVersion: 3
});
// MQTT Connect to Broker
mqtt_client.on('connect', function()
{
	console.log('Connected to Broker');
});
// Subcribe all topic
mqtt_client.subscribe('#');
// MQTT Incomming message parser
console.log("Connected to MQTT Broker !");
//mqtt_client.subscribe(deviceRoot+"+");
//mqtt_client.on('message', payload_paser);
// MQTT Close Handler
mqtt_client.on('close', function () 
{
  // Reconnect to Broker
  mqtt_client = mqtt.connect(
	{ 	
		host: 'localhost', 
		port: 1883, 
		keepalive: 60000,
		username: 'trieu.le',
		password: 'trieu.le',
		protocolId: 'MQIsdp',
		protocolVersion: 3
	});
});
// configuration ===============================================================
mongoose.Promise = global.Promise;
// MongoDB connection options
const connectOptions = { 
  useMongoClient: true,
  autoReconnect: true
};
// Create MongoDB connection
var db = mongoose.connection;
// Connecting to MongoDB 
db.on('connecting', function() 
{
	console.log('connecting to MongoDB...');
});
// Error issues during connect to MongoDB 
db.on('error', function(error) 
{
	console.error('Error in MongoDb connection: ' + error);
	mongoose.disconnect();
});
// Connected to MongoDB 
db.on('connected', function() 
{
	console.log('MongoDB connected!');
});
// Opened MongoDB connection success
db.once('open', function() 
{
	console.log('MongoDB connection opened!');
	
});
// Reconnecting to MongoDB 
db.on('reconnected', function () 
{
	console.log('MongoDB reconnected!');
});
// Disconnected to MongoDB 
db.on('disconnected', function() 
{
	console.log('MongoDB disconnected!');
	mongoose.connect(configDB.url, connectOptions);
});
// Connecting to MongoDB via URI with options
mongoose.connect(configDB.url, connectOptions);

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

// Connect_Flash in order to send messages from API to EJS paes 
app.use(require('connect-flash')());
/*app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});
*/
// HTML Views
app.use(express.static((__dirname + '/views')));

app.set('views',__dirname + '/views');
app.set('trust proxy', 1) // trust first proxy

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'smarthomecontroller', // session secret
    resave: true,
    saveUninitialized: true
}));

// Fix loi Access-Control-Allow-Origin
app.use(function(req, res, next) { res.header('Access-Control-Allow-Origin', "*");
	res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
})

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch app and socket.IO=====================================================
var server = app.listen(port);
var io = require('socket.io').listen(server);
console.log('The magic happens on port ' + port);


// Socket.IO ====================================================================

io.on('connection', function(socket){
  console.log('a user connected');
  //socket.emit('chat message', "Chao mung ban den voi Smart Home System !");
  
  //socket.emit('server message', "server message ******");
  socket.on('chat message', function(msg)
  {
		console.log('chat message: ' + msg);
		socket.emit('server message', msg);
		socket.broadcast.emit('server message', msg);
  });
  
  socket.on('disconnect', function()
  {
    console.log('user disconnected');
  });
  
 // Listen message from MQTT broker
  mqtt_client.on("message", (topic, message, packet) => {
    let light1_state = undefined;
    console.log('received data on topic %s , payload: %s', topic, message);
	// Send to WebSocket
	socket.emit("mqtt-message", { topic: topic, message: message.toString() });
	console.log('Send data to Socket');
    switch (topic) {
      case "home-yavuz/working-room/light-1/state":
        if (light1_state !== "ON" && message.toString().toLowerCase() === "on") {
          light1_state = "ON";
        }
        else if (light1_state !== "OFF" && message.toString().toLowerCase() === "off") {
          light1_state = "OFF";
        }

        // MQTT publish to broker
        //mqtt_client.publish("home-yavuz/working-room/light-1/state", light1_state, { qos: 1, retain: true });
        // Send to WebSocket
        socket.emit("mqtt-message", { topic: "home-yavuz/working-room/light-1/state", message: light1_state });
        break;     
    }

  }); // mqtt_client.on("message")
  
}); //io.on('connection')
// Pasing MQTT Payload =====================================================
function payload_paser(topic,message) {
	console.log("Received topic: " + topic);
	console.log("Received message: " + message);
	// Convert payload to String
	var stringBuf = message.toString('utf-8');
	
	try 
	{
		// Parser JSON Object
		var jsonData = JSON.parse(stringBuf);
		try
		{
			console.log("status: " + jsonData.status);
			if(jsonData.status  === "get")
			{
				var publish_options = 
				{
					  retain:false,
					  qos: 1
				};	
				mqtt_client.publish('SERVICE_STATUS', "MQTT_SERVICE IS WORING OK",publish_options);
				console.log("Publish message to topic SERVICE_STATUS");
			}
			else if(jsonData.SerialNumber  != null)
			{
				var timestampe = jsonData.DeviceTime;
				jsonData.DeviceTime = new Date(timestampe*1000);
				// Save data into MongoDB
				db.collection("sensors").insertOne(jsonData, function(err, res)
				{
					if (err) 
					{
						console.log("err: ",err);
						throw err;
					}
					console.log("1 record inserted");
					//db.close();
				});
			}
			else
			{
				// Save logs
				db.collection("logs").insertOne(jsonData, function(err, res)
				{
					if (err) 
					{
						console.log("err: ",err);
						throw err;
					}
					console.log("1 log inserted");
				});
			}
		}
		catch (e)
		{
			console.log("[Error] ",e);
		}
		
	} 
	catch (e)
	{
		console.log("[Error] Payload is not a JSON object ! ");
	}
}



// End of file ==================================================================