from datetime import datetime
import os

if not os.path.exists("logs"):
    os.makedirs("logs")
    os.makedirs("logs/gunicorn")

bind = "0.0.0.0:8000"
workers = 2
worker_class = "uvicorn.workers.UvicornWorker"
accesslog = f"./logs/gunicorn/access_{datetime.now().strftime('%Y-%m-%d_%H')}.log"
errorlog = f"./logs/gunicorn/error_{datetime.now().strftime('%Y-%m-%d_%H')}.log"
loglevel = "info"
