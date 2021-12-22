#!/usr/bin/env python3

import logging

from pineapple.modules import Module, Request

module = Module('custom_module', logging.DEBUG)

@module.handles_action('hello_world')
def hello_world(request: Request):
    return 'Hello, world!'

if __name__ == '__main__': 
    module.start()