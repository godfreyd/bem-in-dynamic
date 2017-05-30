# Создаем динамический проект на БЭМ

* [Введение](#Введение)
* [Шаблонный репозиторий](#Шаблонный-репозиторий)
* [Приложение Hello, World](#Приложение-hello-world)
  * [Файловая структура](#Файловая-структура)
  * [Технологии](#Технологии)
* [Приложение SSSR](#Приложение-sssr)
  * [Схема работы](#Схема-работы)
  * [Модули Node](#Модули-node)
  * [Подготовка структуры проекта](#Подготовка-структуры-проекта)
  * [Работа с Twitter Search API](#Работа-с-twitter-search-api)
  * [Работа с YouTube Data API](#Работа-с-youtube-data-api)

## Введение

Динамическое приложение — это клиент-серверное приложение, ориентированное на обмен данными в режиме реального времени с последующей частичной или полной перезагрузкой текущей страницы.

Данный документ призван оказать  помощь в создании динамических приложений с использованием [БЭМ-платформы](https://ru.bem.info/platform/).

Мы создадим проект **Social Services Search Robot** (сокр. **SSSR**) для поиска подходящих твитов и видео по ключевому слову.

В работе будем использовать:

* принципы работы с [CSS по БЭМ](https://ru.bem.info/methodology/css/);
* фреймворк [i-bem.js](https://ru.bem.info/platform/i-bem/);
* шаблонизатор [bem-xjst](https://ru.bem.info/platform/bem-xjst/);
* технологию для описания зависимостей [DEPS](https://ru.bem.info/platform/deps/);
* [Express.js](http://expressjs.com);
* [YouTube Data API](https://developers.google.com/youtube/v3/docs/search/list);
* [Twitter Search API](https://dev.twitter.com/rest/public/search).

После прочтения вы сможете разрабатывать собственные БЭМ-проекты, ориентированные на динамические данные.

Обратите внимание, что для работы с примерами, описанными в документе, необходимо иметь базовые навыки:

* HTML.
* CSS.
* JavaScript.
* БЭМ.

> **Важно!** В документе не рассматриваются вопросы верстки и клиентского JS. Цель документа — показать как разрабатывать динамические проекты по БЭМ, используя полный стек технологий.

## Шаблонный репозиторий

Для создания динамических проектов по БЭМ разработан шаблонный репозиторий [bem-express](https://github.com/bem/bem-express). Он содержит необходимый минимум конфигурационных файлов и решает целый класс задач, таких как сборка проекта, настройка линтеров, подключение библиотек и др.

В `bem-express` по умолчанию подключены основные БЭМ-библиотеки:

* [bem-core](https://github.com/bem/bem-core)
* [bem-components](https://github.com/bem/bem-components)

Для начала работы с шаблонным репозиторием на вашей машине необходимо установить [Node.js 4+](https://nodejs.org).

> **Важно!** Пользователям операционной системы Windows необходимо дополнительно установить [Git Bash](https://git-for-windows.github.io).

Все примеры программного кода, описанные в документе, успешно прошли проверку в версиях:

* Node.js — 4.7.0.
* npm — 4.5.0.

> **Примечание.** [npm](https://www.npmjs.com) — менеджер пакетов, входящий в состав Node.js.

## Используемые обозначения

* ![folder](https://rawgit.com/godfreyd/bem-in-dynamic/master/static/images/icons/folder.svg) — директория;
* ![add folder](https://rawgit.com/godfreyd/bem-in-dynamic/master/static/images/icons/add-folder.svg) — создать директорию;
* ![add file](https://rawgit.com/godfreyd/bem-in-dynamic/master/static/images/icons/add-file.svg) — создать файл;
* ![edit file](https://rawgit.com/godfreyd/bem-in-dynamic/master/static/images/icons/edit-file.svg) — отредактировать файл;
* ![trash file](https://rawgit.com/godfreyd/bem-in-dynamic/master/static/images/icons/trash-file.svg) — удалить файл.

## Приложение Hello, World

У программистов есть традиция: начинать программирование на новом языке или фреймворке с приложения **Hello, World**.

Это первое приложение, которое мы создадим, а затем расширим его до желаемого **SSSR**.

Нам понадобится локальная копия `bem-express`. Её можно сделать любым удобным для вас способом. Мы будем использовать [Git](https://git-scm.com).

> **Примечание.** Для пользователей OS X или Linux все команды выполняются в терминале. Пользователям Windows потребуется Git Bash. Убедитесь, что Git Bash запущен от имени администратора.

Чтобы создать приложение **Hello, World**, следуйте инструкции:

1. Склонируйте bem-express:

    ```bash
    git clone git@github.com:bem/bem-express.git sssr-project
    ```

    > **Примечание.** Текущая версия `bem-express`: 2.0.0. // TODO: дописать

2. Перейдите в директорию проекта:

    ```bash
    cd sssr-project
    ```

3. Удалите историю версионирования исходного репозитория:

    ```bash
    rm -rf .git
    ```

4. Инициализируйте собственный Git-репозиторий:

    ```bash
    git init
    ```

5. Установите зависимости:

    ```bash
    npm install
    ```

    > **Примечание.** Не используйте права суперпользователя `root` при установке npm-зависимостей.

6. Соберите проект и запустите сервер:

    ```bash
    npm run dev
    ```

    > **Примечание.** Сборка происходит с помощью [ENB](https://ru.bem.info/toolbox/enb/).

    При запуске приложения немедленно выводится сообщение о том, что сервер выполняется на порте 3000:

    `Server is listening on 3000`.

    > **Примечание.** Если порт `3000` уже используется другой программой, его можно переназначить в файле `server/config.js`. Например, на `8000`:
    >
    > ```js
    > defaultPort: 8000,
    > ```

    На вашем компьютере запустился:

    * сервер — отвечает за обработку динамических данных;
    * [nodemon](https://github.com/remy/nodemon/) — cледит за изменениями в файловой структуре и перезапускает сервер;
    * [chokidar](https://github.com/paulmillr/chokidar) — cледит за изменениями в файлах директорий `*.blocks/` и перестраивает структуру проекта;
    * [livereload](https://github.com/napcs/node-livereload) — обновляет страницу в браузере.

7. Откройте браузер и введите адрес [http://localhost:3000](http://localhost:3000).

    Должна открыться страница со следующим контентом:

    ```text
    Index page content
    footer content
    ```

    > **Примечание.** Если вы запускаете свое приложение в Windows, то, скорее всего, вы получите уведомление от Брандмауэра Windows. Отключите опцию *Общественные сети* (Public Network), установите опцию *Частные сети* (Private Network) и разрешите доступ.

8. Откройте файл `server/index.js` и внесите следующие изменения (см. комментарии) в код начинающего строкой `app.get('/', function(req, res)`:

    ```js
    app.get('/', function(req, res) {
        var hello = 'Hello';                  // Инициализировали переменную `hello`
        var world = 'World';                  // Инициализировали переменную `world`
        render(req, res, {
            view: 'page-index',
            title: 'Main page',
            meta: {
                description: 'Page description',
                og: {
                    url: 'https://site.com',
                    siteName: 'Site name'
                }
            },
            hello: hello,                     // Передали переменную `hello` в data.hello
            world: world                      // Передали переменную `world` в data.world
        })
    });
    ```

9. Измените функцию `content` для блока `page-index`. Файл `common.blocks/page-index/page-index.bemtree.js`:

    ```js
    block('page-index').content()(function() {
        var data = this.data;                  // Получаем данные
        return data.hello + ', ' + data.world; // Возвращаем содержимое
    });
    ```

    После сохранения сервер автоматически перезапустится и контент страницы изменится на:

    ```text
    Hello, World
    footer content
    ```

Приложение **Hello, World** готово.

**Не получилось?**

Если при создании приложения возникли проблемы, выполните следующие действия:

* Просмотрите [список часто задаваемых вопросов](https://ru.bem.info/methodology/faq/). Возможно, решение вашей проблемы уже найдено.
* Поищите описание проблемы на [форуме](https://ru.bem.info/forum/). Если готового ответа не нашлось, задайте вопрос экспертам.

### Файловая структура

Ниже приводится пример файловой структуры приложения **Hello, World** после установки всех зависимостей:

```files
sssr-project/
    .enb/                 # Конфигурационные файлы для сборщика ENB
    common.blocks/        # Базовые реализации блоков
    desktop.bundles/      # Директории бандлов проекта
    development.blocks/   # Блоки, подключаемые в процессе разработки (не для Production)  
    node_modules/         # Установленные модули (пакеты)
    server/               # Директория с серверным кодом
    static/               # Корневая директория для раздачи статических файлов
    .bemhint.js           #
    .borschik             # Конфигурация сборщика файлов Borschik
    .eslintignore         # Исключение файлов и директорий в ESLint
    .eslintrc             # Конфигурация ESLint
    .gitignore            # Исключение файлов и директорий в Git
    .stylelintrc          # Конфигурация Stylelint
    .travis.yml           # Автоматический запуск линтеров в Continuous Integration
    nodemon.json          # Конфигурация для пакета Nodemon
    package.json          # Описание проекта для npm
    README.md             # Текстовое описание проекта
```

Рассмотрим подробнее некоторые из директорий:

* [.enb](#enb)
* [common.blocks](#commonblocks)
* [desktop.bundles](#desktopbundles)
* [server](#server)
* [static](#static)

#### .enb

Содержит конфигурацию сборщика [ENB](https://ru.bem.info/toolbox/enb/).

Сборка решает следующие задачи:

* Объединяет исходные файлы, разложенные по файловой структуре проекта.
* Подключает в проект только необходимые блоки, элементы и модификаторы.
* Учитывает порядок подключения.
* Обрабатывает код исходных файлов в процессе сборки (например, компилирует LESS-код в CSS-код).

Алгоритм сборки описывается в файле `.enb/make.js`.

> Подробнее о [сборке БЭМ-проектов](https://ru.bem.info/methodology/build/).

#### common.blocks

Содержит реализации всех [БЭМ-сущностей](https://ru.bem.info/methodology/key-concepts/#БЭМ-сущность) проекта.

Имена файлов и директорий соответствуют [соглашению по именованию](https://ru.bem.info/methodology/naming-convention/). Код разделяется на независимые части для удобства работы с отдельными блоками.

```files
common.blocks/
    body/                # Директория блока `body`
    footer/              # Директория блока `footer`
    header/              # Директория блока `header`
    page/                # Директория блока `page`
        _view/           # Поддиректория модификатора `page_view`
        page.bemtree.js  # Реализация блока `page` в технологии BEMTREE  
        page.deps.js     # Реализация блока `page` в технологии DEPS
    page-index/          # Директория блока `page-index`
    root/                # Директория блока `root`
```

Перед отправкой в браузер файлы [собираются](#enb) и оптимизируются.

#### desktop.bundles

Содержит файлы полученные в результате сборки. Такие файлы в БЭМ-методологии принято называть бандлами.

Одной директории бандла соответствует одна страница проекта:

```files
desktop.bundles/
    index/                # Бандлы для страницы `index`
        index.bemdecl.js  # Декларация для страницы `index`
        index.bemhtml.js  # Бандл страницы `index` в технологии реализации BEMHTML
        index.bemtree.js  # Бандл страницы `index` в технологии реализации BEMTREE
        index.css         # Бандл страницы `index` в технологии реализации CSS
        index.deps.js     # Бандл страницы `index` в технологии реализации DEPS
        index.js          # Бандл страницы `index` в технологии реализации JS
        ...
```

> **Примечание.** Единственным не автоматически сгенерированным файлом в директории `index` является файл `index.bemdecl.js`. Подробнее технология BEMDECL [рассматривается ниже](#bemdecl).

#### server

Содержит [модули Node](#Модули-node), которые прослушивают веб-запросы и генерируют страницу.

Файловая структрура директории:

```files
server/                   
    config.js             # Конфигурация приложения
    index.js              # Точка входа приложения
    rebuild.js            # Пересборка приложения
    render.js             # Рендеринг HTML
```

Модули и их назначение:

* `index.js` — обвязка над Express.js. Подключает различные модули, в основном осуществляющие поддержку промежуточного звена (middleware), которую следует ожидать от приложения с выходом в Интернет.
* `config.js` — конфигурация приложения. Определяет настройку приложения по умолчанию (порт, директория для хранения статических файлов, секретный ключ сессии).
* `rebuild.js` — модуль пересборки. Следит за изменениями в файлах и директориях (директории: `*.blocks` и `static`), пересобирает и перезапускает проект.
* `render.js` — модуль рендеринга HTML. Получает на вход результирующий BEMJSON, достраивает его необходимыми данными и генерирует HTML.

> **Примечание.** Middleware или программное обеспечение (ПО) промежуточного звена — это ПО, выполняющее определенные функции, связанные с запросом HTTP. [Список ПО промежуточного звена](http://expressjs.com/en/resources/middleware.html), работающего с Express.

#### static

Содержит статические файлы, предназначенные для внешнего доступа:

```files
static/                   
    favicon.ico           # Фавиконка
    index.min.css         # Оптимизированный файл стилей
    index.min.js          # Оптимизированный JavaScript-файл
```

### Технологии

Полный стек технологий БЭМ состоит из:

* [BEMDECL](#bemdecl) — технология для описания деклараций в БЭМ.
* [DEPS](#deps) — технология для описания зависимостей в БЭМ.
* [BEMTREE](#bemtree) — шаблонизатор преобразующий данные в BEMJSON.
* [BEMHTML](#bemhtml) — шаблонизатор преобразующий BEMJSON в HTML.
* [i-bem.js](#i-bemjs) — JavaScript-фреймворк для БЭМ.

> Подробнее о [BEMJSON-формате](https://ru.bem.info/platform/bemjson/) входных данных.

#### BEMDECL

Позволяет определить [список БЭМ-сущностей](https://ru.bem.info/methodology/declarations/), используемых на странице.

Такой список в БЭМ принято называть декларацией. Задача декларации — определить, что и в каком порядке подключать в сборку.

Декларации описываются в файлах с расширением `.bemdecl.js`.

Пример декларации из приложения **Hello, World**:

```js
// Файл `desktop.bundles/index/index.bemdecl.js`
exports.blocks = [
    { name: 'root' }
];  
```

Как видно из примера, в декларации определен только блок `root`. Можно сделать предположение, что все приложение построено на основе одного блока. На самом деле нет.

Дело в том, что `root` является корневым блоком, а все остальные БЭМ-сущности попадают в сборку по [зависимостям](#deps).

Пример сборки по зависимостям:

```files
root(DECL)
|
└──> root(DEPS)
     |
     └──> page(DEPS)
          |
          ├──> header(DEPS)
          |    |
          |    └──> ...
          |
          ├──> body(DEPS)
          |    |
          |    └──> ...
          |
          └──> footer(DEPS)
               |
               └──> ...
```

#### DEPS

Позволяет определить [зависимости](https://ru.bem.info/platform/deps/) между БЭМ-сущностями, которые разнесены по файловой структуре проекта и не отражены в [декларации](#bemdecl).

Зависимости описываются в виде JavaScript-объекта в файлах с расширением `.deps.js`.

Пример зависимостей для блока `root` из приложения **Hello, World**:

```js
// Файл `common.blocks/root/root.deps.js`
({
    shouldDeps: 'page'
})
```

#### BEMTREE

Является частью шаблонизатора [bem-xjst](https://ru.bem.info/platform/bem-xjst/) и преобразует данные в BEMJSON.

Шаблоны описываются в BEMJSON-формате в файлах с расширением `.bemtree.js`.

Вход и выход шаблонизатора:

![BEMTREE](https://rawgit.com/godfreyd/bem-in-dynamic/master/static/images/bemtree.svg)

#### BEMHTML

Является частью шаблонизатора [bem-xjst](https://ru.bem.info/platform/bem-xjst/) и преобразует BEMJSON-описание страницы в HTML.

Шаблоны описываются в файлах с расширением `.bemhtml.js`.

Вход и выход шаблонизатора:

![BEMHTML](https://rawgit.com/godfreyd/bem-in-dynamic/master/static/images/bemhtml.svg)

#### i-bem.js

Клиентский [JavaScript-фреймворк](https://ru.bem.info/platform/i-bem/) для веб-разработки в рамках БЭМ-методологии.

JavaScript-код описывается в файлах с расширением `.js`.

Позволяет:

* разрабатывать веб-интерфейс в терминах блоков, элементов, модификаторов;
* описывать логику работы блока в декларативном стиле — как набор состояний;
* легко интегрировать код JavaScript с BEMHTML-шаблонами и CSS;
* гибко переопределять поведение библиотечных блоков.

> **Примечание.** `i-bem.js` не предназначен для замены фреймворка общего назначения, подобного jQuery.

## Приложение SSSR

// TODO: Написать вступление.

### Схема работы

![Chart of Social Services Search Robot](https://rawgit.com/godfreyd/bem-in-dynamic/master/static/images/chart.svg)

#### Шаг 1. Получение данных

Приложение получает запрос от пользователя и обращается за данными к [Twitter Search API](https://dev.twitter.com/rest/public/search) и [YouTube Data API](https://developers.google.com/youtube/v3/docs/search/list).

Генерация запроса и подготовка полученных данных для дальнейшей шаблонизации более подробно рассматриваются в разделах:

* [Работа с Twitter Search API](#Работа-с-twitter-search-api).
* [Работа с YouTube Data API](#Работа-с-youtube-data-api).

#### Шаг 2. BEMTREE-шаблонизация

После того как данные были получены, их необходимо добавить тем блокам, которые их ожидают. За обработку полученных данных отвечает [BEMTREE](#bemtree).

#### Шаг 3. BEMHTML-шаблонизация

После того как итоговый BEMJSON был достроен необходимыми данными, его необходимо преобразовать в HTML. За компиляцию результирующего BEMJSON в HTML отвечает [BEMHTML](#bemhtml).

### Модули Node

В этом разделе мы ближе познакомимся с концепцией модуля Node и рассмотрим основные модули, необходимые для работы приложения.

> **Важно!** В разделе не рассматриваются все используемые модули. Подробно с необходимым модулем можно ознакомиться на сайте [npm](https://www.npmjs.com). Здесь можно найти каталог всех модулей Node с поддержкой поиска.

Базовая реализация Node остается настолько простой, насколько это возможно. Вместо того, чтобы встраивать все возможные компоненты прямо в Node, разработчики предоставляют дополнительную функциональность в виде модулей.

Система модулей Node построена по образцу системы модулей [CommonJS](https://en.wikipedia.org/wiki/CommonJS), механизма создания взаимодействующих модулей. Центральное место в системе занимает контракт, который должен выполняться разработчиками, чтобы их модули нормально взаимодействовали с другими модулями.

Все модули установленные с помощью менеджера пакетов npm находятся в директории `node_modules`.

Подключение модулей происходит при помощи команды `require`. Если модуль установлен с использованием npm, указывать путь не нужно. Достаточно указать имя:

```js
var express = require('express');
```

При подключении собственного локального модуля, необходимо указать к нему путь:

```js
var someModule = require('./somefolder/somemodule');
```

Важной особенностью любого модуля является то, что он должен быть рассчитан на взаимодействие с Node. Для этого его нужно экспортировать с помощью объекта `exports`:

```js
exports.someFunction = function () {

    return 'Hello, World';

}
```

Также можно создавать модули, состоящие из конструкторов и функций, затем экспортировать их с помощью `module.exports`:

```js
// создаем функцию Hello
function Hello() {

    return 'Hello, World';

}

// создаем экземпляр
var hello = new Hello();

// присваиваем функцию Hello одноименному свойству
hello.Hello = Hello();

// Экспортируем экземпляр
module.exports = hello;
```

После этого можно использовать различные функции модуля в своем приложении:

```js
var hello = require('./hello');
console.log(hello.Hello);
```

Основные модули **SSSR**:

* [express](#express)
* [passport](#passport)
* [passport-youtube-v3](#passport-youtube-v3)
* [twitter](#twitter)
* [googleapis](#googleapis)

#### express

Предоставляет большую часть функциональности, необходимой разработчику для построения веб-приложения.

Установка:

```bash
npm install express --save
```

В документации Express представлено минимальное приложение «[Hello World Express](http://expressjs.com/en/starter/hello-world.html)». Оно демонстрирует основную последовательность действий:

```js
var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!')
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
```

Функция `app.get()` обрабатывает все веб-запросы GET, передавая объекты запроса и ответа. По общепринятым соглашениям в приложениях Express используются сокращенные формы `req` и `res`.

Функция `app.listen()` запускает приложение и прослушивает запросы на порте.

#### passport

Предоставляет [более 300 механизмов](http://passportjs.org) аутентификации в приложениях на Node.js.

Установка:

```bash
npm install passport --save
```

Пример авторизации по протоколу OAuth 2.0:

```js
var passport = require('passport'),
    OAuth2Strategy = require('passport-oauth').OAuth2Strategy;

passport.use('provider', new OAuth2Strategy({
    authorizationURL: 'https://www.provider.com/oauth2/authorize',
    tokenURL: 'https://www.provider.com/oauth2/token',
    clientID: SERVICE_APP_ID,
    clientSecret: SERVICE_APP_SECRET,
    callbackURL: 'https://www.example.com/auth/provider/callback'
}));
```

> **Примечание.** [OAuth 2.0](https://oauth.net/2/) — открытый протокол авторизации, который позволяет предоставить третьей стороне ограниченный доступ к защищённым ресурсам пользователя без необходимости передавать ей (третьей стороне) логин и пароль.

#### passport-youtube-v3

Предоставляет [механизм](https://github.com/yanatan16/passport-youtube-v3) аутентификации на Youtube посредством аккаунта Youtube и токенов [OAuth 2.0](https://oauth.net/2/).

Установка:

```bash
npm install passport-youtube-v3 --save
```

Пример:

```js
var passport = require('passport'),
    YoutubeV3Strategy = require('passport-youtube-v3').Strategy;

passport.use(new YoutubeV3Strategy({
    clientID: YOUTUBE_APP_ID,
    clientSecret: YOUTUBE_APP_SECRET,
    callbackURL: '/auth/youtube/callback',
    scope: ['https://www.googleapis.com/auth/youtube.readonly']
}, verify));
```

#### twitter

Клиентская [библиотека](https://www.npmjs.com/package/twitter) для работы с [Twitter REST APIs](https://dev.twitter.com/rest/public).

Установка:

```bash
npm install twitter --save
```

Пример:

```js
var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: '',
  consumer_secret: '',
  access_token_key: '',
  access_token_secret: ''
});

var params = {q: 'bem'};

client.get('search/tweets', params, function(error, tweets, response) {
  if (!error) {
    console.log(tweets);
  }
});
```

#### googleapis

Клиентская [библиотека](http://google.github.io/google-api-nodejs-client/) для работы с [Google REST APIs](https://developers.google.com/apis-explorer/#p/).

Установка:

```bash
npm install googleapis --save
```

Пример:

```js
var google = require('googleapis'),
    OAuth2 = google.auth.OAuth2;

var oauth2Client = new OAuth2(
  YOUR_CLIENT_ID,
  YOUR_CLIENT_SECRET,
  YOUR_REDIRECT_URL
);

oauth2Client.setCredentials({
  access_token: 'ACCESS TOKEN HERE',
  refresh_token: 'REFRESH TOKEN HERE'
});

var youtube = google.youtube({
    version: 'v3',
    auth: this.oauth2Client
});

var params = {q: 'bem'};

youtube.search.list(params, function(error, video, response) {
  if (!error) {
    console.log(video);
  }
});
```

### Подготовка структуры проекта

Прежде чем начать писать код, необходимо немного изменить структуру взятого за основу приложения **Hello, World**.

Изменения для:

* [статических файлов](#Изменения-для-статических-файлов);
* [серверного кода](#Изменения-для-серверного-кода).

#### Изменения для статических файлов

![static](https://rawgit.com/godfreyd/bem-in-dynamic/master/static/images/static-changes.svg)

**Директория `static`**

* Создайте поддиректории:

  * `css`;
  * `images`;
  * `js`.

* Перенесите фавиконку в поддиректорию `images`:

  `favicon.ico` —> `images/favicon.ico`

* Удалите файлы:

  * `index.min.js`;
  * `index.min.css`.

**Директория `.enb`**

* Отредактируйте файл `.enb/make.js`.

  Измените:

  ```js
  /* Изменение 1 */
  [techs.fileCopy, { source: '?.min.js', target: '../../static/?.min.js' }],
  [techs.fileCopy, { source: '?.min.css', target: '../../static/?.min.css' }]

  /* Изменение 2 */  
  nodeConfig.addTargets([
    '?.bemtree.js',
    '?.bemhtml.js',
    '../../static/?.min.js',
    '../../static/?.min.css'
  ]);
  ```

  На:

  ```js
  /* Изменение 1 */
  [techs.fileCopy, { source: '?.min.js', target: '../../static/js/?.min.js' }],
  [techs.fileCopy, { source: '?.min.css', target: '../../static/css/?.min.css' }]

  /* Изменение 2 */  
  nodeConfig.addTargets([
    '?.bemtree.js',
    '?.bemhtml.js',
    '../../static/js/?.min.js',
    '../../static/css/?.min.css'
  ]);
  ```

  [Полный код make.js](https://gist.github.com/godfreyd/e48e07abd314e124306b62b0b70780dc).

  > Теперь, сборщик [ENB](https://ru.bem.info/toolbox/enb/) при пересборке проекта будет копировать бандлы `index.min.js` и `index.min.css` в директории `static/js/` и `static/css/`.

**Директория `common.blocks`**

* Отредактируйте файл  `root/root.bemtree.js`.

  Измените:

  ```js
  favicon: '/favicon.ico',
  styles: [
      {
          elem: 'css',
          url: '/index.min.css'
      }
  ],
  scripts: [
      {
          elem: 'js',
          url: '/index.min.js'
      }
  ],
  ```

  На:

  ```js
  favicon: '/images/favicon.ico',
  styles: [
      {
          elem: 'css',
          url: '/css/index.min.css'
      }
  ],
  scripts: [
      {
          elem: 'js',
          url: '/js/index.min.js'
      }
  ],
  ```

  [Полный код root.bemtree.js](https://gist.github.com/godfreyd/fba71361207a95134982579c13b0050d).

**Директория `server`**

* Отредактируйте файл `index.js`.

  Измените:

  ```js
  .use(favicon(path.join(staticFolder, 'favicon.ico')))
  ```

  На:

  ```js
  .use(favicon(path.join(staticFolder, '/images/favicon.ico')))
  ```

  [Полный код index.js](https://gist.github.com/godfreyd/fdc6e2d7f1f42deac4dcfc0dde36bd11).

* Отредактируйте файл `rebuild.js`.

  Измените:

  ```js
  path.join(rootDir, 'static', '*.min.*'),
  ```

  На:

  ```js
  path.join(rootDir, 'static/js', '*.min.*'),
  path.join(rootDir, 'static/css', '*.min.*'),
  ```

  [Полный код rebuild.js](https://gist.github.com/godfreyd/ea8ee33850e42c48945d7ea3b4841b4a).

  > Теперь, [livereload](https://github.com/napcs/node-livereload) будет отслеживать изменения в директориях `static/js/` и `static/css/`.

**Файл `.gitignore`**

* Отредактируйте файл:

  Измените:

  ```bash
  static/index.min.*
  ```

  На:

  ```bash
  static/*/index.min.*
  ```

  [Полный код .gitignore](https://gist.github.com/godfreyd/c105ced43f2954950ce43e23d6929dbf).

В результате выполненных действий файловая структура директории `static` должна иметь следующий вид:

```files
static/                   
    css/
        index.min.css     # Оптимизированный файл стилей
    images/
        favicon.ico       # Фавиконка
    js/
        index.min.js      # Оптимизированный JavaScript-файл
```

#### Изменения для серверного кода

![server-changes](https://rawgit.com/godfreyd/bem-in-dynamic/master/static/images/server-changes.svg)

**Директория `server`**

* Создайте поддиректории:

  * `controllers` — контроллеры;
  * `helpers` — хелперы;
  * `middleware` — модули промежуточного звена.

* Создайте пустые `JS`-файлы для будущих модулей:

  * `app.js` — модуль монтирования промежуточных модулей (делает их доступными в приложении);
  * `auth.js` — модуль аутентификации на YouTube;
  * `routes.js` — модуль маршрутизации веб-запросов.

* Добавьте в `app.js` следующий контент:

  * [Полный код app.js](https://gist.github.com/godfreyd/a584cee1191833afae70fc059ba1f200).

    > **Примечание.** Порядок монтирования промежуточных функций важен. Поэтому при добавлении промежуточной функциональности всегда проверяйте то, что она находится с другими промежуточными модулями в отношениях, рекомендованных разработчиком.

* Добавьте в `routes.js` следующий контент:

  * [Полный код routes.js](https://gist.github.com/godfreyd/f6de1c33a83dda708a0e3ba9312f0c78).

* Измените расширение файла `config`:

  `config.js` —> `config.json`

* Отредактируйте файл `config.json`.

  Измените:

  ```js
  module.exports = {
      staticFolder: 'static',
      defaultPort: 3000,
      cacheTTL: 30000,
      sessionSecret: 'REPLACE_ME_WITH_RANDOM_STRING'
  };
  ```

  На:

  ```json
  {
    "staticFolder": "static",
    "defaultPort": 3000,
    "cacheTTL": 30000,
    "sessionSecret": "REPLACE_ME_WITH_RANDOM_STRING"
  }
  ```

* Отредактируйте файл `index.js`.

  Измените весь текущий контент на [следующий](https://gist.github.com/godfreyd/37d903c73f863619e2e1be1cd946d4c3).

  > **Примечание.** В `index.js` остается только функциональность, отвечающая за запуск приложения и прослушивание запросов на порте.

**Директория `controllers`**

* Создайте пустой `JS`-файл:

  * `index.js` — контроллер обработки запросов и рендеринга HTML.

* Добавьте в `index.js` следующий контент:

  * [Полный код index.js](https://gist.github.com/godfreyd/4bda7da3db029890378e15bcc38f32de).

**Директория `helpers`**

* Создайте пустые `JS`-файлы:

  * `index.js` — входная точка для хелперов;
  * `twitter.js` — модуль-хелпер для работы с Twitter Search API;
  * `youtube.js` — модуль-хелпер для работы с YouTube Data API.

**Директория `middleware`**

* Создайте пустой `JS`-файл:

  * `index.js` — модуль проверки прохождения аутентификации.

В результате выполненных действий файловая структура директории `server` должна иметь следующий вид:

```files
server/
    controllers/        
        index.js          # Контроллер обработки запросов и рендеринга HTML
    helpers/        
        index.js          # Входная точка для модулей-хелперов (пустой)
        twitter.js        # Модуль-хелпер для работы с Twitter Search API (пустой)
        youtube.js        # Модуль-хелпер для работы с YouTube Data API (пустой)
    middleware/       
        index.js          # Модуль проверки прохождения аутентификации (пустой)
    app.js                # Модуль монтирования промежуточных модулей
    auth.js               # Модуль аутентификации на YouTube (пустой)
    config.json           # Конфигурация приложения
    index.js              # Запуск приложения и прослушивание запросов на порте
    rebuild.js            # Модуль отслеживания изменений и перезапуска сервера
    render.js             # Рендеринг HTML
    routes.js             # Маршрутизатор
```


## Работа с Twitter Search API

[Twitter Search API](https://dev.twitter.com/rest/public/search) — это часть [Twitter REST APIs](https://dev.twitter.com/rest/public).

Позволяет найти последние или популярные твиты, опубликованные на сайте [Twitter.com](https://twitter.com/) за последние 7 дней.

**Формат ответа** — JSON.

* [Доступ к API](#Доступ-к-api)
* [Вызов API](#Вызов-api)

### Доступ к API

Для успешного вызова API необходимы:

* Корректные заголовки Accept и Content-Type: Twitter Search API поддерживает только один Mime-тип, application/x-www-form-urlencoded;charset=UTF-8. Любое другое значение приведет к ошибке формата данных.
* URL, составленный согласно требованиям к нужному запросу.
* OAuth-токен, выданный вашему приложению для доступа к API.

// TODO: дописать

### Вызов API

// TODO: дописать

## Работа с YouTube Data API

[YouTube Data API](https://developers.google.com/youtube/v3/) позволяет найти видеоролики, опубликованные на сайте [Youtube.com](https://www.youtube.com). По умолчанию в набор результата поиска включены следующие ресурсы: видео, каналы, списки воспроизведения. Можно настроить запросы только на получение определенного типа ресурса.

**Формат ответа** — JSON.

* [Доступ к API](#Доступ-к-api-1)
* [Вызов API](#Вызов-api-1)

### Доступ к API

Для успешного вызова API необходимы:

* Корректные заголовки Accept и Content-Type: YouTube Data API поддерживает только один Mime-тип, ????. Любое другое значение приведет к ошибке формата данных.
* URL, составленный согласно требованиям к нужному запросу.
* OAuth-токен, выданный вашему приложению для доступа к API.

Сервисы Google хранят различные данные пользователей — видео на Youtube, письма в Почте, фотографии на Фотках и так далее. Чтобы обеспечить удобный доступ к этим данным из других приложений или сторонних сервисов, Google использует открытый протокол авторизации [OAuth 2.0](https://oauth.net).

Согласно протоколу, разработчик регистрирует приложение на OAuth-сервере Google и запрашивает доступ к определённым данным. Авторизованный пользователь разрешает или запрещает его.

При использовании OAuth-протокола пользователь не вводит свой пароль в приложении, поэтому учётная запись не может быть скомпрометирована.

// TODO: дописать

### Вызов API

// TODO: дописать

* Добавьте в `server/config.json` поле `services` для хранения ключей и токенов YouTube и Twitter:

  ```json
    "services": {
        "twitter": {
            "consumer_key": "",
            "consumer_secret": "",
            "access_token_key": "",
            "access_token_secret": ""
        },
        "youtube": {
            "client_id": "",
            "client_secret": "",
            "redirect_url": ""
        }
    }
  ```

  [Полный код config.json](https://gist.github.com/godfreyd/3697d1ba5fe5ac298a9b471fe943340f).

* Добавьте файл `server/config.json` в `.gitignore`, чтобы случайно не добавить личные ключи в репозиторий файлов:

  ```bash
  server/config.json
  ```

  [Полный код .gitignore](https://gist.github.com/godfreyd/71a35fde50f54205fa395230bc97358f).
