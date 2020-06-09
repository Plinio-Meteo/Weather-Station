# Wheater_Station_Project
This software interacts with weather stations and it transforms the data, gathered by 'rtl_433' , paired with a SDR, into graphs on a web server
# Requirements
**HARDWARE**
- Windows o Linux
- [A compatible dongle SDR](https://github.com/merbanan/rtl_433/blob/master/docs/HARDWARE.md), testated on chipset [`Realtek RTL2832`](https://www.rtl-sdr.com/buy-rtl-sdr-dvb-t-dongles/)
- Weather  sensors that detect the data and transmit them to 433MHz, [here a list of compatible sensors](file:///C:/Users/mY/Desktop/progetto/Supported%20device.md)

**SOFTWARE**
- [RTL_433](https://github.com/merbanan/rtl_433/)
- [Python3](https://www.python.it/)
- [Nodejs (con npm)](https://nodejs.org/it/)
- [Zadig](https://github.com/pbatard/libwdi/wiki/Zadig) (solo per Windows)
- rtl-sdr (solo per linux)
# Guide for Windows
- Connect the dongle SDR and install a **universal driver**:
  - run [Zadig](https://zadig.akeo.ie/) as administrator
  - go to `options` e select `List All Devices`
  - Select `Bulk-In, Interface (Interface 0)` from the list
  - Be sure that `WinUSB`is selected and click on `Replace Driver`
- Download the content of the main repository of the projetc.
-  Estract the content of archive**[rtl_433-win.zip](https://bintray.com/chzu/dist/rtl_433#files)** into the Weather_Station-master/`
- Open the shell **CMD** as administrator into `Wheater_Station-master` directory e give directions to download the dependences:
   - For Python3
    `pip install pandas`
    `pip install sqlite3`
    `pip install ast`
    `pip install json`
   - For Nodejs
   `npm install sqlite3`
   `npm install jquery`
   `npm install chart.js`
   `sudo npm install express`
   `sudo npm install helmet`
 - Run **the capture of the data and create the database**:
    - `python3 GetDB_UPDATED.py` 
 - Open a **local webserver**:
    - Open a shell into `Wheater_Station-master` directory
    - Type `node start_server.js`
 - Open localhost in the browser `127.0.0.1:PORT (DEFAULT=8000)`
 # Guide for Linux
 - **Install rtl-sdr:**
    - Open terminal into user directory `cd /home/"nomeutente"` and type:
       - `sudo apt-get update`
         `sudo apt-get install rtl-sdr`
         `sudo apt-get install libusb-1.0-0-dev git cmake`
         `git clone git://git.osmocom.org/rtl-sdr.git`
         `cd rtl-sdr/`
         `mkdir build`
         `cd build`
         `cmake ../ -DINSTALL_UDEV_RULES=ON`
         `make`
         `sudo make install`
         `sudo cp ../rtl-sdr.rules /etc/udev/rules.d/`
         `sudo ldconfig`
- **Install rtl_433:**
   - on Debian (sid) or Ubuntu(19.10+) give direction:
      - `apt-get install rtl-433`
   - For the other distributions follow this [link](https://repology.org/project/rtl-433/versions)
- Dowload the content of the main repository of the project
- Open terminal into `Wheater_Station-master` directory and give directions to **download dependences**:
   - For Python3
    `sudo pip3 install pandas`
    `sudo pip3 install sqlite3`
    `sudo pip install ast`
    `sudo pip install json`
   - ForNodejs
   `sudo npm install sqlite3`
   `sudo npm install jquery`
   `sudo npm install chart.js`
   `sudo npm install express`
   `sudo npm install helmet`
 - Run **the capture of the data and create the database**:
    - `sudo python3 GetDB_UPDATED.py` 
 - Open **a local webserver** :
    - Open a terminal into `Wheater_Station-master` directory and digit `sudo node start_server.js`
 - Go to localhost in the browser `http://127.0.0.1:PORT (DEFAULT=8000)`
 - Select the data that you want to display and choose unit of measure of the time

- if you see this **error**:
`"Kernel driver is active, or device is claimed by second instance of librtlsdr.
In the first case, please either detach or blacklist the kernel module
(dvb_usb_rtl28xxu), or enable automatic detaching at compile time."`
- Try to solve it with these commands:
  - `sudo tee --append /etc/modprobe.d/blacklist-dvb_usb_rtl28xxu.conf`
  - `sudo rmmod dvb_usb_rtl28xxu rtl2832`
# THE DATABASE
- it is a SQLITE database
- You can find it into `Wheater_Station-master` directory with a name `meteo_data.db`
- You can dispay the clean data through software like `DB Browser for SQLite`
# Configuration file
# THE BAROMETER
The barometer is realized with arduino. 
we built the barometer so that it could fulfill to assignments:

1. To capture the data of the pressure in the area
2. To send the captured data on the 433 MHz frequency

For the realization we used:
- ARDUINO UNO REV 3 (or Elegoo UNO R3)
- ADAFRUIT BMP180 Barometric Sensor (https://www.amazon.it/AZDelivery-elettrico-pressione-atmosferica-Raspberry/dp/B07D8S617X)
- AZDelivery 433 MHz Wireless Transmitter (https://www.amazon.it/AZDelivery-433-MHz-Funk-trasmettitore/dp/B076KN7GNB/)
With the choice of these componets we achived to obtain the data of the pressure with optimum precision and to sent them without the lost of signal in a range of about 4,5 m.

The following picture shows the scheme of costruction:
![e426d3eb46c5e859b8e24e5aa81fb722.png](:/3fa5f540037f487fbb255c5f71f7d0cd)

For the programming of the Arduino, we used the following code:

`
// Libraries for Barometer
#include <SFE_BMP180.h>
#include <Wire.h>
// Libraries for the antenna 433.39 Mhz
#include <RH_ASK.h>
#include <SPI.h>

// This as to be experimentally verified (but the average of 5.0/6.0 is good)
float x_calibrazione  = 5.0;

// I create the object to interact with the Barometer and set it with standard setup
SFE_BMP180 BMP;

// I create the object to interact with the antenna and set it with standard setup
RH_ASK driver;


void setup(){
  
    // I inizialized serial port 9600 Baud for the debugging
    Serial.begin(9600);

    // I inizialized the barometer and run antenna
    BMP.begin();
    driver.init();
    
}


void loop(){
  
    char status;
    double T, P;

    status = BMP.startTemperature();
    if(status != 0){
      // I wait that the measurement is completed 
      delay(status);

      // I pick up the value of the measurement and save it in the T variable
      // if the operation  has succeded this function returns 1, if it goas in a different way, the function returns 0

      // T is necessary to calculate the pressure

      status = BMP.getTemperature(T);
      if(status != 0){

        // Begin the mensurement of absolute pressure
        // I use the third option to have more accurate value

        status = BMP.startPressure(3);
        if(status != 0){
          
          // I wait that the measurement is completed
          delay(status);

          //  pick up the value of the measurement and save it in the P variable
    	// if the operation  has succeded this function returns 1, if it goas in a different way, the function returns 0

          status = BMP.getPressure(P, T);
          if(status != 0){
            
            // I put pressure in the second part of the payload
            
            String pressure = "";
            float p = int(P) + x_calibrazione;
            pressure = "'pressure_hPa' : " + String(p);
            
            String temperature = "";
            temperature = "'temperature_C' : " + String(T);
            
            // I assembly the payload and give it on 433.39 Mhz frequency
            String to_send = "";
            to_send = "{" + pressure +","+ temperature + "}";
            const char *msg = to_send.c_str();
            // Stamp in seriale per il debug //
            Serial.println(msg);
            // ----------------------------- //
            driver.send((uint8_t *)msg, strlen(msg));
            driver.waitPacketSent();
            
          }
          
          delay(5000); // Delay di 5 secondi per il cool down
          
        }
        
      }
      
    }
    
}
`

We chosed for the sensor "BMP 180" these libraries:
- SFE_BMP180.h
- Wire.h

We chosed for the trasmitter 433Mhz these libraries:
- RH_ASK.h
- SPI.h

BE CAREFUL: these libraries can only be used with the configuration shown in the previous picture.
-
