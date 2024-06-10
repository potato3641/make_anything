from fastapi import FastAPI, UploadFile, File, HTTPException, Request, Form
from fastapi.responses import RedirectResponse, PlainTextResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import base64
import zlib

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

# 240604 유니코드 오류 해결로 인한 주석처리
# class UnicodeEecodeErrorHTTPException(HTTPException):
#     def __init__(self, detail: str = "Unable to encode content"):
#         super().__init__(status_code=400, detail=detail)

@app.get("/")
async def home(request: Request):
    # index 템플릿
    return templates.TemplateResponse("index.html",{"request":request})

@app.get("/t2wfile")
async def t2wfile(request: Request):
    # file page 템플릿
    return templates.TemplateResponse("_file_page.html",{"request":request})

@app.get("/t2wtext")
async def t2wtext(request: Request):
    # text page 템플릿
    return templates.TemplateResponse("_text_page.html",{"request":request})

@app.post("/uploadFile/")
async def upload_file(request: Request, file: UploadFile = File(...)):
    # 텍스트 파일 변환 요청 처리
    if file.content_type != 'text/plain':
        raise HTTPException(status_code=400, detail="Only text file")
    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="File is empty")
    return await upload_text(request, content.decode('utf-8'))

@app.post("/uploadText/")
async def upload_text(request: Request, content: str = Form()):
    # 텍스트 변환 요청 처리
    if not content:
        raise HTTPException(status_code=400, detail="text is empty")
    encoded_content = url_compress(content)
    redirect_url = f"/result/{encoded_content}"
    response = RedirectResponse(url=redirect_url, status_code=307)
    return response

@app.post("/copyFile/")
async def copy_file(request: Request, file: UploadFile = File(...)):
    # 변환 페이지 URL 요청 처리
    if file.content_type != 'text/plain':
        raise HTTPException(status_code=400, detail="Only text file")
    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="File is empty")
    return await copy_text(request, content.decode('utf-8'))

@app.post("/copyText/")
async def copy_text(request: Request, content: str = Form()):
    # 변환 페이지 URL 요청 처리
    if not content:
        raise HTTPException(status_code=400, detail="text is empty")
    try:
        decoded_content = url_compress(content)
    except Exception as e:
        return PlainTextResponse("ERROR")
    return PlainTextResponse(decoded_content)

@app.get("/result/{encoded_content}")
async def get_result(request: Request, encoded_content: str):
    # 변환 페이지 GET 요청 처리
    try:
        if not isinstance(encoded_content, str):
            encoded_content = encoded_content.decode('utf-8')
        decoded_content = url_decompress(encoded_content)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Failed to decode content")
    return templates.TemplateResponse("presentation.html", {"request": request, "content": decoded_content})

@app.post("/result/{encoded_content}")
async def post_result(request: Request, encoded_content: str):
    # 변환 페이지 POST 요청 처리
    return await get_result(request, encoded_content)

def url_compress(text: str) -> str:
    # 텍스트 압축
    compressed = zlib.compress(text.encode('utf-8'))
    return base64.urlsafe_b64encode(compressed).decode('utf-8')

def url_decompress(encoded_text: str) -> str:
    # 텍스트 압축해제
    compressed = base64.urlsafe_b64decode(encoded_text)
    return zlib.decompress(compressed).decode('utf-8')

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)