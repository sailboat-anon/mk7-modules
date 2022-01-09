#!/usr/bin/env python3 
#todo: filter for 'Open' networks
import logging, subprocess, os
from os.path import exists
from pineapple.modules import Module, Request

module = Module('wardriver', logging.DEBUG)

scan_pid = None
out_file = "/tmp/wd-out.log"
error_file = "/tmp/wd-error.log"
berserker_file = "/tmp/m.py"

@module.handles_action('get_berserker_scan_status')
def get_berserker_scan_status(request: Request):
    global out_file
    global error_file
    global berserker_file
    berserkerRunning = check_for_process(scan_pid) #if this doesnt work try  grep_output('ps -aux', 'pineap')
    if (berserkerRunning):
        if (exists(out_file) and exists(error_file)):
            f = open(out_file,"r")
            statusWindowMsg = f.readlines()
            f.close()
            f = open(error_file,"r")
            statusWindowMsg += f.readlines()
            f.close()
            return statusWindowMsg
        else:
            statusWindowMsg = "Cannot find output or error file.  Is berserker even running?"
    else:
        print('berserker is NOT running')
    #print('scan pid: ' +str(scan_pid))

@module.handles_action('basic_wardriver_flow')
def basic_wardriver_flow(request: Request):
    global scan_pid
    global out_file
    global error_file
    global berserker_file

    if os.path.exists(out_file):
        os.remove(out_file)
    if os.path.exists(error_file):
        os.remove(error_file)
    with open(out_file,"wb") as out, open(error_file,"wb") as err:
        proc = subprocess.Popen(['/usr/bin/python', berserker_file], stdout=out, stderr=err) 
        scan_pid = proc.pid
        return True

if __name__ == '__main__':
    module.start()