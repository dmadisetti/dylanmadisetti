import unittest
from google.appengine.ext import testbed

class DemoTestCase(unittest.TestCase):

    def setUp(self):
        self.testbed = testbed.Testbed()
        self.testbed.activate()

    def test_choice(self):
        self.assertTrue(1 == 1)

    def tearDown(self):
        self.testbed.deactivate()
