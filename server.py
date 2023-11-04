from http.server import SimpleHTTPRequestHandler
from socketserver import TCPServer

PORT = 8000
Handler = SimpleHTTPRequestHandler

with TCPServer(("", PORT), Handler) as httpd:
    print("Server started at localhost:" + str(PORT))
    print("link: http://localhost:8000")
    httpd.serve_forever()

