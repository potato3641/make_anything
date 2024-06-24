import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Alert.css';

const Alert = ({ status, onClose }) => {
  const [alertObject, setAlertObject] = useState([
    {
      alertClass: 'alert-danger',
      content: '프레젠테이션 주소 복사에 실패하였습니다...'
    },
    {
      alertClass: 'alert-primary',
      content: '프레젠테이션 주소가 클립보드에 복사되었습니다!'
    },
    {
      alertClass: 'alert-warning',
      content: '파일을 선택하세요...'
    },
  ]);
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('timeout-test')
      onClose();
    }, 1000);

    return () => clearTimeout(timer);
  }, [status, onClose]);
  return (
    <div id="Alert" className={`${alertObject[status]?.alertClass} alert alert-dismissible fade show`} role="alert">
      {alertObject[status]?.content}
      <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  );
};

export default Alert;
