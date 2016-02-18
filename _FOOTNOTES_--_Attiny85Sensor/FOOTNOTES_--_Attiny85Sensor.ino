 #include <Manchester.h>

/*

  Manchester Transmitter example
  
  In this example transmitter will send one 16 bit number per transmittion

  try different speeds using this constants, your maximum possible speed will 
  depend on various factors like transmitter type, distance, microcontroller speed, ...

  MAN_300 0
  MAN_600 1
  MAN_1200 2
  MAN_2400 3
  MAN_4800 4
  MAN_9600 5
  MAN_19200 6
  MAN_38400 7


*/

#define TX_PIN 3  //pin where your transmitter is connected
#define LED_PIN 0 //pin for blinking LED

uint16_t transmit_data = 10;

void setup() {
  pinMode(LED_PIN, OUTPUT);
  pinMode(4, INPUT);
  man.workAround1MhzTinyCore(); //add this in order for transmitter to work with 1Mhz Attiny85/84
  man.setupTransmit(TX_PIN, MAN_1200);
}

void loop() {
  int value = analogRead(2);
  if(value > 700) {
  man.transmit(transmit_data);
  digitalWrite(LED_PIN, HIGH);
}

else {
  digitalWrite(LED_PIN, LOW);
}
}
