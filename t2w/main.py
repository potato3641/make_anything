from fastapi import FastAPI, UploadFile, File, HTTPException, Request, Form, APIRouter, Depends
from fastapi.responses import HTMLResponse, RedirectResponse, PlainTextResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from pydantic import BaseModel
# https 추가 후 사용
# from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
import base64
import zlib
import os
import yaml

app = FastAPI(docs_url=None, redoc_url=None)

def load_config_from_yaml(file_path: str):
    with open(file_path, "r", encoding='utf-8') as f:
        try:
            config = yaml.safe_load(f)
        except yaml.YAMLError as e:
            print(f"YAML 파일을 로드하는 중 오류가 발생했습니다: {e}")
            return {}

    for key in ['EXAMPLE_T2W', 'EXAMPLE2_T2W', 'GUIDE_BASIC_T2W', 'NGINX_PREFIX']:
        content = config.get(key, '')
        if isinstance(content, list):
            content = '\n'.join(content)
        os.environ[key] = content

config_file = "sample.yaml"
load_config_from_yaml(config_file)

class SampleContent(BaseModel):
    prefix: str = os.getenv("NGINX_PREFIX", "YAML LOAD ERROR")
    content: str = os.getenv("EXAMPLE_T2W", "YAML LOAD ERROR")
    content2: str = os.getenv("EXAMPLE2_T2W", "YAML LOAD ERROR")
    content3: str = os.getenv("GUIDE_BASIC_T2W", "YAML LOAD ERROR")
templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True
    # https 추가 후 사용
    # HTTPSRedirectMiddleware
)

# 240604 유니코드 오류 해결로 인한 주석처리
# class UnicodeEecodeErrorHTTPException(HTTPException):
#     def __init__(self, detail: str = "Unable to encode content"):
#         super().__init__(status_code=400, detail=detail)

t2w_router = APIRouter()

# 240625 개발용 잔류
@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    """index 템플릿"""
    return templates.TemplateResponse("index.html",{"request":request})

# 240625 개발용 잔류
@t2w_router.get("/t2wfile", response_class=HTMLResponse)
async def t2wfile(request: Request):
    """file page 템플릿"""
    return templates.TemplateResponse("_file_page.html",{"request":request})

# 240625 개발용 잔류
@t2w_router.get("/t2wtext", response_class=HTMLResponse)
async def t2wtext(request: Request):
    """text page 템플릿"""
    return templates.TemplateResponse("_text_page.html",{"request":request})

# 240625 리액트 대체 결정 이후 폐기확정
@t2w_router.get("/t2wguide", response_class=HTMLResponse)
async def t2wguide(request: Request, content: SampleContent = Depends()):
    """guide page 템플릿"""
    return templates.TemplateResponse("_guide_markdown.html",{"request": request, "content": content.content})

# 240625 리액트 대체 결정 이후 폐기확정
@t2w_router.get("/t2wexample", response_class=HTMLResponse)
async def t2wexample(request: Request, content: SampleContent = Depends()):
    """guide page example 템플릿"""
    return templates.TemplateResponse("presentation.html",{"request": request, "content": content.content})

# 240625 리액트 대체 결정 이후 폐기확정
@t2w_router.get("/t2wguidedeep", response_class=HTMLResponse)
async def t2wguidedeep(request: Request, content: SampleContent = Depends()):
    """guide2 page 템플릿"""
    return templates.TemplateResponse("_guide_custom.html",{"request": request, "content": content.content2})

# 240625 리액트 대체 결정 이후 폐기확정
@t2w_router.get("/t2wexampledeep", response_class=HTMLResponse)
async def t2wexampledeep(request: Request, content: SampleContent = Depends()):
    """guide2 page example 템플릿"""
    return templates.TemplateResponse("presentation.html",{"request": request, "content": content.content2})

# 서버 리소스 가져오기용
@t2w_router.get("/t2wguidebasic", response_class=HTMLResponse)
async def t2wguidebasic(request: Request, content: SampleContent = Depends()):
    """guide basic example 템플릿"""
    return templates.TemplateResponse("presentation.html",{"request": request, "content": content.content3})

