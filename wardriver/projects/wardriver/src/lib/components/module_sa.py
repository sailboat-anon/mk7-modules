#!/usr/bin/env python3 
# status functionality:  create python backend API->writes to /tmp/.292->async refresh (5) /tmp/.292->cleanup: write to history file after;  store as NDJSON
# when reloading history, can use JSON to populate widgets (how many APs?  which APs?  which clients? etc)

#create an engine that can parse through /tmp/.292 and collect the details after-the-fact
# 
# header { objid, datetime_start, datetime_paused_last, datetime_stopped, bssid_count, ap_count}  if datetime_stopped is unknown, use the last trigger fromm status history
# message { msg: ">doing this or doing that", msg_datetime: datetime }
# handshake { bssid: 'bs:si:id:ok:wi:th:me', type: 'full','partial'}
# {warn:">no APs in list have associated clients", msg_datetime: datetime}
# {err: ">we have a problem, shutting down", msg_datetime: datetime}


import logging, datetime, random, json
from pathlib import Path

def get_status_header(file_name):
    try:
        f = open(file_name, 'r')
    except:
        print(f">Could not open/read {f}")
        return -1
    for line in f:
        return json.loads(line)

def get_status_body(file_name):
    try:
        f = open(file_name, 'r')
    except:
        print(f">Could not open/read {f}")
        return -1

    firstline = 0
    json_line = []
    for line in f:
        if firstline == 0:
            firstline += 1
        else:
            json_line.append(json.loads(line))
    return json_line

def status_window_setup():
    right_now = datetime.datetime.now().strftime('%m-%d-%Y-%H-%M-%S')
    file_name = 'wd-scan-' + right_now + '.ndjson'
    file_already_exists = Path(file_name)
    if not file_already_exists.is_file():
        f = open(file_name, 'a')
        header = '{\"objid\": \"0001\", \"datetime\": \"' + right_now + '\", \"msg\": \"Welcome to Wardriver!\"}\n'
        body1 = '{\"type\": \"STATUS\", \"datetime\": \"' + right_now + '\", \"msg\":\"Scanning BSSID EL:IT:EH:AC:KR\"}\n'
        body2 = '{\"type\": \"WARN\", \"datetime\": \"' + right_now + '\", \"msg\":\"BSSID EL:IT:EH:AC:KR has no Associated Clients\"}\n'
        f.write(header)
        f.write(body1)
        f.write(body2)
    else:
        print(f'>err {right_now}: a peculiar thing has happened.  the syncronicities have collided.  fix your ntp server.')
    f.close()
    #parse_json_file_to_status_window(file_name, True)
    print(">Status Header:")
    print(get_status_header(file_name))
    print(">Status Body:")
    print(get_status_body(file_name))

status_window_setup()
