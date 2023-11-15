from http.server import SimpleHTTPRequestHandler
from socketserver import TCPServer
import json
import random

PORT = 8000
Handler = SimpleHTTPRequestHandler

class MyHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/generate_random_indices':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()

            # Replace 48 with the total number of songs in your playlist
            indices = random.sample(range(48), 48)

            # Send the random indices as JSON
            self.wfile.write(json.dumps(indices).encode())
        else:
            # Serve other requests using the default handler
            super().do_GET()

with TCPServer(("", PORT), MyHandler) as httpd:
    print("Server started at localhost:" + str(PORT))
    print("link: http://localhost:8000")
    httpd.serve_forever()

