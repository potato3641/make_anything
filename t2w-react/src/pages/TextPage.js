import React, { useState } from 'react';
import ClipboardJS from 'clipboard';
import Alert from '../components/Alert';
import 'bootstrap/dist/css/bootstrap.min.css';
import './TextPage.css';

const TextPage = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [inputText, setInputText] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertStatus, setAlertStatus] = useState(false);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const copyFlagInit = () => {
    setCopySuccess(false);
    setCopyFailed(false);
    setCopyError(false);
  };

  const fetchDataAndCopy = async () => {
    setIsLoading(true);
    copyFlagInit();

    try {
      // 폼 데이터 구성하기
      const formData = new FormData();
      if (inputText.trim() !== "") {
        formData.append('content', inputText);
      }
      // fetch 요청 보내기
      const response = await fetch(`${apiUrl}/copyText/`, {
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
      <h1 className="animate__animated animate__fadeInDown">슬라이드 내용을 입력하십쇼</h1>
      <form id="textUploader" action={`${apiUrl}/uploadText/`} method="post" target="_blank" className="animate__animated animate__fadeInUp">
        <div className="form-group">
          <textarea
            id="textInput"
            name="content"
            rows="5"
            value={inputText}
            onChange={handleInputChange}
            className="form-control"
            placeholder="텍스트를 입력하세요"
            required
          />
        </div>
        <div className="form-group button-container">
          <input id="submitButton" type="submit" value="만들기" className="btn btn-primary hvr-bounce-to-right" />
          <button type="button" onClick={fetchDataAndCopy} disabled={isLoading} className="btn btn-secondary hvr-bounce-to-right">URL 복사</button>
        </div>
      </form>
      {(copySuccess || copyFailed || copyError) && <Alert status={alertStatus} onClose={() => { copyFlagInit() }} />}
    </div>
  );
};

export default TextPage;
