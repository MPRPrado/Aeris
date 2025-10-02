#include <WiFi.h>

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("=== DESCOBRIR MAC ADDRESS ESP32 ===");
  
  // Não precisa conectar WiFi, só inicializar
  WiFi.mode(WIFI_STA);
  
  String mac = WiFi.macAddress();
  Serial.println("MAC Address do seu ESP32:");
  Serial.println(mac);
  Serial.println("==================================");
  Serial.println("Use este MAC como esp_id no sistema!");
}

void loop() {
  // Nada aqui
}