import webapp2 as webapp
import jinja2 as jinja
import os
import utils

TEMPLATE_DIR = os.path.join(os.path.dirname(__file__), 'static', 'templates')
DATA = os.path.join(os.path.dirname(__file__), TEMPLATE_DIR, 'data.json')
EXTRA = os.path.join(os.path.dirname(__file__), TEMPLATE_DIR, 'extra.json')

templater = jinja.Environment(
    loader=jinja.FileSystemLoader(TEMPLATE_DIR))


class Handler(webapp.RequestHandler):

    def get(self, scroll=''):
        self.response.headers['Content-Type'] = 'text/html'
        template = templater.get_template('index.html')
        requester = self.request.get("ip", os.environ["REMOTE_ADDR"]) if utils.isLocal() else os.environ["REMOTE_ADDR"]
        self.response.write(template.render(data = utils.load(DATA), extra = utils.getExtra(requester, EXTRA)))


def Handle404(request, response, exception):
    response.headers['Content-Type'] = 'text/html'
    response.set_status(404)
    template = templater.get_template('404.html')
    response.write(template.render({}))
    return

app = webapp.WSGIApplication([('/', Handler)], debug=True)
app.error_handlers[404] = Handle404
