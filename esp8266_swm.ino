#include <ESP8266WiFi.h>
#include <WiFiClient.h>

#define UART_BAUD 115200

#define MODE_AP 

// For AP mode:
const char *ssid = "SWMDN80_WIFI";  // You will connect your phone to this Access Point
const char *pw = ""; // and this is the password
IPAddress ip(192, 168, 0, 1); // From RoboRemo app, connect to this IP
IPAddress netmask(255, 255, 255, 0);
const int port = 80; // and this por
//////////////////////////////////////////////////

WiFiServer server(port);
WiFiClient client;


uint8_t buf1[1024];
uint8_t i1=0;

uint8_t buf2[1024];
uint8_t i2=0;



void setup() {

  delay(500);
  
  Serial.begin(UART_BAUD);

  //AP mode (phone connects directly to ESP) (no router)
  WiFi.mode(WIFI_AP);
  WiFi.softAPConfig(ip, ip, netmask); // configure ip address for softAP 
  WiFi.softAP(ssid, pw); // configure ssid and password for softAP
  server.begin(); // start TCP server  
}


void loop() {

  if(!client.connected()) { // if client not connected
    client = server.available(); // wait for it to connect
    return;
  }

  // here we have a connected client

  if(client.available()) {
    while(client.available()) {
      buf1[i1] = (uint8_t)client.read(); // read char from client (RoboRemo app)
      if(i1<1023) i1++;
    }
    // now send to UART:
    Serial.write(buf1, i1);
    i1 = 0;
  }

  if(Serial.available()) {
    while(Serial.available()) {
      buf2[i2] = (char)Serial.read(); // read char from UART
      if(i2<1023) i2++;
    }
    // now send to WiFi:
    client.write((char*)buf2, i2);
    i2 = 0;
  }
  
}
