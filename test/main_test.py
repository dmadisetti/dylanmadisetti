from google.appengine.ext import testbed
import unittest, webtest, main

class MainTestCase(unittest.TestCase):

    def setUp(self):
        self.testbed = testbed.Testbed()
        self.testbed.activate()
        self.testbed.setup_env(app_id="dylanmadisetti")
        self.testbed.setup_env(REMOTE_ADDR="127.0.0.1")
        self.testapp = webtest.TestApp(main.app)

    def test_test(self):
        self.assertTrue(1 == 1)

    def test_200(self):
        tests = ["/","/?ip=thing"]
        for test in tests:
            self.assertTrue(self.testapp.get(test).status_int == 200)

    def test_404(self):
        test = "/urlthatdoesnotexist"
        self.assertTrue(self.testapp.get(test,expect_errors=True).status_int == 404)

    def test_targeting(self):
        tests = [
            "8.8.8.8"           # Le Googs
            ,"129.252.37.66"    # USC
            ,"18.62.0.96"       # MIT
            ,"171.64.168.31"    # Stanford
        ]
        for test in tests:
            self.testbed.setup_env(REMOTE_ADDR=test)
            self.assertTrue(self.testapp.get("/").status_int == 200)

    def tearDown(self):
        self.testbed.deactivate()
