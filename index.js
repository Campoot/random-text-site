fetch('https://script.google.com/macros/s/AKfycbyQUOPqUfyogdWghCol13RLybOUJtA7Z1lj_N_nMNAfy3sl1M_4DpDFWrbbLa41r7mU/exec') // Заменить на ссылку твоего Google Apps Script
  .then(response => response.json())
  .then(data => {
    const randomString = data.string;
    
    // Создаём JSON объект для записи в файл
    const result = {
      "data": [
        randomString
      ]
    };

    // Сохраняем результат в data.json
    fetch('https://api.github.com/repos/Campoot/random-text-site/contents/data.json', {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer <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>',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: "Update random string",
        content: btoa(JSON.stringify(result)), // Преобразуем результат в base64
      })
    })
    .then(res => res.json())
    .then(data => console.log('Обновлено: ', data))
    .catch(error => console.error('Ошибка: ', error));
  })
  .catch(error => console.error('Ошибка при запросе: ', error));
