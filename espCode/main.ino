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
Servo gun;

/* Just a little test message.  Go to http://192.168.4.1 in a web browser
   connected to this access point to see it.
*/
//Motor A
//Connect INPUT 1 to pin 1 -> GPIO 5
//Connect INPUT 2 to pin 2 -> GPIO 4

//Motor B
//Connect INPUT 3 to pin 3 -> GPIO 0
//Connect INPUT 4 to pin 4 -> GPIO 2
//Connect servo turret to pin 5 -> GPIO 14
//Connect servo gun to pin 6 -> GPIO 12
void handleRoot() {
  server.send(200, "text/html", "<h1>You are connected</h1>");
}

void RotateTurret(int x){
  turret.write(x);
}

void MoveTank(String dir){
  switch (dir)
  {
  case "forward":
    digitalWrite(5, HIGH);
    digitalWrite(0, HIGH);
    digitalWrite(4, LOW);
    digitalWrite(2, LOW);
    break;
  case "back":
    digitalWrite(4, HIGH);
    digitalWrite(2, HIGH);
    digitalWrite(0, LOW);
    digitalWrite(5, LOW);
    break;
  case "right":
    digitalWrite(5, HIGH);
    digitalWrite(4, HIGH);
    digitalWrite(0, HIGH);
    digitalWrite(2, LOW);
    break;
  case "left":
    digitalWrite(2, HIGH);
    digitalWrite(0, HIGH);
    digitalWrite(5, HIGH);
    digitalWrite(4, LOW);
  default:
    digitalWrite(2, LOW);
    digitalWrite(0, LOW);
    digitalWrite(5, LOW);
    digitalWrite(4, LOW);
    break;
  }
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
  StaticJsonDocument<200> resp;
  resp["ok"] = "Everything went ok";
  server.send(200,"text/plain", "");
}

void getTankValues() {
  String message = server.arg("plain");
  StaticJsonDocument<200> doc;
  deserializeJson(doc,server message);
  String direction = doc["direction"];
  MoveTank(direction);
  Serial.println(message);
  server.send(200, "text/plain","");
}

void shootState(){
  String message = server.arg("plain");
  StaticJsonDocument<200> doc;
  deserializeJson(doc,server message);
  String state = doc["state"];
  if(state == "arming"){
    gun.write(90);
  }else {
    gun.write(0);
  }
  Serial.println(message);
  server.send(200, "text/plain","");
}

void setup() {
  //delay(1000);
  pinMode(5, OUTPUT);
  pinMode(4, OUTPUT);
  pinMode(2, OUTPUT);
  pinMode(0, OUTPUT);
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
  server.on("/gun", HTTP_POST , shootState);
  server.begin();
  Serial.println("HTTP server started");
  WiFi.disconnect();
  turret.attach(14);
  gun.attach(12);
}

void loop() {
  server.handleClient();
}
