#!/usr/bin/env python3 

import logging, datetime, random, json
from pathlib import Path
from pineapple.modules import Module, Request

module = Module('wardriver', logging.DEBUG)

@module.handles_action('hello_world')
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

def get_status_file(file_name):
    try:
        f = open(file_name, 'r')
    except:
        print(f">Could not open/read {f}")
        return -1

def status_window_setup():
    right_now = datetime.datetime.now().strftime('%m-%d-%Y-%H-%M-%S')
    file_name = 'wd-scan-' + right_now + '.json'
    file_already_exists = Path(file_name)
    if not file_already_exists.is_file():
        f = open(file_name, 'a')
        js_string = str('{ "header": {"objid": "0001", "datetime": "12-26-2021-16-24-10", "msg": "Welcome to Wardriver!"},"messages": [{"type": "STATUS", "datetime": "12-26-2021-16-24-10", "msg":"Scanning BSSID EL:IT:EH:AC:KR"},{"type": "WARN", "datetime": "12-26-2021-16-24-10", "msg":"BSSID EL:IT:EH:AC:KR has no Associated Clients"}]}')
        f.write(js_string)
    else:
        print(f'>err {right_now}: a peculiar thing has happened.  the syncronicities have collided.  fix your ntp server.')
    f.close()
    return file_name

if __name__ == '__main__': 
    module.start()