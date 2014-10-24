from google.appengine.ext import testbed
import unittest, utils

class UtilsTestCase(unittest.TestCase):

    def setUp(self):
        self.testbed = testbed.Testbed()
        self.testbed.activate()
        self.testbed.setup_env(app_id="dylanmadisetti")
        self.testbed.init_urlfetch_stub()

    def test_local(self):
        self.assertTrue(utils.isLocal())

    def test_targeting(self):
        ips = {
            "Google":"8.8.8.8"          # Le Googs
            ,"USC":"129.252.37.66"      # USC
            ,"MIT":"18.62.0.96"         # MIT
            ,"Stanford":"171.64.168.31" # Stanford
        }
        for ip in ips:
            self.assertTrue(utils.lookup(ips[ip]) == ip)

    def tearDown(self):
        self.testbed.deactivate()
