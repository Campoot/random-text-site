fetch('https://script.google.com/macros/s/AKfycbySrBlnybSugNxD8tZ_W35A59yIEglZMqjBwRGAWG4dLMfseHK_RFZj3riXPtFoKygQ/exec')  // Используем твою ссылку для Google Apps Script
  .then(response => response.json())
  .then(data => {
    const randomString = data.string;  // Берём случайную строку из ответа

    // Создаём объект, который будет записан в data.json
    const result = {
      "data": [ randomString ]  // Обновляем data.json с новой строкой
    };

    // Загружаем в GitHub API для обновления содержимого файла data.json
    fetch('https://api.github.com/repos/Campoot/random-text-site/contents/data.json', {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer <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>',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: "Update random string",
        content: btoa(JSON.stringify(result))  // Кодируем объект в base64
      })
    })
    .then(res => res.json())
    .then(data => console.log('Обновлено: ', data))
    .catch(error => console.error('Ошибка: ', error));
  })
  .catch(error => console.error('Ошибка при запросе: ', error));
