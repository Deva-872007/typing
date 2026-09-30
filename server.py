"""
TypeFlow Academy Local Web Server
Runs a lightweight HTTP server on port 8000.
Can also open directly via index.html in any browser.
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def run():
    os.chdir(DIRECTORY)
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        url = f"http://localhost:{PORT}"
        print("=" * 60)
        print("⚡ TypeFlow Academy Server Running!")
        print(f"👉 Local URL: {url}")
        print("Press Ctrl+C to stop the server.")
        print("=" * 60)
        
        # Optionally open in default web browser
        try:
            webbrowser.open(url)
        except Exception:
            pass
            
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")

if __name__ == "__main__":
    run()
