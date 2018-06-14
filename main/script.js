class App {
    async init() {
        // Получаем текущий урл
        const url_string = window.location.href;
        const url = new URL(url_string);
        // Получаем значение предела, до которого будем искать простые числа
        const number = url.searchParams.get("number");

        // Получаем данные - обработынные ответы от серверов
        const data = await this.fetchData(number);
        const keys = Object.keys(data);

        // Выводим результат
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = data[key];
            $('#result').append($(`<tr><td>${key}</td><td>${value}</td></tr>`));
        }
    }

    fetchData(number) {
        // Отправляем запрос на i2 экземпляр
        // Вместо 35.196.186.141 нужно подставить внешний IP-адрес экземплара i2.
        const i2 = fetch(`http://35.196.186.141/?start=1&finish=${number/2}` /* http://localhost:8002/ */, {
            mode: 'cors'
        }).then(function (result) {
            // Преобразовуем ответ в json объект
            return result.json();
        });

        // Отправляем запрос на i3 экземпляр
        // Вместо 35.229.116.27 нужно подставить внешний IP-адрес экземплара i3.
        const i3 = fetch(`http://35.229.116.27/?start=${number/2}&finish=${number}` /* http://localhost:8003/ */, {
            mode: 'cors'
        }).then(function (result) {
            // Преобразовуем ответ в json объект
            return result.json();
        });

        // Ожидаем и обрабатываем все ответы
        return Promise.all([i2, i3]).then(function (results) {
            let response = {};

            for (const i in results) {
                // Сливаем ответы вместе
                $.extend(response, results[i]);
            }

            return response;
        }, function (reason) {
            console.error(reason);
            return {};
        });
    }
}

const app = new App();
app.init();