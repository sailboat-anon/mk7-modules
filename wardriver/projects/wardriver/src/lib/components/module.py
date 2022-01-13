#!/usr/bin/env python3 
#todo: filter for 'Open' networks
# pip3 install requests
import logging, subprocess, os, signal, json
from pineapple.modules import Module, Request
from pineapple.helpers import command_helpers as cmd

module = Module('wardriver', logging.DEBUG)

recon_scan_id = None
scan_pid = None
scan_toggle = False
out_file = "/tmp/wd-out.log"
error_file = "/tmp/wd-err.log"
berserker_file = "/pineapple/modules/wardriver/m.py"
berserker_file_grep = "python" # this wont pass review; check_for_process runs pgrep -l and it wont find our script

@module.handles_action('get_recon_scan_details')
def get_recon_scan_details(request: Request):
    s = requests.Session()
    auth = dict()
    auth["username"] = "root"
    auth["password"] = "test"
    authResp = s.post("http://172.16.42.1:1471/api/login", json.dumps(auth)).json()
    if (authResp["token"] != None):
        s.headers.update({'Authorization': 'Bearer '+authResp["token"]})
    else:
        print('no token')
        exit -1
    api_call = "http://172.16.42.1:1471/api/recon/status/"
    scanResp = s.get(api_call).json()
    if (scanResp.scanRunning):
        api_call = "http://172.16.42.1:1471/api/recon/scans/" + str(scanResp.scanID)
        scanIDResp = s.get(api_call).json()
        return scanIDResp

@module.handles_action('kill_berserker')
def kill_berserker(request: Request):
    global scan_pid
    scan_pid_grep = '/proc/' + str(scan_pid)
    if os.path.exists(scan_pid_grep):
        os.kill(scan_pid, signal.SIGTERM)
        scan_pid = None

@module.handles_action('scan_toggle_check')
def scan_toggle_check(request: Request):
    global scan_toggle
    global berserker_file
    global berserker_file_grep
    global scan_pid
    scan_pid_grep = '/proc/' + str(scan_pid)
    if os.path.exists(scan_pid_grep):
        return True
    return False

@module.handles_action('get_berserker_scan_status')
def get_berserker_scan_status(request: Request):
    global out_file
    global berserker_file
    global berserker_file_grep
    global scan_toggle
    global scan_pid

    scan_pid_grep = '/proc/' + str(scan_pid)
    if os.path.exists(scan_pid_grep):
        berserkerRunning = True
    else:
        berserkerRunning = False
    if berserkerRunning:
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
                str1 += '- ' + element
            return str1
        #else:
            #statusWindowMsg = "Cannot find output or error file.  Is berserker even running?"
    else:
        print('berserker is NOT running')
        return "Berserker module locked and loaded!"
    #print('scan pid: ' +str(scan_pid))

@module.handles_action('basic_berserker_flow')
def basic_berserker_flow(request: Request):
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