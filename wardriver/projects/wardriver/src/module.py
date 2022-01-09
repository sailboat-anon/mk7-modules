#!/usr/bin/env python3 
#todo: filter for 'Open' networks
import logging, json, requests, time, subprocess
from pineapple.modules import Module, Request

module = Module('wardriver', logging.DEBUG)

cycle = 0
scanid = None
scan_pid = None

@module.handles_action('basic_wardriver_flow')
def basic_wardriver_flow(request: Request):
    global scan_pid
    with open("wd-out.log","wb") as out, open("wd-error.log","wb") as err:
        proc = subprocess.Popen(['/usr/bin/python', '/tmp/m.py >> /tmp/out.log'], stdout=out, stderr=err)  # https://code.luasoftware.com/tutorials/python/simple-guide-to-subprocess/
        scan_pid = proc.pid
        return True

if __name__ == '__main__':
    module.start()