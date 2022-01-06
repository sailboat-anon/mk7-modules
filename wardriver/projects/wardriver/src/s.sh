curl http://172.16.42.1:1471/api/pineap/settings \
    -X PUT \
   -H "Accept: application/json" \
   -H "Authorization: Bearer eyJVc2VyIjoicm9vdCIsIkV4cGlyeSI6IjIwMjItMDEtMDdUMTc6MTA6NTIuMDc4MjEwMjYzWiJ9.reo4S-lfiYxTTrsMRVRlwLmRIrbmfaPUmSW1sqc836Y=" \
   -d '{"mode": "advanced", "settings": {"enablePineAP": true, "autostartPineAP": true, "ap_channel": "11", "beacon_interval": "AGGRESSIVE", "beacon_response_interval": "AGGRESSIVE", "beacon_responses": true, "karma": true, "logging": true, "connect_notifications": false, "disconnect_notifications": false, "capture_ssids": true, "broadcast_ssid_pool": false, "pineap_mac": "5A:11:B0:A7:A9:09", "target_mac": "FF:FF:FF:FF:FF:FF"}}'