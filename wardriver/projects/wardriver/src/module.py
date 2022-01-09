#!/usr/bin/env python3 
#todo: filter for 'Open' networks
import logging, subprocess, os
from pineapple.modules import Module, Request

module = Module('wardriver', logging.DEBUG)

scan_pid = None
out_file = "/tmp/wd-out.log"
error_file = "/tmp/wd-error.log"

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
    global out_file
    global error_file

    if os.path.exists(out_file):
        os.remove(out_file)
    if os.path.exists(error_file):
        os.remove(error_file)
    with open(out_file,"wb") as out, open(error_file,"wb") as err:
        proc = subprocess.Popen(['/usr/bin/python', '/tmp/m.py'], stdout=out, stderr=err)  # https://code.luasoftware.com/tutorials/python/simple-guide-to-subprocess/
        scan_pid = proc.pid
        return True

if __name__ == '__main__':
    module.start()