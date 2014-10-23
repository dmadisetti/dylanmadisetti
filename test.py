#!/usr/bin/python
import optparse
import sys
import nose

USAGE = """%prog SDK_PATH TEST_PATH
Run unit tests for App Engine apps.

Just make sure you have nose"""


def main(sdk_path, test_path):
    sys.path.insert(0, sdk_path)
    import dev_appserver
    dev_appserver.fix_sys_path()
    suite = nose.loader.TestLoader().discover(test_path)
    nose.run(suite)

if __name__ == '__main__':
    SDK_PATH = "./google_appengine/"
    TEST_PATH = "./test"
    main(SDK_PATH, TEST_PATH)
