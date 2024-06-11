function copyurl() {
  // css init
  var alertBox = document.getElementsByClassName('alert');
  for (var box of alertBox) {
    box.classList.add('fade');
    box.style.opacity = '0';
    box.style.display = 'none';
  }
  // 데이터 가져오기
  var textInput = document.getElementById("textInput").value;
  // 폼 데이터 구성하기
  var formData = new FormData();
  if (textInput.trim() !== "")
    formData.append('content', textInput);
  // ajax
  fetch("/copyText/", {
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