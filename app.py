from flask import Flask

def app_start(): #untuk membuat modularisasi
    app = Flask(__name__)
    return app

app = app_start()

if __name__ == '__main__':
    app.run(debug=True)