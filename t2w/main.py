from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
import os

app = FastAPI(docs_url="/documentation", redoc_url=None)
templates = Jinja2Templates(directory="templates")

@app.get("/")
async def home(request: Request):
    return templates.TemplateResponse("index.html",{"request":request})

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    if file.content_type != 'text/plain':
        raise HTTPException(status_code=400, detail="Invalid file type. Only plain text files are allowed.")
    
    content = await file.read()
    presentation_html = convert_text_to_html(content.decode('utf-8'))

    return HTMLResponse(content=presentation_html)

@app.get("/presentation/", response_class=HTMLResponse)
async def get_presentation():
    if os.path.exists('presentation.html'):
        with open('presentation.html', 'r') as f:
            html_content = f.read()
        return HTMLResponse(content=html_content)
    else:
        raise HTTPException(status_code=404, detail="Presentation not found")

def convert_text_to_html(text: str) -> str:
    html_template = f"""
    <!doctype html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Reveal.js Presentation</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.3.1/reveal.min.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.3.1/theme/black.min.css" id="theme">
    </head>
    <body>
        <div class="reveal">
            <div class="slides">
                <section data-markdown data-separator="^---$" data-separator-vertical="^--$">
                    <textarea data-template>
{ text }
                    </textarea>
                </section>
            </div>
        </div>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.3.1/reveal.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.3.1/plugin/markdown/markdown.min.js"></script>
        <script>
            Reveal.initialize({{
                plugins: [ RevealMarkdown ]
            }});
        </script>
    </body>
    </html>
    """
    return html_template

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
