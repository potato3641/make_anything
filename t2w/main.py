from fastapi import FastAPI, UploadFile, File, HTTPException, Request, Response, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
# import os

app = FastAPI(docs_url="/documentation", redoc_url=None)

templates = Jinja2Templates(directory="templates")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

app.mount("/static", StaticFiles(directory="static"), name="static")

class UnicodeEecodeErrorHTTPException(HTTPException):
    def __init__(self, detail: str = "Unable to encode content"):
        super().__init__(status_code=400, detail=detail)

@app.get("/")
async def home(request: Request):
    return templates.TemplateResponse("index.html",{"request":request})

@app.get("/tw2file")
async def home(request: Request):
    return templates.TemplateResponse("_file_page.html",{"request":request})

@app.get("/tw2text")
async def home(request: Request):
    return templates.TemplateResponse("_text_page.html",{"request":request})

@app.post("/uploadFile/")
async def upload_file(request: Request, file: UploadFile = File(...)):
    if file.content_type != 'text/plain':
        raise HTTPException(status_code=400, detail="Invalid file type. Only plain text files are allowed.")
    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="File is empty")
    response = RedirectResponse(url="/result/", status_code=307)
    await set_content(response, content)
    return response

@app.post("/uploadText/")
async def upload_file(request: Request, content: str = Form()):
    if not content:
        raise HTTPException(status_code=400, detail="text is empty")
    response = RedirectResponse(url="/result/", status_code=307)
    await set_content(response, content)
    return response

@app.post("/result/", response_class=HTMLResponse)
async def result(request: Request):
    content = request.cookies.get("content", "No content available")
    return templates.TemplateResponse("presentation.html", {"request": request, "content": content})

async def set_content(response: Response, content: bytes) -> None:
    # 작성일 : 24.05.21
    # 작성자 : potato3641
    # 내용 : 쿠키 사용에 대한 주석
    #
    # url, headers, body, python 변수등을 하려고 시도했으나
    # url은 지저분해보여서 ㅎ;
    # hedaers, body는 fastapi의 middleware사용으로 인해 request가 조정되어 유실되었고
    # python 변수는 여러 요청에 의해 유실될 우려가 있어 사용을 할 수 없었음
    #try:
        if isinstance(content, str):
            decoded_content = content
        else:
            decoded_content = content.decode('utf-8')
        response.set_cookie(key="content", value=decoded_content)
    #except UnicodeEncodeError as e:
        print('excepted')
    #    raise UnicodeEecodeErrorHTTPException(detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)