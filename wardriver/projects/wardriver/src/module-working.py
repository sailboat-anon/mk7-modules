#!/usr/bin/env python3 

import logging, datetime, random, json
from pathlib import Path

# build logic
# set_aggro()
# run_scand()
def set_aggro():
    pineAP_aggro_settings = { 'mode': 'advanced', 'settings': { 
        'ap_channel': '11', 
        'autostart': True,
        'autostartPineAP': True,
        'beacon_interval': 'AGGRESSIVE',
        'beacon_response_interval': 'AGGRESSIVE',
        'beacon_responses': True,
        'broadcast_ssid_pool': True,
        'capture_ssids': True,
        'connect_notifications': False,
        'disconnect_notifications': False,
        'enablePineAP': True,
        'karma': True,
        'logging': True,
        'pineap_mac': '5A:11:B0:A7:A9:09',
        'target_mac': 'FF:FF:FF:FF:FF:FF' 
        }
    }
    print(pineAP_aggro_settings)

set_aggro()