#!/usr/bin/env python3 
#todo: filter for 'Open' networks
import logging, subprocess
import pathlib
from pineapple.modules import Module, Request
from pineapple.helpers import command_helpers as cmd

module = Module('wardriver', logging.DEBUG)

scan_pid = None
scan_toggle = False
out_file = "/tmp/wd-out.log"
error_file = "/tmp/wd-err.log"
berserker_file = "/tmp/m.py"

@module.handles_action('get_scan_toggle_status')
def get_scan_toggle_status(request: Request):
    global scan_toggle
    global berserker_file
    berserkerRunning = cmd.grep_output('ps -aux', berserker_file) 
    if len(berserkerRunning) > 1:
        scan_toggle = True
        return True 
    else:
        scan_toggle = False
        return False

@module.handles_action('get_berserker_scan_status')
def get_berserker_scan_status(request: Request):
    global out_file
    global berserker_file
    global scan_toggle
    if get_scan_toggle_status:
        f = open(out_file,"r")
        statusWindowOut = f.readlines()
        f.close()
        f = open(error_file,"r")
        statusWindowErr = f.readlines()
        f.close()
        statusWindowMsg = statusWindowOut + statusWindowErr
        if statusWindowMsg:
            str1 = ""
            for element in statusWindowMsg:
                str1 += element
            return str1
        #else:
            #statusWindowMsg = "Cannot find output or error file.  Is berserker even running?"
    else:
        print('berserker is NOT running')
        scan_toggle = False
    #print('scan pid: ' +str(scan_pid))

@module.handles_action('basic_wardriver_flow')
def basic_wardriver_flow(request: Request):
    global scan_pid
    global out_file
    global error_file
    global berserker_file

    try:
        out = open(out_file, 'w+')
    except Exception as e:
        print(e)
    try:
        err = open(error_file, 'w+')
    except Exception as e:
        print(e)
    try:
        proc = subprocess.Popen(['/usr/bin/python', berserker_file], stdout=out, stderr=err) 
        scan_pid = proc.pid
        return True
    except Exception as e:
        print(e)

if __name__ == '__main__':
    module.start()