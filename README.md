# Создаем динамический проект на БЭМ

* [Обзор](#Обзор)
* [Шаблонный репозиторий](#Шаблонный-репозиторий)
* [Простейшее приложение Hello, World](#Простейшее-приложение-hello-world)
* [Файловая структура проекта](#Файловая-структура-проекта)
  * [desktop.bundles](#desktopbundles)
  * [common.blocks](#commonblocks)
  * [server](#server)
  * [static](#static)
* [Сборка](#Сборка)
* [Схема работы приложения Social Services Search Robot](#Схема-работы-приложения-social-services-search-robot)
* [Клиентская часть](#)
* [Серверная часть](#)
  * [Работа с Twitter Search API](#)
  * [Работа с YouTube Data API](#)
  * [BEMTREE-шаблонизация](#)
  * [BEMHTML-шаблонизация](#)

## Обзор

Этот документ посвящен созданию динамического приложения с использованием [БЭМ-платформы](https://ru.bem.info/platform/).

Мы создадим проект (**Social Services Search Robot**) для поиска подходящих твитов и видео по ключевому слову.

В работе будем руководствоваться и использовать:

* принципы работы с [CSS по БЭМ](https://ru.bem.info/methodology/css/);
* фреймворк [i-bem.js](https://ru.bem.info/platform/i-bem/);
* шаблонизатор [bem-xjst](https://ru.bem.info/platform/bem-xjst/);
* технологию для описания зависимостей [DEPS](https://ru.bem.info/platform/deps/);
* [YouTube Data API](https://developers.google.com/youtube/v3/docs/search/list);
* [Twitter Search API](https://dev.twitter.com/rest/public/search).

После прочтения вы сможете быстро и с небольшими усилиями разрабатывать собственные веб-приложения, ориентированные на динамические данные.

Обратите внимание, что для работы с примерами, описанными в документе, нужно иметь базовые навыки:

* HTML.
* CSS.
* JavaScript.
* БЭМ.

> **Важно** В документе не рассматриваются вопросы верстки и клиентского JS. Цель документа — показать как разрабатывать динамические проекты по БЭМ, используя полный стек технологий.

## Шаблонный репозиторий

Для создания динамических проектов по БЭМ разработан шаблонный репозиторий [bem-express](https://github.com/bem/bem-express). Он содержит необходимый минимум конфигурационных файлов и позволяет быстро развернуть свой проект.

В `bem-express` по умолчанию подключены основные библиотеки:

* [bem-core](https://github.com/bem/bem-core)
* [bem-components](https://github.com/bem/bem-components)

Для начала работы с шаблонным репозиторием на вашей машине необходимо установить [Node.js 4+](https://nodejs.org).

> **Важно** Пользователям операционной системы Windows необходимо дополнительно установить [Git Bash](https://git-for-windows.github.io).

## Простейшее приложение Hello, World

У программистов есть традиция: начинать программирование на новом языке или фреймворке с приложения **Hello, World**.

Это первое приложение, которое мы создадим. После чего модифицируем его до желаемого **Social Services Search Robot**.

Нам понадобится локальная копия `bem-express`. Её можно сделать любым удобным для вас способом. Мы будем использовать [Git](https://git-scm.com).

> **Примечание** Для пользователей OS X или Linux все команды выполняются в терминале. Пользователям Windows потребуется Git Bash. Убедитесь, что Git Bash запущен от имени администратора.

Для того чтобы создать приложение **Hello, World**, выполните описанные ниже действия.

1. Склонируйте bem-express:

    ```bash
    git clone git@github.com:bem/bem-express.git sssr-project
    ```

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

5. Устанавите зависимости:

    ```bash
    npm install
    ```

    > **Примечание** Не используйте права суперпользователя (`root`) при установке npm- и bower-зависимостей. Bower-зависимости ставятся при выполнении `npm postinstall` в директории `libs`.

6. Соберите проект и запустите сервер:

    ```bash
    npm run dev
    ```

    > **Примечание** Сборка происходит с помощью [ENB](https://ru.bem.info/toolbox/enb/).

    В результате в командной строке вы увидите следующее сообщение:

    `Server is listening on 3000`

    > **Примечание** Если порт `3000` уже используется другой программой, его можно переназначить в файле `server/config.js`. Например, на `8000`:
    >
    > ```js
    > defaultPort: 8000,
    > ```

    На вашем компьютере запустился:

    * сервер, который будет выполнять код, отвечающий за обработку динамических данных;
    * [nodemon](https://github.com/remy/nodemon/), который будет следить за изменениями на файловой структуре и перезапускать сервер;
    * [chokidar](https://github.com/paulmillr/chokidar), который будет следить за изменениями в директориях `*.blocks/` и перестраивать структуру проекта;
    * [livereload](https://github.com/napcs/node-livereload), который будет обновлять страницу в браузере.

7. Откройте браузер и введите адрес [http://localhost:3000](http://localhost:3000).

    Должна открыться страница со следующим контентом:

    ```text
    Index page content
    footer content
    ```

    > **Примечание** Если вы запускаете свое приложение в Windows, то, скорее всего, вы получите уведомление от Браундмауэра Windows. Отключите опцию *Общественные сети* (Public Network), установите опцию *Частные сети* (Private Network) и разрешите доступ.

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

## Файловая структура проекта

После прохождения вышеописаных шагов, файловая структура проекта должна иметь следующий вид.

```files
sssr-project/
    .enb/                 # Конфигурационные файлы для сборщика ENB
    common.blocks/        # Базовые реализации блоков
    desktop.bundles/      # Директории бандлов проекта
    development.blocks/   # Блоки, подключаемые в процессе разработки (не для Production)  
    libs/                 # Библиотеки
    node_modules/         # Пакеты
    server/               # Директория с серверным кодом
    static/               # Корневая директория для раздачи статических файлов
    .borschik             # Конфигурация сборщика файлов Borschik
    .bowerrc              # Конфигурация менеджера пакетов Bower
    README.md             # Текстовое описание проекта
    bower.json            # Список зависимостей для Bower
    nodemon.json          # Конфигурация для пакета Nodemon
    package.json          # Описание проекта для npm
```

### desktop.bundles

Cодержит [декларации](#bemdecljs) и [бандлы](https://ru.bem.info/methodology/build/#Введение) страниц проекта.

Бандлы — это файлы полученные в результате сборки.

Обычно одной директории бандла соответствует одна страница проекта:

```files
desktop.bundles/
    index/                # Бандлы для страницы `index`
        index.bemdecl.js  # Декларация для страницы `index`
        index.bemhtml.js  # Бандл страницы `index` в технологии реализации BEMHTML
        index.bemtree.js  # Бандл страницы `index` в технологии реализации BEMTREE
        index.css         # Бандл страницы `index` в технологии реализации CSS
        index.js          # Бандл страницы `index` в технологии реализации JS

    about/                # Бандлы для страницы `about`
        about.bemdecl.js  # Декларация для страницы `about`
        about.bemhtml.js  # Бандл страницы `about` в технологии реализации BEMHTML
        about.bemtree.js  # Бандл страницы `about` в технологии реализации BEMTREE
        about.css         # Бандл страницы `about` в технологии реализации CSS
        about.js          # Бандл страницы `about` в технологии реализации JS

```

Однако иногда бывает удобно иметь возможность не пересобирать каждый раз куски кода общие для всего проекта (например,  блоки `header`, `footer`). Для них собирают отдельные бандлы:

```files
desktop.bundles/
    index/                # Бандлы для страницы `index`
    about/                # Бандлы для страницы `about`
    header/               # Бандлы для блока `header`
    footer/               # Бандлы для блока `footer`
```

Наш проект одностраничный и очевидно, что директория `desktop.bundles` будет иметь следующий вид:

```files
desktop.bundles/
    index/                # Бандлы для страницы `index`
```

### common.blocks

Содержит все [БЭМ-сущности](https://ru.bem.info/methodology/key-concepts/#БЭМ-сущность) проекта.

Имена файлов и директорий БЭМ-сущностей соответствуют [соглашению по именованию](https://ru.bem.info/methodology/naming-convention/):

```files
common.blocks/
    page/                # Директория блока `page`
        __inner/         # Поддиректория элемента `page__inner`
        _theme/          # Поддиректория модификатора `page_theme`
        _view/           # Поддиректория модификатора `page_view`
```

Код разделяется на мелкие независимые части для удобства работы с отдельными блоками:

```files
common.blocks/
    page/
        page.bemhtml.js  # Реализация блока `page` в технологии BEMHTML
        page.bemtree.js  # Реализация блока `page` в технологии BEMTREE  
        page.deps.js     # Реализация блока `page` в технологии DEPS
        page.post.css    # Реализация блока `page` в технологии PostCSS
```

Перед отправкой в браузер файлы [собираются](#Сборка) и оптимизируются.

### server

### static

## Технологии

* [Обзор](#)
* [bemdecl.js](#)
* [deps.js](#)
* [bemtree.js](#)
* [bemhtml.js](#)

### bemdecl.js

**Декларация**

Как упоминалось ранее, кроме бандлов для каждой страницы определяется декларация. Декларация описывается в `*.bemdecl.js`-файле и представляет собой список БЭМ-сущностей, используемых на странице.

**Пример**

```js
exports.blocks = [
  { name: 'header' },
  { name: 'body' },
  { name: 'footer' }
];
```

В нашей локальной копии `bem-express` задекларирован блок `root`:

**Пример**

```js
exports.blocks = [
    { name: 'root' }
];  
```

## Схема работы приложения Social Services Search Robot

![Chart of Social Services Search Robot](https://rawgit.com/godfreyd/bem-in-dynamic/master/static/images/chart.svg)

### Шаг 1. Получение данных

Приложение получает запрос от пользователя и обращается за данными к API Twitter и YouTube.

Генерация запроса и подготовка полученных данных для дальнейшей шаблонизации более подробно рассматриваются в разделах:

* [Работа с Twitter Search API](#).
* [Работа с YouTube Data API](#).

### Шаг 2. BEMTREE-шаблонизация

После того как данные были получены, их необходимо добавить тем блокам, которые их ожидают. Как и в примере с приложением **Hello, World**, за обработку полученных данных отвечает **BEMTREE** (файлы с расширением `.bemtree.js`).

**BEMTREE** является частью шаблонизатора [bem-xjst](https://ru.bem.info/platform/bem-xjst/) и преобзазует [BEMJSON](https://ru.bem.info/platform/bemjson/) с данными в BEMJSON с БЭМ-деревом.

Подробное описание шага рассматривается в разделе [BEMTREE-шаблонизация](#).

### Шаг 3. BEMHTML-шаблонизация

После того как итоговый BEMJSON был достроен необходимыми данными, его неоходимо преобразовать в HTML.

**BEMHTML** является частью шаблонизатора `bem-xjst` и преобзазует BEMJSON в HTML.

Подробное описание шага рассматривается в разделе [BEMHTML-шаблонизация](#).

### Декларация БЭМ-сущностей


Такое различие обусловлено описанием в `bem-express` [зависимостей](https://ru.bem.info/platform/deps/), для блоков, которые не отражены в декларации. Таким образом, блок `root` является некой отправной точкой для сборщика. Далее сборка просходит по зависимостям.

Для более легкого восприятия удобно олицетворять зависимости с глаголом **«ЗНАЕТ»**. Проинспектировав `deps.js`-файлы в локальной копии `bem-express`, можно представить, как по зависимостям собираются нужные для страницы БЭМ-сущности:

![sheme](https://rawgit.com/bem-site/bem-method/godfreyd-bem-in-dynamic/articles/start-with-bem-express/scheme.ru.svg)

Данная схема равносильна такой декларации:

```js
exports.blocks = [
  { name: 'header' },
  { name: 'logo' },
  { name: 'body' },
  { name: 'footer' }
];
```

## load()

* [Структура проекта]()
* [Реализация блоков в технологии BEMTREE]()
* [Реализация блоков в технологии DEPS]()



### Структура проекта

Прежде чем мы начнем писать код, необходимо определить основные структурные блоки проекта.

![Social Search Robot](ssr-main-blocks.png)

Структуру страницы составляют следующие блоки:

1. `page`;
2. `header`;
3. `home`;
4. `result`;
5. `footer`.

### Реализация блоков в технологии BEMTREE


#### Блок `page`

*page.bemtree.js*

```js
block('page').content()(function() {
    return [
        {
            block: 'header'
        },
        {
            block: 'home'
        },
        {
            block: 'result'
        },
        {
            block: 'footer'
        }
    ];
});
```

#### Блок `header`

#### Блок `home`

#### Блок `result`

#### Блок `footer`





### Создание блока


### Переопределение библиотечных блоков

### Создание кастомных блоков


## Устранение неполадок

Если ваш код не работает:

* Ищите опечатки. Помните, что язык JavaScript чувствителен к регистру символов.
* Используйте для выявления проблем отладчик JavaScript, например, отладчик в составе набора инструментов Яндекс.Браузера. Начните поиск ошибок в консоли JavaScript.
* Проверьте все ли зависимости указаны.
* Ознакомьтесь с нашим [примером реализации](#).
* Задавайте вопросы на [форуме](https://ru.bem.info/forum/).




Almost the same as [project-stub](https://github.com/bem/project-stub/) but with [BEMTREE](https://en.bem.info/technology/bemtree/) and [Express](http://expressjs.com/).

[![Build Status](https://travis-ci.org/bem/bem-express.svg?branch=master)](https://travis-ci.org/bem/bem-express)

## Installation

```sh
git clone https://github.com/bem/bem-express.git
cd bem-express
npm i
```

## Development

```sh
npm run dev
```
will run initial `enb make` command and then start the server with `nodemon` which will restart it on any server file update. Also `chokidar` will watch for changes in `*.blocks/**` and rebuild the project automatically. Then livereload will update the page in the browser.

You may also set `NO_LIVERELOAD` env variable to switch livereload off:
```sh
NO_LIVERELOAD=1 npm run dev
```

You may also run rebuild manually with `enb make` or with external watcher (e.g. `npm run watch`). To switch off automatic rebuild use `NO_AUTOMAKE` env variable:
```sh
NO_AUTOMAKE=1 npm run dev
```

## Production

```sh
YENV=production enb make
NODE_ENV=production node server
```

## Templating

Templating starts in `root` block which replaces itself with `page` or any other context (if specified as argument to `render` function).

## Pro tips

Run server in dev mode with `NODE_ENV=development` environment variable (`nodemon` will set it for you).

In dev mode

* Add `?json=1` to URL to see raw data
* Add `?bemjson=1` to URL to see BEMJSON generated with BEMTREE templates.
