"""

@author: RoboticaPlinio

"""

# Il codice va ancora commentato, formalizzato e ottimizzato, però è utilizzabile al 100%
# P.S. consiglio di cambiare il path del db per ogni test
# P.P.S il codice ha come cmd predefinito il comando per windows, quindi cambietelo
# P.P.P.S. in futuro cercherò di far riconoscere il prorgamma l'OS in automatico,
# e quindi di fargli prendere il comando giusto in automatico

import sys
from subprocess import PIPE, Popen, STDOUT
from threading import Thread
import sqlite3
from sqlite3 import Error
import pandas as pd
import json
import ast


def get_data(queue):
    try:

        src, line = queue.get(timeout=1)

        return line

    except Empty:

        return None


def cleaning_process(data):
    if data is not None:

        data = data.decode("utf-8")

        useful_data = [
            "Oregon-v1",
            "Oregon-WGR800",
            "Oregon-THGR810",
            "RadioHead-ASK"
        ]

        for keyword in useful_data:
            if keyword in data:
                data = json.loads(data)
                break

        if type(data) is dict:

            useless_keys = [
                "brand",
                "id",
                "battery_ok",
                "battery",
                "type",
                "state",
                "flags",
                "repeat",
                "radio_clock",
                "mic",
                "test",
                "from",
                "len",
                "to",
                "len"
            ]

            keys = data.keys()
            for key in useless_keys:
                if key in keys:
                    del data[key]
            if "payload" in keys:
                payload = data["payload"]
                payload = [chr(inf) for inf in payload]
                payload = "".join(payload)
                payload = ast.literal_eval(payload)
                del data["payload"]
                for key in payload.keys():
                    data[key] = payload[key]
            if "temperature_F" in keys:
                value = float(data["temperature_F"])
                data["temperature_C"] = round(((value-16)*(5/9)),1)

            datetime = (((data["time"]).replace(":", "")).replace("-", "")).replace(" ", "")

            new_data = dict(
                datetime=f"{datetime[:4]}-{datetime[4:6]}-{datetime[6:8]} {datetime[8:10]}:{datetime[10:12]}:{datetime[12:]}",
                year=datetime[:4],
                month=datetime[4:6],
                day=datetime[6:8],
                hour=datetime[8:10],
                minutes=datetime[10:12],
                second=datetime[12:]
            )

            del data["time"]

            for key in data.keys():
                new_data[key] = data[key]
            data = new_data

            return data

        else:
            return False

    else:
        return False


def create_db_connection(path):
    try:
        connection = sqlite3.connect(path)
        return connection
    except Error as e:
        print(e)
        return False


def extract_models(data):
    data = pd.DataFrame(data)
    return list(dict.fromkeys(data["model"]))


def to_sql(connection, mixed_data):

    models = extract_models(mixed_data)
    for model in models:
        to_append_to_sql = []
        for data in mixed_data:
            if model in data.values():
                to_append_to_sql.append(data)
        to_append_to_sql = pd.DataFrame(to_append_to_sql)
        to_append_to_sql.to_sql(
            f"{model}",
            con=connection,
            if_exists="append",
            index=False
        )


    temperature = [info for info in mixed_data if "temperature_C" in info.keys()]
    humidity = [info for info in mixed_data if "humidity" in info.keys()]
    pressure = [info for info in mixed_data if "pressure_hPa" in info.keys()]
    wind = [info for info in mixed_data if "wind_max_m_s" in info.keys()]

    temperature_keys = [
        "datetime",
        "year",
        "month",
        "day",
        "hour",
        "minutes",
        "second",
        "model",
        "temperature_C"
    ]

    new_temperature = []
    for info in temperature:
        new_info = {}
        for key in info.keys():
            if key in temperature_keys:
                new_info[key] = info[key]
        new_temperature.append(new_info)
    temperature = new_temperature

    if len(temperature) > 0:
        temperature = pd.DataFrame(temperature)
        temperature.to_sql("Temperature", con=connection, if_exists="append", index=False)

    humidity_keys = [
        "datetime",
        "year",
        "month",
        "day",
        "hour",
        "minutes",
        "second",
        "model",
        "humidity"
    ]

    new_humidity = []
    for info in humidity:
        new_info = {}
        for key in info.keys():
            if key in humidity_keys:
                new_info[key] = info[key]
        new_humidity.append(new_info)
    humidity = new_humidity

    if len(humidity) > 0:
        humidity = pd.DataFrame(humidity)
        humidity.to_sql("Humidity", con=connection, if_exists="append", index=False)

    pressure_keys = [
        "datetime",
        "year",
        "month",
        "day",
        "hour",
        "minutes",
        "second",
        "model",
        "pressure_hPa"
    ]

    new_pressure = []
    for info in pressure:
        new_info = {}
        for key in info.keys():
            if key in pressure_keys:
                new_info[key] = info[key]
        new_pressure.append(new_info)
    pressure = new_pressure

    if len(pressure) > 0:
        pressure = pd.DataFrame(pressure)
        pressure.to_sql("Pressure", con=connection, if_exists="append", index=False)

    wind_keys = [
        "datetime",
        "year",
        "month",
        "day",
        "hour",
        "minutes",
        "second",
        "model",
        "wind_max_m_s",
        "wind_avg_m_s",
        "wind_dir_deg"
    ]

    new_wind = []
    for info in wind:
        new_info = {}
        for key in info.keys():
            if key in wind_keys:
                new_info[key] = info[key]
        new_wind.append(new_info)
    wind = new_wind

    if len(wind) > 0:
        wind = pd.DataFrame(wind)
        wind.to_sql("Wind", con=connection, if_exists="append", index=False)

if __name__ == '__main__':

    # INIT process

    connection = create_db_connection("meteo_data.db")

    cmd = ["rtl_433", "-F", "json"]
    on_posix = "posix" in sys.builtin_module_names

    try:
        from Queue import Queue, Empty
    except ImportError:
        from queue import Queue, Empty


    def enqueue_output(src, out, queue):
        for line in iter(out.readline, ""):
            queue.put((src, line))
        out.close()


    p = Popen(
        cmd,
        stdout=PIPE,
        stderr=STDOUT,
        bufsize=1,
        close_fds=on_posix
    )
    q = Queue()

    t = Thread(
        target=enqueue_output,
        args=(
            "stdout",
            p.stdout,
            q
        )
    )

    t.daemon = True
    t.start()

    while True:
        data = get_data(q)
        print(f"Captured Data:\n{data}")
        data = cleaning_process(data)

        to_add = []
        if type(data) is dict:
            to_add.append(data)
            print("---> Data inserted in DB")
            to_sql(connection, to_add)
            to_add = []

