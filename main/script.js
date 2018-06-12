class App {
    async init() {
        console.log('main');

        const url_string = window.location.href;
        const url = new URL(url_string);
        const number = url.searchParams.get("number");

        const data = await this.fetchData(number);
        const keys = Object.keys(data);

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = data[key];
            $('#result').append($(`<tr><td>${key}</td><td>${value}</td></tr>`));
        }
    }

    fetchData(number) {
        const i2 = fetch(`http://localhost:8002/?start=1&finish=${number/2}` /*http://35.196.186.141/*/, {
            mode: 'cors'
        }).then(function (result) {
            return result.json();
        });

        const i3 = fetch(`http://localhost:8003/?start=${number/2}&finish=${number}` /*http://35.229.116.27/*/, {
            mode: 'cors'
        }).then(function (result) {
            return result.json();
        });

        return Promise.all([i2, i3]).then(function (results) {
            let response = {};

            for (const i in results) {
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