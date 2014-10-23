import webapp2 as webapp
import jinja2 as jinja
from google.appengine.api import memcache
import os,json,urllib2

TEMPLATE_DIR = os.path.join(os.path.dirname(__file__), 'static', 'templates')
WIDGET_DIR = os.path.join(os.path.dirname(__file__), TEMPLATE_DIR,'widgets')
DATA = os.path.join(os.path.dirname(__file__), TEMPLATE_DIR,'data.json')
EXTRA = os.path.join(os.path.dirname(__file__), TEMPLATE_DIR,'extra.json')
ASNs =  {"MIT": ("AS3","AS63")
		,"Stanford": ("AS32","AS46749")
		,"Google": ("AS36040","AS36492","AS36384","AS15169")
		# This is the real USC. Go Cocks
		,"USC": ("AS12005",)}

templater = jinja.Environment(
    loader=jinja.FileSystemLoader(TEMPLATE_DIR))

widgeter = jinja.Environment(
    loader=jinja.FileSystemLoader(WIDGET_DIR))

class Handler(webapp.RequestHandler):
	def get(self,scroll=''):
		self.response.headers['Content-Type'] = 'text/html'
		template = templater.get_template('index.html')
		thing = {"data":load(DATA),"extra":getExtra()}
		print thing
		self.response.write(template.render(data = load(DATA), extra = getExtra()))

def load(jsn):
	key = 'data%s' % jsn
	data = memcache.get(key)
	if not data:
		with open(jsn) as data_file:    
			data = json.load(data_file)
		if not memcache.add(key, data):
			logging.error('Memcache set failed.')
	return data

def getExtra():
	return load(EXTRA).get(lookup(os.environ["REMOTE_ADDR"]),[])

def lookup(ip):
	return match(get("http://ipinfo.io/%s/org" % ip))

def get(url):
	return urllib2.urlopen(url, None, 10).read().split(" ")[0]

def match(org):
	for asn in ASNs:
		for n in ASNs[asn]:
			if org == n:
				return asn
	return ""

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