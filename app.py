from flask import Flask, jsonify, render_template, request
import requests
from threading import Thread
from time import sleep
 
app = Flask(__name__)
 
subdomains = [
    'http://www.google.com',
    'http://www.github.com',
    'http://www.facebook.com'
]
 
status_dict = {subdomain: 'Unknown' for subdomain in subdomains}
 
def check_status(url):
    try:
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            return 'Up'
        else:
            return 'Down'
    except requests.RequestException:
        return 'Down'
 
def update_status():
    while True:
        for subdomain in list(status_dict.keys()):
            status_dict[subdomain] = check_status(subdomain)
        sleep(5)
 
@app.route('/')
def index():
    return render_template('index.html')
 
@app.route('/status')
def status():
    return jsonify(status_dict)
 
@app.route('/add_subdomain', methods=['POST'])
def add_subdomain():
    data = request.get_json()
    new_subdomain = data.get('subdomain')
    if new_subdomain and new_subdomain not in status_dict:
        status_dict[new_subdomain] = 'Unknown'
    return '', 204
 
if __name__ == "__main__":
    thread = Thread(target=update_status)
    thread.daemon = True
    thread.start()
    app.run(debug=True, host='0.0.0.0')