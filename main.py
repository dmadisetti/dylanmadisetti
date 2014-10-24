import webapp2 as webapp
import jinja2 as jinja
from google.appengine.api import memcache
import os, utils

TEMPLATE_DIR = os.path.join(os.path.dirname(__file__), 'static', 'templates')
DATA = os.path.join(os.path.dirname(__file__), TEMPLATE_DIR,'data.json')
EXTRA = os.path.join(os.path.dirname(__file__), TEMPLATE_DIR,'extra.json')

templater = jinja.Environment(
    loader=jinja.FileSystemLoader(TEMPLATE_DIR))

class Handler(webapp.RequestHandler):
	def get(self,scroll=''):
		self.response.headers['Content-Type'] = 'text/html'
		template = templater.get_template('index.html')
		requester = self.request.get("ip",os.environ["REMOTE_ADDR"]) if utils.isLocal() else os.environ["REMOTE_ADDR"]
		self.response.write(template.render(data = utils.load(DATA), extra = utils.getExtra(requester,EXTRA)))

class CacheKiller(webapp.RequestHandler):
	def get(self):
		self.response.headers['Content-Type'] = 'text/html'
		if memcache.flush_all():
			self.response.write('CacheKiller killed cache')
		else:
			self.response.write('CacheKiller couldn\'t kill cache')

def Handle404(request, response, exception):
	response.headers['Content-Type'] = 'text/html'
	response.set_status(404)
	template = templater.get_template('404.html')
	response.write(template.render({}))
	return

					
app = webapp.WSGIApplication([('/', Handler),('/killcache',CacheKiller)],debug=True)
app.error_handlers[404] = Handle404