# 서버 리소스 가져오기용
@t2w_router.get("/t2wexampletext", response_class=HTMLResponse)
async def t2wguidebasic(request: Request, content: SampleContent = Depends()):
    """example text 소스"""
    return PlainTextResponse(content.content)

# 서버 리소스 가져오기용
@t2w_router.get("/t2wexampledeeptext", response_class=HTMLResponse)
async def t2wguidebasic(request: Request, content: SampleContent = Depends()):
    """example deep text 소스"""
    return PlainTextResponse(content.content2)

@t2w_router.post("/uploadFile/", response_class=HTMLResponse)
async def upload_file(request: Request, file: UploadFile = File(...)):
    """텍스트 파일 -> 프레젠테이션 변환 요청 처리"""
    if file.content_type != 'text/plain':
        raise HTTPException(status_code=400, detail="Only text file")
    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="file is empty")
    return await upload_text(request, content.decode('utf-8'))

@t2w_router.post("/uploadText/", response_class=HTMLResponse)
async def upload_text(request: Request, content: str = Form(), prefix: SampleContent = Depends()):
    """텍스트 문자열 -> 프레젠테이션 변환 요청 처리"""
    if not content:
        raise HTTPException(status_code=400, detail="text is empty")
    encoded_content = url_compress(content)
    redirect_url = f"{prefix}/result/{encoded_content}"
    response = RedirectResponse(url=redirect_url, status_code=307)
    return response

@t2w_router.post("/copyFile/", response_class=PlainTextResponse)
async def copy_file(request: Request, file: UploadFile = File(...)):
    """텍스트 파일 -> 프레젠테이션 URL 변환 요청 처리"""
    if file.content_type != 'text/plain':
        raise HTTPException(status_code=400, detail="Only text file")
    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="File is empty")
    return await copy_text(request, content.decode('utf-8'))

@t2w_router.post("/copyText/", response_class=PlainTextResponse)
async def copy_text(request: Request, content: str = Form()):
    """텍스트 문자열 -> 프레젠테이션 URL 변환 요청 처리"""
    if not content:
        raise HTTPException(status_code=400, detail="text is empty")
    try:
        decoded_content = url_compress(content)
    except Exception as e:
        return PlainTextResponse("ERROR")
    return PlainTextResponse(decoded_content)

@t2w_router.get("/result/{encoded_content}", response_class=HTMLResponse)
async def get_result(request: Request, encoded_content: str):
    """프레젠테이션 페이지 GET 요청 처리"""
    try:
        if not isinstance(encoded_content, str):
            encoded_content = encoded_content.decode('utf-8')
        decoded_content = url_decompress(encoded_content)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Failed to decode content")
    return templates.TemplateResponse("presentation.html", {"request": request, "content": decoded_content})

@t2w_router.post("/result/{encoded_content}", response_class=HTMLResponse)
async def post_result(request: Request, encoded_content: str):
    """프레젠테이션 페이지 POST 요청 처리"""
    return await get_result(request, encoded_content)

@app.get("/error", response_class=HTMLResponse)
async def error_response(request: Request, error: str):
    return templates.TemplateResponse("error.html", {"request": request, "content": error})

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    if exc.status_code == 400:
        return templates.TemplateResponse("error.html", {"request": request, "content": exc.detail}, status_code=400)
    return templates.TemplateResponse("error.html", {"request": request, "content": "An error occurred"}, status_code=exc.status_code)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return templates.TemplateResponse("error.html", {"request": request, "content": "Invalid input"}, status_code=400)

def url_compress(text: str) -> str:
    """텍스트(URL) 압축"""
    compressed = zlib.compress(text.encode('utf-8'))
    return base64.urlsafe_b64encode(compressed).decode('utf-8')

def url_decompress(encoded_text: str) -> str:
    """텍스트(URL) 압축해제"""
    compressed = base64.urlsafe_b64decode(encoded_text)
    return zlib.decompress(compressed).decode('utf-8')

app.include_router(t2w_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)