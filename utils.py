from google.appengine.api import memcache
import os,json,urllib2

ASNs =  {"MIT": ("AS3","AS63")
		,"Stanford": ("AS32","AS46749")
		,"Google": ("AS36040","AS36492","AS36384","AS15169")
		# This is the real USC. Go Cocks
		,"USC": ("AS12005",)}

def isLocal():
	return os.environ.get('SERVER_SOFTWARE','').startswith('Development')

def getExtra(address,f):
	return load(f).get(lookup(address),[])

def lookup(ip):
	return match(get("http://ipinfo.io/%s/org" % ip))

def get(url):
	try:
		return urllib2.urlopen(url, None, 10).read().split(" ")[0]
	except:
		# ipinfo down, blocking us, someone passing in weird stuff
		return "broken"

def match(org):
	for asn in ASNs:
		for n in ASNs[asn]:
			if org == n:
				return asn
	return ""

def load(jsn):
	key = 'data%s' % jsn
	data = memcache.get(key)
	if not data:
		with open(jsn) as data_file:    
			data = json.load(data_file)
		if not memcache.add(key, data):
			logging.error('Memcache set failed.')
	return data