from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import os

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

@app.get("/")
async def home(request: Request):
    return templates.TemplateResponse("index.html",{"request":request})

@app.post("/upload/")
async def upload_file(request: Request, file: UploadFile = File(...)):
    if file.content_type != 'text/plain':
        raise HTTPException(status_code=400, detail="Invalid file type. Only plain text files are allowed.")
    content = await file.read()
    response = RedirectResponse(url="/result/", status_code=307)
    response.set_cookie(key="content", value=content.decode('utf-8')) # 여기에서 decode를 하지 않으면 str로 넘어가버렷
    # 작성일 : 24.05.21
    # 작성자 : potato3641
    # 내용 : 쿠키 사용에 대한 주석
    #
    # url, headers, body, python 변수등을 하려고 시도했으나
    # url은 지저분해보여서 ㅎ;
    # hedaers, body는 fastapi의 middleware사용으로 인해 request가 조정되어 유실되었고
    # python 변수는 여러 요청에 의해 유실될 우려가 있어 사용을 할 수 없었음
    return response

@app.post("/result/", response_class=HTMLResponse)
async def result(request: Request):
    content = request.cookies.get("content")
    return templates.TemplateResponse("presentation.html", {"request": request, "content": content})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
