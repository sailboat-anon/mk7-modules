#!/usr/bin/env python3 
#todo: filter for 'Open' networks
import logging, json, requests, time, subprocess
from pineapple.modules import Module, Request

module = Module('wardriver', logging.DEBUG)

cycle = 0
scanid = None

@module.handles_action('basic_wardriver_flow')
def basic_wardriver_flow(request: Request):
    subprocess.call(['python', '/tmp/m.py'])
    return True

if __name__ == '__main__':
    module.start()