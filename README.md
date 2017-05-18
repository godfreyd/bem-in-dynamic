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
  * [Работа с Twitter Search API](#)
  * [Работа с YouTube Data API](#)

## Введение

Динамическое приложение — это клиент-серверное приложение, ориентированное на обмен данными в режиме реального времени с последующей частичной или полной перезагрузкой текущей страницы.

Данный документ призван оказать  помощь в создании динамических приложений с использованием [БЭМ-платформы](https://ru.bem.info/platform/).

Мы создадим проект **Social Services Search Robot** (далее по тексту **SSSR**) для поиска подходящих твитов и видео по ключевому слову.

В работе будем руководствоваться и использовать:

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

## Приложение Hello, World

У программистов есть традиция: начинать программирование на новом языке или фреймворке с приложения **Hello, World**.

Это первое приложение, которое мы создадим. После чего модифицируем его до желаемого **SSSR**.

Нам понадобится локальная копия `bem-express`. Её можно сделать любым удобным для вас способом. Мы будем использовать [Git](https://git-scm.com).

> **Примечание.** Для пользователей OS X или Linux все команды выполняются в терминале. Пользователям Windows потребуется Git Bash. Убедитесь, что Git Bash запущен от имени администратора.

Чтобы создать приложение **Hello, World**, следуйте инструкции:

1. Склонируйте bem-express:

    ```bash
    git clone git@github.com:bem/bem-express.git sssr-project
    ```

    > **Примечание.** Текущая версия `bem-express`: 2.0.0.

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

    > **Примечание.** Если вы запускаете свое приложение в Windows, то, скорее всего, вы получите уведомление от Браундмауэра Windows. Отключите опцию *Общественные сети* (Public Network), установите опцию *Частные сети* (Private Network) и разрешите доступ.

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

### Файловая структура

Давайте рассмотрим как приложение **Hello, World** выглядит изнутри:

```files
sssr-project/
    .enb/                 # Конфигурационные файлы для сборщика ENB
    common.blocks/        # Базовые реализации блоков
    desktop.bundles/      # Директории бандлов проекта
    development.blocks/   # Блоки, подключаемые в процессе разработки (не для Production)  
    node_modules/         # Установленные модули
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

Ниже приводится подробное описание основных директорий:

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

Алгоритм сборки определен в файле `.enb/make.js`.

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

Cодержит файлы полученные в результате сборки. Такие файлы в БЭМ-методологии принято называть бандлами.

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

> **Примечание.** Единственным не автоматически сгенерированным файлом в директории `index` является файл `index.bemdecl.js`.

#### server

Содержит серверные скрипты:

```files
server/                   
    config.js             # Конфигурация приложения
    index.js              # Веб-сервер, обвязка над Express.js
    rebuild.js            # Пересборка приложения
    render.js             # Рендеринг HTML
```

#### static

Содержит статические файлы:

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

Технология [BEMDECL](https://ru.bem.info/methodology/declarations/) позволяет определить список БЭМ-сущностей, используемых на странице.

Такой список в БЭМ принято называть декларацией. Задача декларации — определить, что и в каком порядке подключать в сборку.

Декларации описываются в файлах с расширением `.bemdecl.js`.

Пример декларации из приложения **Hello, World**:

```js
// Файл `desktop.bundles/index/index.bemdecl.js`
exports.blocks = [
    { name: 'root' }
];  
```

Как видно из примера, в декларации определен только блок `root`. Можно сделать предположение, что все приложение построенно на основе одного блока. На самом деле нет.

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

Технология [DEPS](https://ru.bem.info/platform/deps/) позволяет определить зависимости между БЭМ-сущностями, которые разнесены по файловой структуре проекта и не отражены в [декларации](#bemdecl).

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

![BEMTREE](https://rawgit.com/godfreyd/bem-in-dynamic/master/static/images/bemtree.svg#####)

#### BEMHTML

Является частью шаблонизатора [bem-xjst](https://ru.bem.info/platform/bem-xjst/) и преобзазует BEMJSON-описание страницы в HTML.

Шаблоны описываются в файлах с расширением `.bemhtml.js`.

Вход и выход шаблонизатора:

![BEMHTML](https://rawgit.com/godfreyd/bem-in-dynamic/master/static/images/bemhtml.svg)

#### i-bem.js

## Приложение SSSR

// TODO: Написать вступление.

### Схема работы

![Chart of Social Services Search Robot](https://rawgit.com/godfreyd/bem-in-dynamic/master/static/images/chart.svg###ff)

#### Шаг 1. Получение данных

Приложение получает запрос от пользователя и обращается за данными к [Twitter Search API](https://dev.twitter.com/rest/public/search) и [YouTube Data API](https://developers.google.com/youtube/v3/docs/search/list).

Генерация запроса и подготовка полученных данных для дальнейшей шаблонизации более подробно рассматриваются в разделах:

* [Работа с Twitter Search API](#).
* [Работа с YouTube Data API](#).

#### Шаг 2. BEMTREE-шаблонизация

После того как данные были получены, их необходимо добавить тем блокам, которые их ожидают. За обработку полученных данных отвечает [BEMTREE](#bemtree).

#### Шаг 3. BEMHTML-шаблонизация

После того как итоговый BEMJSON был достроен необходимыми данными, его неоходимо преобразовать в HTML. За компиляцию результирующего BEMJSON в HTML отвечает [BEMHTML](#bemhtml).

### Модули Node

В этом разделе мы ближе познакомимся с концепцией модуля Node и рассмотрим основные модули, необходимые для работы приложения.

> **Важно!** В разделе не рассматриваются все используемые модули. Подробно с необходимым модулем можно ознакомиться на сайте [npm](https://www.npmjs.com).

Базовая реализация Node остается настолько простой, насколько это возможно. Вместо того, чтобы встраивать все возможные компоненты прямо в Node, разработчики предоставляют дополнительную функциональность в виде модулей.

Система модулей Node построена по образцу системы модулей [CommonJS](https://en.wikipedia.org/wiki/CommonJS), механизма создания взаимодействующих модулей. Центральное место в системе занимает контракт, который должен выполняться разработчиками, чтобы их модули нормально взаимодействовали с другими модулями.

Все модули установленные с помощью менеджера пакетов npm находятся в директории `node_modules`.

Подключение модулей происходит при помощи команды `require`. Если модуль установлен с использованием npm, указывать путь не нужно. Достаточно указать имя:

```js
var http = require('http');
```

Если мы подключаем собственный локальный модуль, необходимо указать путь к нему:

```js
var someModule = require('./somefolder/somemodule');
```

Важной особенностью любого модуля является то, что он должен быть расчитан на взаимодействие с Node. Для этого его нужно экспортировать с помощью объекта `exports`:

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

// Экпортируем экземпляр
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

#### passport

#### passport-youtube-v3

#### twitter

#### googleapis


### Подготовка структуры проекта

Прежде чем начать писать код, необходимо немного изменить структуру взятого за основу приложения **Hello, World**.

* Сначала мы создадим в директории `static` поддиректории `css`, `images`, `js` для удобства хранения статических файлов:

  ```files
  static/
      css/        
      images/             
      js/        
  ```

* Теперь, чтобы сборщик ENB при пересборке проекта копировал бандлы `index.min.js` и `index.min.css` в нужные директории, необходимо внести изменения в конфигурацию сборщика (файл `.enb/make.js`).

  Меняем:

  ```js
  [techs.fileCopy, { source: '?.min.js', target: '../../static/?.min.js' }],
  [techs.fileCopy, { source: '?.min.css', target: '../../static/?.min.css' }]
  /* ... */

  nodeConfig.addTargets(['?.bemtree.js', '?.bemhtml.js', '../../static/?.min.js', '../../static/?.min.css']);
  /* ... */
  ```

  На:

  ```js
  [techs.fileCopy, { source: '?.min.js', target: '../../static/js/?.min.js' }],
  [techs.fileCopy, { source: '?.min.css', target: '../../static/css/?.min.css' }]
  /* ... */

  nodeConfig.addTargets(['?.bemtree.js', '?.bemhtml.js', '../../static/js/?.min.js', '../../static/css/?.min.css']);
  /* ... */
  ```

* Переносим фавиконку в директорию `images`, а лежащие в корне `static` файлы `index.min.js`, `index.min.css` удаляем.

* Вносим изменения в файл `server/index.js`.

  Меняем:

  ```js
  .use(favicon(path.join(staticFolder, 'favicon.ico')))
  ```

  На:

  ```js
  .use(favicon(path.join(staticFolder, '/images/favicon.ico')))
  ```

* Осталось внести изменения в шаблон блока `root`.

  Меняем:

  ```js
  /* ... */
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
  /* ... */
  ```

  На:

  ```js
  /* ... */
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
  /* ... */
  ```

* Пересобираем проект:

  ```js
  npm run dev
  ```
