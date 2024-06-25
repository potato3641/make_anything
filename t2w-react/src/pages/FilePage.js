import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ClipboardJS from 'clipboard';
import Alert from '../components/Alert';
import 'bootstrap/dist/css/bootstrap.min.css';
import './FilePage.css';

const FilePage = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const inputFileRef = useRef(null);
  const [inputFile, setInputFile] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [copyFileUnset, setCopyFileUnset] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertStatus, setAlertStatus] = useState(false);
  const navigate = useNavigate();

  const copyFlagInit = () => {
    setCopySuccess(false);
    setCopyFailed(false);
    setCopyError(false);
    setCopyFileUnset(false);
  };

  const onClickFileUpload = () => {
    inputFileRef.current.click();
  }

  const fileInputOnChange = (e) => {
    const targetFile = e.target.files[0];
    setInputFile(targetFile)
  };

  const fetchDataAndCopy = async () => {
    setIsLoading(true);
    copyFlagInit();

    try {
      if (!inputFile) {
        setCopyFileUnset(true);
        setAlertStatus(3);
        return;
      }
      // 폼 데이터 구성하기
      const formData = new FormData();
      formData.append("file", inputFile);
      // fetch 요청 보내기
      const response = await fetch(`${apiUrl}/copyFile/`, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error('Oops, white board caused an error!');
      }

      // 복사할 텍스트 가져오기
      const text = await response.text();

      // 클립보드에 복사하는 버튼 생성
      const tempButton = document.createElement("button");
      tempButton.setAttribute("data-clipboard-text", `${apiUrl}/result/${text}`);
      const clipboard = new ClipboardJS(tempButton);

      // 클립보드 복사 성공 시 처리
      clipboard.on('success', function (e) {
        setCopySuccess(true);
        setAlertStatus(1);
      });

      // 클립보드 복사 실패 시 처리
      clipboard.on('error', function (e) {
        console.error("텍스트 복사 실패: ", e);
        setCopyError(true);
        setAlertStatus(2);
      });

      // 버튼 클릭으로 클립보드 복사 시도
      tempButton.click();
    } catch (error) {
      setCopyFailed(true);
      setAlertStatus(0);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="form-content">
      <h1>텍스트 파일(*.txt)을 올리십쇼</h1>
      <form id="textUploader" action={`${apiUrl}/uploadFile/`} method="post" target="_blank">
        <div className="form-group">
          <div className="custom-file">
            <button
              type="button"
              className="btn btn-info hvr-bounce-to-right"
              onClick={onClickFileUpload}
            >
              {inputFile ? `선택된 파일명 : ${inputFile.name}` : '파일 선택'}
            </button>
            <input type="file" className="custom-file-input" name="file" onChange={fileInputOnChange} required ref={inputFileRef} />
          </div>
        </div>
        <div className="form-group">
          <input id="submitButton" type="submit" value="만들기" className="btn btn-primary hvr-bounce-to-right" />
          <button type="button" onClick={fetchDataAndCopy} disabled={isLoading} className="btn btn-secondary hvr-bounce-to-right">URL 복사</button>
        </div>
      </form>
      <aside className="aside aside-left">
        <button
          className='aside-btn'
          onClick={() => { navigate("/t2wtext") }}
        >
          텍스트로
        </button>
      </aside>
      {(copySuccess || copyFailed || copyError || copyFileUnset) && <Alert status={alertStatus} onClose={() => { copyFlagInit() }} />}
    </div>
  );
};

export default FilePage;
