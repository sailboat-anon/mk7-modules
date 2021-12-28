#!/usr/bin/env python3 

import logging, datetime, random, json
from pathlib import Path
from pineapple.modules import Module, Request

module = Module('wardriver', logging.DEBUG)

@module.handles_action('build_status_file')
def build_status_file(request: Request):
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

@module.handles_action('get_status_file')
def get_status_file(request: Request):
    f = open(request.file_name, 'r')
    data = f.read()
    f.close()
    json_data = json.loads(data)
    return json_data  # send the whole JSON object

if __name__ == '__main__': 
    module.start()