#!/usr/bin/env python3 
#todo: filter for 'Open' networks
import logging, subprocess
from pineapple.modules import Module, Request

module = Module('wardriver', logging.DEBUG)

scan_pid = None

@module.handles_action('poll_berserker_process')
def poll_berserker_process(request: Request):
    berserkerRunning = check_for_process(scan_pid)
    if (berserkerRunning):
        print('berserker is running')
    else:
        print('berserker is NOT running')
    print('scan pid: ' +str(scan_pid))

@module.handles_action('basic_wardriver_flow')
def basic_wardriver_flow(request: Request):
    global scan_pid
    with open("/tmp/wd-out.log","wb") as out, open("/tmp/wd-error.log","wb") as err:
        proc = subprocess.Popen(['/usr/bin/python', '/tmp/m.py'], stdout=out, stderr=err)  # https://code.luasoftware.com/tutorials/python/simple-guide-to-subprocess/
        scan_pid = proc.pid
        return True

if __name__ == '__main__':
    module.start()