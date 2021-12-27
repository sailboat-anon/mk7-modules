#!/usr/bin/env python3 

import logging, datetime, random

from pineapple.modules import Module, Request

module = Module('wardriver', logging.DEBUG)

@module.handles_action('hello_world')
def hello_world(request: Request):
    return 'Hello, world!'

if __name__ == '__main__': 
    module.start()