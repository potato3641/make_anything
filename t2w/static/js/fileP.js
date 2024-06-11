function copyurl() {
  // css init
  var alertBox = document.getElementsByClassName('alert');
  for (var box of alertBox) {
    box.classList.add('fade');
    box.style.opacity = '0';
    box.style.display = 'none';
  }
  // 파일 가져오기
  var fileInput = document.getElementById("fileInput").files[0];
  if (!fileInput) {
    setTimeout(function () {
      document.getElementById('emptyFileAlert').style.display = 'block';
    }, 100);
    return;
  }
  // 폼 데이터 구성하기
  var formData = new FormData();
  formData.append("file", fileInput);
  // ajax
  fetch("/copyFile/", {
    method: "POST",
    body: formData
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Oops, white board caused an error!');
      } else {
        return response.text()
      }
    })
    .then(text => {
      var tempButton = document.createElement("button");
      tempButton.setAttribute("data-clipboard-text", window.location.origin + '/result/' + text);
      var clipboard = new ClipboardJS(tempButton);

      clipboard.on('success', function (e) {
        document.getElementById('copySuccessAlert').style.display = 'block';
      });
      clipboard.on('error', function (e) {
        console.error("텍스트 복사 실패: ", err);
      });
      tempButton.click();
    })
    .catch(error => {
      document.getElementById('copyFailedAlert').style.display = 'block';
    })
}
document.querySelector('.custom-file-input').addEventListener('change', function (e) {
  var fileName = document.getElementById("fileInput").files[0].name;
  var nextSibling = e.target.nextElementSibling
  nextSibling.innerText = fileName
})