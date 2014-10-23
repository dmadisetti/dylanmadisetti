import webapp2 as webapp
import jinja2 as jinja
from google.appengine.api import memcache
import os,json,urllib2

templater = jinja.Environment(
    loader=jinja.FileSystemLoader(os.path.join(os.path.dirname(__file__), 'static', 'templates')))

widgeter = jinja.Environment(
    loader=jinja.FileSystemLoader(os.path.join(os.path.dirname(__file__), 'static', 'templates','widgets')))


class Handler(webapp.RequestHandler):
	def get(self,scroll=''):
		self.response.headers['Content-Type'] = 'text/html'
		template = templater.get_template('index.html')
		self.response.write(template.render(data = getData(),path=None))

def getData():
	# Check cache first
	cached = memcache.get('data')
	if not cached == None:
		return cached

	rawdata = json.load(urllib2.urlopen('http://webinfo.herokuapp.com/dylanmadisetti.com', None, 10))['data'];
	data = {}
	widgets = []
	pieces = []
	for piece in rawdata:
		widget = widgeter.get_template(piece + '.html')
		widgets.append(widget.render(name=piece,content = rawdata[piece]))
		pieces.append(piece)
	data['widgets'] = widgets
	data['pieces'] = pieces
	if not memcache.add('data', data):
		logging.error('Memcache set failed.')
	return data;

class CacheKiller(webapp.RequestHandler):
	def get(self):
		self.response.headers['Content-Type'] = 'text/html'
		if memcache.flush_all():
			self.response.write('CacheKiller killed cache')
		else:
			self.response.write('CacheKiller couldn\'t kill cache')

def Handle404(request, response, exception):
	data = getData()
	# Trim the /
	path = request.path[1:]
	i = 0
	response.headers['Content-Type'] = 'text/html'
	while i < len(data['pieces']):
		if data['pieces'][i].lower() == path.lower():
			template = templater.get_template('index.html')
			response.write(template.render(data = data,path=data['pieces'][i]))
			return
		i += 1
	response.set_status(404)
	template = templater.get_template('404.html')
	response.write(template.render({}))
	return

					
app = webapp.WSGIApplication([('/', Handler),('/killcache',CacheKiller)],debug=True)
app.error_handlers[404] = Handle404