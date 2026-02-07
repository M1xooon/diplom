
- клонируем репозиторий и заходим в него
```
$ git clone https://github.com/M1xooon/diplom
```
### База данных
- не забудем установить базу данных, используем пользователя `postgres`
```

# CREATE DATABASE diplom;
# CREATE USER <username> WITH PASSWORD '<passowrd>';
# GRANT ALL PRIVILEGES ON DATABASE cloud_storage TO <username>;
# \q

```
### Бэкенд
- создаем и активируем виртуалльное окружение
```
$ python3 -m venv env
$ source ./env/bin/activate
```
- устанавливаем зависимости Python, применяем миграции и запускаем бэкенд
```
(env) $ pip install -r requirements.txt
(env) $ python manage.py makemigrations cloud
(env) $ python manage.py migrate
```
### Фронтенд

- Переходим в дирректорию `frontend/`, установим NPM зависимости
```
npm install
```
- В файле `frontend/src/api/requests.js` в переменной `BASE_URL` установим url, на который будут отправлятся запросы на сервер. Например: `http://127.0.0.1:8000/api/`
После этого пересоберем бандл фронтенда
```
npm run dev
```
- Себерем static файлы и запустим наш проект
```
(env) $ python manage.py collectstatic
(env) $ python manage.py createsuperuser
(env) $ python manage.py runserver 127.0.0.1:8000
```
