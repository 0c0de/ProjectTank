#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include "string.h"
#include <ArduinoJson.h>
#include <Servo.h>;
/* Set these to your desired credentials. */
const char* ssid = "ESP-TANK";
const char* password = "asirfct2019";

ESP8266WebServer server(8080);
Servo turret;

/* Just a little test message.  Go to http://192.168.4.1 in a web browser
   connected to this access point to see it.
*/
void handleRoot() {
  server.send(200, "text/html", "<h1>You are connected</h1>");
}

void RotateTurret(int x){
  
}

double mapf(double val, double in_min, double in_max, double out_min, double out_max) {
    return (val - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

void getTurretValues() {
  String message = server.arg("plain");
  /*if(message == ""){
    server.send(200, "application/json", "{'err':'Argument is empty'}");
  }*/
  StaticJsonDocument<200> doc;
  deserializeJson(doc,server.arg("plain"));
  double x = doc["x"];
  double y = doc["y"];
  double mappedXVal = mapf(x, -1, 1, 0, 180);
  Serial.print("Mapped value from JSON is: ");
  Serial.println(mappedXVal);
  Serial.print("Position is in X is: ");
  Serial.print((double)doc["x"]);
  Serial.print(" and position in Y is: ");
  Serial.println((double)doc["y"]);
  turret.write((int)mappedXVal);
  /*StaticJsonDocument<200> resp;
  resp["ok"] = "Everything went ok";*/
  server.send(200,"text/plain", "");
}

void getTankValues() {
  String message;
  message = "Arugment number " + server.arg("plain");
  
  Serial.println(message);
  server.send(200, "text/plain","");
}

void setup() {
  //delay(1000);
  Serial.begin(115200);
  Serial.println();
  Serial.print("Configuring access point...");
  /* You can remove the password parameter if you want the AP to be open. */
  WiFi.softAP(ssid, password);

  IPAddress myIP = WiFi.softAPIP();
  Serial.print("AP IP address: ");
  Serial.println(myIP);
  server.on("/", handleRoot);
  server.on("/tank",HTTP_POST, getTankValues);
  server.on("/turret", HTTP_POST , getTurretValues);
  server.begin();
  Serial.println("HTTP server started");
  WiFi.disconnect();
  turret.attach(13);
}

void loop() {
  server.handleClient();
  RotateTurret(90);
}
