# Weather-Station
This software interacts with weather stations and it transforms the datas, gathered by 'rtl_433' , paired with a SDR, into graphs on a web server
# Requisiti
**HARDWARE**
- Windows o Linux
- [Un dongle SDR compatibile](https://github.com/merbanan/rtl_433/blob/master/docs/HARDWARE.md), testato su chipset [`Realtek RTL2832`](https://www.rtl-sdr.com/buy-rtl-sdr-dvb-t-dongles/)
- Sensori meteo che rilevano i dati e trasmettono sui 433MHz, [qui una lista](file:///C:/Users/mY/Desktop/progetto/Supported%20device.md)

**SOFTWARE**
- [RTL_433](https://github.com/merbanan/rtl_433/)
- [Python3](https://www.python.it/)
- [Nodejs (con npm)](https://nodejs.org/it/)
- [Zadig](https://github.com/pbatard/libwdi/wiki/Zadig) (solo per Windows)
- rtl-sdr (solo per linux)
# Guida per Windows
- Collegare il dongle SDR ed installare il **driver universale**:
  - Eseguire [Zadig](https://zadig.akeo.ie/) come amministratore
  - andare su `options` e selezionare `List All Devices`
  - Selezionare `Bulk-In, Interface (Interface 0)` dall'elenco
  - Assicurati che è selezionato `WinUSB` e clicca su `Replace Driver`
- Scaricare il contenuto della repository principale del progetto
-  Estrarre il contenuto dell'archivio **[rtl_433-win.zip](https://bintray.com/chzu/dist/rtl_433#files)** nella directory `Wheater_Station-master/`
- Aprire la shell **CMD** da amministratore nella directory `Wheater_Station-master` e dare i comandi per scaricare le dipendenze:
   - Per Python3
    `pip install pandas`
    `pip install sqlite3`
    `pip install ast`
    `pip install json`
   - Per Nodejs
   `npm install sqlite3`
   `npm install jquery`
   `npm install chart.js`
   `sudo npm install express`
   `sudo npm install helmet`
 - Avviare la **cattura dei dati e creare il database**:
    - `python3 GetDB_UPDATED.py` 
 - Aprire un **webserver locale** con i dati graficati in tempo reale:
    - Aprire una shell nella directory `Wheater_Station-master`
    - Digitare `node start_server.js`
 - Aprire il localhost nel browser `127.0.0.1:PORT (DEFAULT=8000)`
 # Guida per Linux
 - **Installare rtl-sdr:**
    - Aprire il terminale nella directory dell'utente `cd /home/"nomeutente"` e digitare:
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
- **Installare rtl_433:**
   - Su Debian (sid) o Ubuntu(19.10+) dare il comando:
      - `apt-get install rtl-433`
   - Per le altre distribuzioni seguire questo [link](https://repology.org/project/rtl-433/versions)
- Scaricare il contenuto della repository principale del progetto
- Aprire un terminale nella directory `Wheater_Station-master` e dare i comandi per **scaricare le dipendenze**:
   - Per Python3
    `sudo pip3 install pandas`
    `sudo pip3 install sqlite3`
    `pip install ast`
    `pip install json`
   - Per Nodejs
   `sudo npm install sqlite3`
   `sudo npm install jquery`
   `sudo npm install chart.js`
   `sudo npm install express`
   `sudo npm install helmet`
 - Avviare **la cattura dei dati e creare il database**:
    - `sudo python3 GetDB_UPDATED.py` 
 - Aprire un **webserver locale** con i dati graficati in tempo reale:
    - Aprire un terminale nella directory `Wheater_Station-master` e digitare `sudo node start_server.js`
 - andare nella pagina del localhost nel browser `http://127.0.0.1:PORT (DEFAULT=8000)`
 - Selezionare i dati che si vogliono visualizzare e scegliere l'unità di misura del tempo

- Se vedi questo **errore**:
`"Kernel driver is active, or device is claimed by second instance of librtlsdr.
In the first case, please either detach or blacklist the kernel module
(dvb_usb_rtl28xxu), or enable automatic detaching at compile time."`
- Prova a risolvere con questi comandi:
  - `sudo tee --append /etc/modprobe.d/blacklist-dvb_usb_rtl28xxu.conf`
  - `sudo rmmod dvb_usb_rtl28xxu rtl2832`
# Il DATABASE
- è un SQLITE database
- Si può trovare nella directory `Wheater_Station-master` con il nome `meteo_data.db`
- Si possono visualizzare in chiaro i dati tramite software come `DB Browser for SQLite`
# File di configurazione
# IL BAROMETRO
Il barometro è stato realizzato con arduino. 

Abbiamo costruito il barometro in modo tale che compiesse due compiti:
1. Catturare i dati relativi alla pressione nell'area di installazione 
2. Inviare i dati catturati sulla frequenza 433 MHz

Per la realizzazione abbiamo utilizzato:
- ARDUINO UNO REV 3 (oppure Elegoo UNO R3)
- ADAFRUIT BMP180 Barometric Sensor (https://www.amazon.it/AZDelivery-elettrico-pressione-atmosferica-Raspberry/dp/B07D8S617X)
- AZDelivery 433 MHz Wireless Transmitter (https://www.amazon.it/AZDelivery-433-MHz-Funk-trasmettitore/dp/B076KN7GNB/)

Con la scelta di questi componenti siamo riusciti ad ottenere i dati della pressione con un'ottima precisione ed inviarli senza perdita di segnale in un range di circa 4,50 m.

La seguente immagine mostra lo schema di costruzione:
![e426d3eb46c5e859b8e24e5aa81fb722.png](:/3fa5f540037f487fbb255c5f71f7d0cd)

Per la programmazione dell'Arduino abbiamo usato il seguente codice:

`
// Librerie per il Barometro
#include <SFE_BMP180.h>
#include <Wire.h>
// Librerie per l'antenna a 433.39 Mhz
#include <RH_ASK.h>
#include <SPI.h>

// Questo va verficato sperimentalmente (ma in media 5.0/6.0 va bene)
float x_calibrazione  = 5.0;

// Creo l'oggeto per richiamare il Barometro e lo imposto sul setup standard
SFE_BMP180 BMP;

// Creo l'oggeto per richiamare l'antenna e la imposto sul setup standard
RH_ASK driver;


void setup(){
  
    // Inizializzo porta seriale a 9600 Baud per il debugging
    Serial.begin(9600);

    // Inizializzo il barometro e avvio l'antenna
    BMP.begin();
    driver.init();
    
}


void loop(){
  
    char status;
    double T, P;

    status = BMP.startTemperature();
    if(status != 0){
      // Attendo che la misurazione sia completa 
      delay(status);

      // Raccolgo il valore della misurazione e lo metto nella varibile T
      // Se l'operazione ha succeso questa funzione restituisce 1, se avviene
      // diversamente la funzione restituisce 0
      // T è necessario per calcolare la pressione

      status = BMP.getTemperature(T);
      if(status != 0){

        // Comincio la misurazione della pressione assoluta
        // uso l'opzione 3 per avere la misurazione più lunga
        // e quindi la più accurata possibile
        // Per il resto funzione esattamenete come quella della temperatura

        status = BMP.startPressure(3);
        if(status != 0){
          
          // Attendo che la misurazione sia completa
          delay(status);

          // Raccolgo il valore della misurazione e lo metto nella varibile P
          // (questa funzione richiede per funzione anche T)
          // Se l'operazione ha succeso questa funzione restituisce 1, se avviene
          // diversamente la funzione restituisce 0

          status = BMP.getPressure(P, T);
          if(status != 0){
            
            // Metto la pressione nella seconda parte del payload da tramsettere
            
            String pressure = "";
            float p = int(P) + x_calibrazione;
            pressure = "'pressure_hPa' : " + String(p);
            
            String temperature = "";
            temperature = "'temperature_C' : " + String(T);
            
            // Compongo il payload e lo mando sulla frequenza 433.39 Mhz
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

Abbiamo scelto per il sensore BMP 180 le librerie:
- SFE_BMP180.h
- Wire.h

Per il trasmettitore a 433 MHz abbiamo scelto le librerie:
- RH_ASK.h
- SPI.h

NOTA BENE: l'uso di queste librerie consente solo la configurazione mostrata nella precedente figura
-


Abbiamo scelto per il sensore BMP 180 le librerie:
- SFE_BMP180.h
- Wire.h

Per il trasmettitore a 433 MHz abbiamo scelto le librerie:
- RH_ASK.h
- SPI.h

NOTA BENE: l'uso di queste librerie consente solo la configurazione mostrata nella precedente figura
-
