# Изучаем БЭМ — переходим на сторону сервера

<p align="right">
<small>Сначала вы его отрицаете, потом вы его ненавидите, </br>а потом вы не можете без него жить.</small></br>
<small><i>Артем Курбатов. Из доклада «БЭМ: мастер-класс» от 02.11.2013</i></small>
</p>

* [Введение](#Введение)
* [Используемые обозначения](#Используемые-обозначения)
* [Используемые технологии](#Используемые-технологии)
* [Приложение Hello, World](#Приложение-hello-world)
  * [Шаблонный репозиторий](#Шаблонный-репозиторий)
  * [Быстрый старт](#Быстрый-старт)
* [Приложение Social Services Search Robot](#Приложение-social-services-search-robot)
  * [Схема работы приложения](#Схема-работы-приложения)
  * [Используемые модули Node](#Используемые-модули-node)
  * [Подготовка структуры проекта](#Подготовка-структуры-проекта)
  * [Получение OAuth-токенов](#Получение-oauth-токенов)
  * [Конфигурация приложения](#Конфигурация-приложения)
  * [Работа с Twitter Search API](#Работа-с-twitter-search-api)
  * [Работа с YouTube Data API](#Работа-с-youtube-data-api)
  * [Верстка](#Верстка)

## Введение

Методология БЭМ существует достаточно долго и принята на вооружение такими крупными компаниями, как Яндекс, Google, EPAM Systems, BBC, Alfa Bank. При этом она все еще вызывает беспокойство у типичного разработчика и менеджера проектов среднего звена.

У некоторых смельчаков изучение БЭМ не ушло дальше ограничения возможностей CSS для получения более предсказуемых результатов. И хотя БЭМ давно вышел за пределы верстки, до сих пор на вопрос: «Знаете ли вы БЭМ?», можно услышать: «Конечно, это про подчеркивания в классах».

Если ваше представление о БЭМ близко к этому, я отвечу вам словами работодателя при приеме на работу новоиспеченного выпускника: «Забудьте о том, что вы слышали о БЭМ ранее». Методология БЭМ настолько интересна, насколько большинству о ней ничего не известно. Чтобы понять всю прелесть БЭМ, необходимо иметь представление обо всех технологиях, библиотеках, фреймворках и инструментах, которые БЭМ предоставляет. Изучите их, оставайтесь инопланетянином, ребенком, который удивляется тому, с чем взрослые смирились.

**Что для меня БЭМ?**

Наверняка вы слышали истории, как дерзкие вундеркинды, закрывшись в гараже, изобрели очередной стартап. Первые успехи позволили им привлечь инвестиции и выйти на рынок с потрясающим продуктом. Как это им удалось, как удалось выдержать пиковые нагрузки и не погрязнуть в вечном рефакторинге? Как надо, чтобы не как обычно?

БЭМ — это лайфхак для стартаперов. По сравнению со многими другими фреймворками и технологиями начало работы с БЭМ требует определенных усилий, но это окупается архитектурой, обеспечивающей устойчивую расширяемость. Во все технологии, фреймворки и библиотеки БЭМ изначально заложены принципы декларативного подхода. И именно это делает их такими непонятными на первый взгляд и любимыми в итоге.

Прочитав данную статью вы не постигните дзен БЭМ, но точно сможете ответить взрослым, что научились создавать полноценные динамические проекты по БЭМ, используя не только CSS. И если завтра ваше приложение постигнет участь в +10 К пользователей в сутки, будьте спокойны — у вас останется времени отметить это событие.

Цель статьи — дать вам представление о базовой функциональности технологий БЭМ. Мы сознательно не будем рассматривать вопросы верстки и клиентского JavaScript, чтобы избежать участи «подчеркивания в классах».

**Что мы будем разрабатывать?**

Поисковое приложение **Social Services Search Robot** (сокр. **SSSR**), которое по запросу покажет последние твиты и видео с YouTube.

Будем использовать:

* фреймворк [i-bem.js](https://ru.bem.info/platform/i-bem/);
* шаблонизатор [bem-xjst](https://ru.bem.info/platform/bem-xjst/);
* технологию для описания зависимостей [DEPS](https://ru.bem.info/platform/deps/);
* [Express.js](http://expressjs.com);
* [YouTube Data API](https://developers.google.com/youtube/v3/docs/search/list);
* [Twitter Search API](https://dev.twitter.com/rest/public/search).

Для начала потребуется установить:

* [Node.js 4+](https://nodejs.org)
* [Git](https://git-scm.com)

> **Важно!** Пользователям операционной системы Windows необходимо дополнительно установить [Git Bash](https://git-for-windows.github.io).

## Используемые обозначения

Чтобы статья получилась ярче, мы немного порисуем:

* ![folder](https://rawgit.com/godfreyd/bem-in-dynamic/master/static/images/icons/folder.svg) — директория;
* ![file](https://rawgit.com/godfreyd/bem-in-dynamic/master/static/images/icons/file.svg) — файл;
* ![add folder](https://rawgit.com/godfreyd/bem-in-dynamic/master/static/images/icons/add-folder.svg) — создать директорию;
* ![add file](https://rawgit.com/godfreyd/bem-in-dynamic/master/static/images/icons/add-file.svg) — создать файл;
* ![edit file](https://rawgit.com/godfreyd/bem-in-dynamic/master/static/images/icons/edit-file.svg) — отредактировать файл.

## Используемые технологии

В БЭМ нет разделения технологий на главные и второстепенные. Есть набор, а выбор применения определяется индивидуально:

* [BEMDECL](#bemdecl) — технология для описания деклараций в БЭМ.
* [DEPS](#deps) — технология для описания зависимостей в БЭМ.
* [BEMTREE](#bemtree) — шаблонизатор преобразующий данные в BEMJSON.
* [BEMHTML](#bemhtml) — шаблонизатор преобразующий BEMJSON в HTML.
* [i-bem.js](#i-bemjs) — JavaScript-фреймворк для БЭМ.

> Подробнее о [BEMJSON-формате](https://ru.bem.info/platform/bemjson/) входных данных.

Давайте рассмотрим их подробнее.

### BEMDECL

Определяет список [БЭМ-сущностей](https://ru.bem.info/methodology/key-concepts/#БЭМ-сущность) для страницы.

Такой список в БЭМ называется [декларацией](https://ru.bem.info/methodology/declarations/). Задача декларации — определить, что и в каком порядке подключать в сборку.

Декларации описываются в файлах с расширением `.bemdecl.js`.

**Пример**

```js
exports.blocks = [
    { name: 'page' },
    { name: 'header' },
    { name: 'body' },
    { name: 'footer' }
];  
```

Когда количество блоков переходит рубеж «легко запомнить», возникает проблема их перечисления в нужном порядке. Поэтому обычно декларируют какой-то определенный блок, который следует рассматривать как центральную «точку входа».

Все остальные БЭМ-сущности попадают в сборку по [зависимостям](#deps).

### DEPS

Определяет [зависимости](https://ru.bem.info/platform/deps/) между БЭМ-сущностями, которые разнесены по файловой структуре проекта и не отражены в декларации.

Зависимости описываются в виде JavaScript-объекта в файлах с расширением `.deps.js`.

**Пример**

```js
/* page зависит от header */
({
    block: 'page',
    shouldDeps: [
        { block: 'header' }
    ]
})
```

Название технологии происходит от английского слова dependence и обозначает желание подключить в сборку какую-то БЭМ-сущность. Изучающие БЭМ порой забывают о декларативности технологий и недоумевают: почему для описанного в шаблоне блока, не собираются его стили и скрипты.

**Помните:** когда вы описываете шаблон ([BEMHTML](#bemhtml) или [BEMTREE](#bemtree)) с каким-то блоком внутри (дочерний узел), вы просто добавляете новый HTML-элемент. Чтобы стили и скрипты этого блока попали в сборку, необходимо описать зависимость от него.

Например, для того чтобы добавить в сборку блоки `header`, `body` и `footer`, необходимо описать зависимость от них:

```js
/* page зависит от header, body, footer */
({
    block: 'page',
    shouldDeps: [
      'header',
      'body',
      'footer'
    ]
})
```

Нижеследующая схема показывает логику сборки по зависимостям:

```files
index(DECL)               # Декларация блока page
|
└──> page(DEPS)           # Зависимость блока page от header, body, footer
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

### BEMTREE

Является частью шаблонизатора [bem-xjst](https://ru.bem.info/platform/bem-xjst/) и преобразует данные в BEMJSON.

Шаблоны описываются в BEMJSON-формате в файлах с расширением `.bemtree.js`.

Вход и выход шаблонизатора:

![BEMTREE](https://rawgit.com/godfreyd/bem-in-dynamic/master/static/images/bemtree.svg)

### BEMHTML

Является частью шаблонизатора [bem-xjst](https://ru.bem.info/platform/bem-xjst/) и преобразует BEMJSON-описание страницы в HTML.

Шаблоны описываются в файлах с расширением `.bemhtml.js`.

Вход и выход шаблонизатора:

![BEMHTML](https://rawgit.com/godfreyd/bem-in-dynamic/master/static/images/bemhtml.svg)

### i-bem.js

Клиентский [JavaScript-фреймворк](https://ru.bem.info/platform/i-bem/) для веб-разработки в рамках БЭМ-методологии.

JavaScript-код описывается в файлах с расширением `.js`.

Позволяет:

* разрабатывать веб-интерфейс в терминах блоков, элементов, модификаторов;
* описывать логику работы блока в декларативном стиле — как набор состояний;
* легко интегрировать код JavaScript с BEMHTML-шаблонами и CSS;
* гибко переопределять поведение библиотечных блоков.

## Приложение Hello, World

У программистов есть традиция: начинать программирование на новом языке или фреймворке с приложения **Hello, World**. Приложение обычно выводит слова «Hello, World» в выходной поток, демонстрируя тем самым, что оно запускается и выполняет операции ввода/вывода.

Давайте создадим его, а затем расширим до желаемого **SSSR**.

Нам потребуется локальная копия [шаблонного репозитория bem-express](#Шаблонный-репозиторий). Ее можно сделать с помощью Git.

> **Примечание.** Для пользователей OS X или Linux все команды выполняются в терминале. Пользователям Windows потребуется Git Bash. Убедитесь, что Git Bash запущен от имени администратора.

### Шаблонный репозиторий

При решении задач по разработке динамических приложений в рамках БЭМ создан шаблонный репозиторий [bem-express](https://github.com/bem/bem-express). Он содержит необходимый минимум конфигурационных файлов и решает целый класс задач, таких как сборка проекта, настройка линтеров, подключение библиотек и др.

В него по умолчанию подключены основные БЭМ-библиотеки:

* [bem-core](https://ru.bem.info/platform/libs/bem-core/);
* [bem-components](https://ru.bem.info/platform/libs/bem-components/).

### Быстрый старт

Чтобы создать приложение **Hello, World**:

1. Склонируйте bem-express:

    ```bash
    git clone https://github.com/bem/bem-express.git sssr-project
    ```

    > **Примечание.** В данном примере используется `bem-express` версии 2.00.

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

    > **Примечание.** За сборку отвечает [ENB](https://ru.bem.info/toolbox/enb/).

    При запуске приложения в терминале выводится сообщение о том, что сервер выполняется на порте 3000:

    `Server is listening on 3000`.

    > **Примечание.** Если порт `3000` используется другой программой, его можно переназначить. Например, на `8000`:
    >
    > Способ 1. Изменение значения при запуске приложения.
    >
    > ```bash
    > PORT=8000 npm run dev
    > ```
    >
    > Способ 2. Изменение значения по умолчанию в файле `server/config.js`.
    >
    > ```js
    > defaultPort: 8000,
    > ```

    На компьютере запустился:

    * сервер — отвечает за обработку динамических данных;
    * [nodemon](https://github.com/remy/nodemon/) — следит за изменениями в [файловой структуре](https://ru.bem.info/methodology/filestructure/) и перезапускает сервер;
    * [chokidar](https://github.com/paulmillr/chokidar) — следит за изменениями в файлах директорий `*.blocks/` и перестраивает структуру проекта;
    * [livereload](https://github.com/napcs/node-livereload) — обновляет страницу в браузере.

7. Откройте браузер и введите адрес [localhost:3000](http://localhost:3000).

    Должна открыться страница со следующим контентом:

    ```text
    Index page content
    footer content
    ```

    > **Примечание.** Если при запуске приложения в Windows, выводится уведомление от Брандмауэра:
    >
    > 1. Отключите опцию *Общественные сети* (Public Network).
    > 2. Установите опцию *Частные сети* (Private Network).
    > 3. Разрешите доступ.

8. Откройте файл `server/index.js` и внесите следующие изменения (см. комментарии) в код начинающегося строкой `app.get('/', function(req, res)`:

    ```js
    /**
     * Функция обрабатывает все GET-запросы с главной страницы приложения
     * @function
     * @param {object} req - Запрос.
     * @param {object} res - Ответ.
     */
    app.get('/', function(req, res) {
        var hello = 'Hello';                  // Инициализируем переменную `hello`
        var world = 'World';                  // Инициализируем переменную `world`
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
            hello: hello,                     // Передаем переменную `hello` в `this.data.hello`
            world: world                      // Передаем переменную `world` в `this.data.world`
        })
    });
    ```

9. Откройте файл `common.blocks/page-index/page-index.bemtree.js` и замените его содержимое на следующее:

    ```js
    block('page-index').content()(function() {
        // Получаем данные из глобального объекта `this`
        var data = this.data;
        // Возвращаем полученные данные: `data.hello: 'Hello'`, `data.world: 'World'`
        return data.hello + ', ' + data.world;
    });
    ```

    После сохранения сервер автоматически перезапустится и контент страницы изменится на:

    ```text
    Hello, World
    footer content
    ```

Приложение **Hello, World** готово.

**Не получилось?**

Если при создании приложения возникли сложности, поищите решение на [форуме](https://ru.bem.info/forum/). Если готового ответа не нашлось, задайте вопрос.

## Приложение Social Services Search Robot

Собственно мы дошли до шага разработки приложения **SSSR**. Напомню, что по запросу приложение будет выводить последние твиты и видео с YouTube.

Сразу забежим в недалекое будущее — выглядеть приложение будет так:

![Demo](static/images/demo.png#000)

### Схема работы приложения

Схематично работу приложения можно представить следующим образом:

![Chart of Social Services Search Robot](https://rawgit.com/godfreyd/bem-in-dynamic/master/static/images/chart.svg)

#### Шаг 1. Запрос

Пользователь отправляет запрос на сервер.

#### Шаг 2. Получение данных

Приложение обращается за данными к [Twitter Search API](https://dev.twitter.com/rest/public/search) и [YouTube Data API](https://developers.google.com/youtube/v3/docs/search/list) в соответствии с полученным запросом.

#### Шаг 3. BEMTREE-шаблонизация

Приложение передает полученные данные [BEMTREE-шаблонизатору](#bemtree), который преобразует данные в BEMJSON.

#### Шаг 4. BEMHTML-шаблонизация

Приложение передает BEMJSON [BEMHTML-шаблонизатору](#bemhtml), который преобразует BEMJSON в HTML.

#### Шаг 5. Отправка результата пользователю

Приложение возвращает результат (HTML-страницу) пользователю.

### Используемые модули Node

Базовая реализация Node остается настолько простой, насколько это возможно. Вместо того, чтобы встраивать все возможные компоненты прямо в Node, разработчики предоставляют дополнительную функциональность в виде отдельных модулей (пакетов).

Система модулей Node построена по образцу системы [CommonJS](https://en.wikipedia.org/wiki/CommonJS), механизма создания взаимодействующих модулей. Центральное место в системе занимает контракт, который должен выполняться разработчиками, чтобы их модули нормально взаимодействовали с другими.

Все пакеты установленные с помощью менеджера пакетов npm находятся в директории `node_modules`.

Подключение модулей происходит при помощи команды `require`. Если пакет установлен с использованием npm, указывать путь не нужно. Достаточно указать имя:

```js
var express = require('express');
```

При подключении собственного локального модуля, необходимо указать к нему путь:

```js
var someModule = require('./somefolder/somemodule');
```

Важной особенностью любого модуля является то, что он должен быть рассчитан на взаимодействие с Node. Для этого модуль нужно экспортировать с помощью `module.exports`:

```js
module.exports = {
    // some module
};
```

Для работы приложения потребуются следующие модули:

* [express](http://expressjs.com/ru/) — предоставляет большую часть функциональности, необходимой для построения веб-приложения;
* [passport](http://passportjs.org) — предоставляет различные стратегии аутентификации для приложений Node.js;
* [passport-youtube-v3](https://github.com/yanatan16/passport-youtube-v3) — предоставляет механизм аутентификации на Youtube посредством аккаунта Youtube и токенов [OAuth 2.0](https://oauth.net/2/);
* [twitter](https://www.npmjs.com/package/twitter) — клиентская библиотека для работы с Twitter REST API;
* [googleapis](http://google.github.io/google-api-nodejs-client/) — клиентская библиотека для работы с Google REST API;
* [moment](http://momentjs.com) — JavaScript библиотека для синтаксического анализа, валидации и форматирования дат.

Установить их можно одной командой:

```bash
npm install express passport passport-youtube-v3 twitter googleapis moment --save
```

### Подготовка структуры проекта

Прежде чем начать писать код, немного изменим структуру взятого за основу приложения **Hello, World**.

Изменения для:

* [статических файлов](#Изменения-для-статических-файлов);
* [серверного кода](#Изменения-для-серверного-кода).

#### Изменения для статических файлов

![static](https://rawgit.com/godfreyd/bem-in-dynamic/master/static/images/static-changes.svg)

**Директория `static`**

* Создайте поддиректорию `images`.

* Перенесите фавиконку в поддиректорию `images`.

**Директория `common.blocks`**

* Отредактируйте файл `root/root.bemtree.js`.

  Измените:

  ```js
  favicon: '/favicon.ico',
  ```

  На:

  ```js
  favicon: '/images/favicon.ico',
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

* Добавьте [следующий код](https://gist.github.com/godfreyd/a584cee1191833afae70fc059ba1f200) в файл `app.js`.

* Добавьте [следующий код](https://gist.github.com/godfreyd/f6de1c33a83dda708a0e3ba9312f0c78) в файл `routes.js`.

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

* Измените весь текущий контент файла `index.js` на [следующий](https://gist.github.com/godfreyd/37d903c73f863619e2e1be1cd946d4c3).

  > **Примечание.** В `index.js` остается только функциональность, отвечающая за запуск приложения и прослушивание запросов на порте.

**Директория `controllers`**

* Создайте пустой `JS`-файл:

  * `index.js` — контроллер обработки запросов и рендеринга HTML.

* Добавьте [следующий код](https://gist.github.com/godfreyd/4bda7da3db029890378e15bcc38f32de) в файл `index.js`.

**Директория `helpers`**

* Создайте пустые `JS`-файлы:

  * `index.js` — входная точка для хелперов;
  * `twitter.js` — модуль-хелпер для работы с Twitter Search API;
  * `youtube.js` — модуль-хелпер для работы с YouTube Data API.

**Директория `middleware`**

* Создайте пустой `JS`-файл:

  * `auth.js` — модуль проверки прохождения аутентификации на YouTube.

### Получение OAuth-токенов

Сервисы Twitter и Google хранят различные данные пользователей — твиты, видео на Youtube, письма в Почте, фотографии и так далее. Чтобы обеспечить удобный доступ к этим данным из других приложений или сторонних сервисов, они используют открытый протокол авторизации [OAuth 2.0](https://oauth.net).

Согласно протоколу, разработчик регистрирует приложение на OAuth-сервере и запрашивает доступ к определенным данным. Авторизованный пользователь разрешает или запрещает его.

#### Получение OAuth-токена для Twitter

Twitter предлагает приложениям возможность выдавать аутентифицированные запросы от имени самого приложения.

**С чего начать?**

1. Изучите [документацию](https://dev.twitter.com/oauth).
2. Зарегистрируйте [приложение](https://apps.twitter.com) и получите ключи (Consumer Key, Consumer Secret).
3. Установите [Postman](https://www.getpostman.com) любым удобным для вас способом.
4. [Закодируйте строку](#codestring) `Consumer Key:Consumer Secret` методом [Base64](https://en.wikipedia.org/wiki/Base64).
5. [Получите OAuth-токен](#gettoken) в обмен на код.
6. Используйте полученные токен и ключи в запросах к Twitter Search API.

  > **Примечание.** Postman необходим для получения OAuth-токена с помощью POST-запроса в обмен на код, полученный методом Base64.

<a name="codestring"></a>
**Как закодировать строку?**

Чтобы закодировать строку методом Base64:

1. Сформируйте строку вида: `Consumer Key:Consumer Secret`.

    **Пример**

    `xvz1evFS4wEEPTGEFPHBog:L8qq9PZyRg6ieKGEKhZolGC0vJWLw8iEJ88DRdyOg`

    > **Примечание.** Получить ключи Consumer Key и Consumer Secret можно, перейдя на вкладку **Keys and Access Tokens** [вашего приложения](https://apps.twitter.com).

2. Запустите терминал или Git Bash.
4. Выполните команду `echo -n "xvz1evFS4wEEPTGEFPHBog:L8qq9PZyRg6ieKGEKhZolGC0vJWLw8iEJ88DRdyOg" | base64`.
5. Скопируйте полученный код.

    **Пример**

    `eHZ6MWV2RlM0d0VFUFRHRUZQSEdFS2hab2xHQzB2SldMdzhpRUo4OERSZHlPZw==`

> **Примечание.** Если возникли сложности, воспользуйтесь онлайн-ресурсом [base64encode.org](https://www.base64encode.org).

<a name="gettoken"></a>
**Как получить OAuth-токен в обмен на код?**

Чтобы получить токен в обмен на код:

1. Запустите Postman.

    > **Примечание.** По умолчанию открывается вкладка, в которой необходимо сформировать POST-запрос к OAuth-серверу Twitter.

2. Выберите тип запроса **POST**.
3. Введите адрес сервера `https://api.twitter.com/oauth2/token`.
4. Перейдите на вкладку **Headers**.
5. Введите в поле **Key** заголовок `Authorization` со значением (поле **Value**) `Basic <закодированная строка Consumer Key:Consumer Secret>`.

    **Пример**

    `Authorization: Basic eHZ6MWV2RlM0d0VFUFRHRUZQSEdFS2hab2xHQzB2SldMdzhpRUo4OERSZHlPZw==`

    > **Примечание.** Basic указывает на базовый метод авторизации.

6. Введите второй заголовок `Content-Type` со значением `application/x-www-form-urlencoded;charset=UTF-8`.

    **Пример**

    `Content-Type: application/x-www-form-urlencoded;charset=UTF-8`

7. Перейдите на вкладку **Body**.
8. Выберите опцию `x-www-form-urlencoded`.
9. Введите в поле **Key** тело запроса `grant_type` со значением `client_credentials`.
10. Нажмите кнопку **Send**.

    OAuth-сервер вернет токен в JSON-формате:

    ```json
    {
      "token_type": "bearer",
      "access_token": "AAAAAAAAAAAAAAAAAAAAAA%2FAAAAAAAAAA%3DAAAAAAAAAAAAAAAAAA"
    }
    ```

    > **Важно!** Сохраните полученные токен и ключи (Consumer Key и Consumer Secret). Они необходимы для [конфигурационного файла](#Конфигурация-приложения) приложения.

#### Получение OAuth-токена для Google

Google предлагает приложениям возможность выдавать аутентифицированные запросы от имени самого приложения.

> **Примечание.** За получение и обновление OAuth-токена с помощью POST-запроса в обмен на код авторизации отвечает модуль [passport-youtube-v3](#passport-youtube-v3).

**С чего начать?**

1. Изучите [документацию](https://developers.google.com/youtube/v3/docs/search/list).
2. Зарегистрируйте [приложение](https://console.developers.google.com/) и получите Client ID и Client Secret.
3. Укажите callback URL (в нашем случае это `http://localhost:3000`) в учетной записи вашего приложения.
4. Используйте полученные Client ID и Client Secret в запросах к YouTube Data API.

> **Важно!** Сохраните полученные ключи (Client ID и Client Secret). Они необходимы для [конфигурационного файла](#Конфигурация-приложения) приложения.

### Конфигурация приложения

После того как все ключи и токены получены, их необходимо добавить в конфигурационный файл приложения:

* Добавьте в файл `server/config.json` поле `services`.

  ```json
  "services": {
    "twitter": {
      "consumer_key": "",
      "consumer_secret": "",
      "bearer_token": ""
    },
    "youtube": {
      "client_id": "",
      "client_secret": "",
      "redirect_url": "http://localhost:3000"
    }
  }
  ```

  [Полный код config.json](https://gist.github.com/godfreyd/3697d1ba5fe5ac298a9b471fe943340f).

* Заполните одноименные поля [полученными данными](#Получение-oauth-токенов).
* Скройте файл `server/config.json` от системы контроля версий Git, чтобы случайно не добавить личные ключи в репозиторий файлов.

  ```bash
  # файл .gitignore
  server/config.json
  ```

  [Полный код .gitignore](https://gist.github.com/godfreyd/71a35fde50f54205fa395230bc97358f).

### Работа с Twitter Search API

[Twitter Search API](https://dev.twitter.com/rest/public/search) позволяет найти последние или популярные твиты, опубликованные на сайте Twitter.com за последние 7 дней.

Для успешного вызова API необходимо сделать следующие изменения:

![twitter-changes](https://rawgit.com/godfreyd/bem-in-dynamic/master/static/images/twitter-changes.svg)

**Директория `controllers`**

* Измените весь текущий контент файла `index.js` на [следующий](https://gist.github.com/godfreyd/3420597de46509b02c69707d596c8dc4).

**Директория `helpers`**

* Добавьте в файл `index.js` следующий контент:

  ```js
  module.exports = {
      twitter: require('./twitter')
  };
  ```

* Добавьте [следующий код](https://gist.github.com/godfreyd/e48b6831d785e51ee6ce0892151e3395) в файл `twitter.js`.

### Работа с YouTube Data API

[YouTube Data API](https://developers.google.com/youtube/v3/) позволяет найти видеоролики, опубликованные на сайте Youtube.com. По умолчанию в набор результата поиска включены следующие ресурсы: видео, каналы, списки воспроизведения.

Для успешного вызова API необходимо сделать следующие изменения:

![youtube-changes](https://rawgit.com/godfreyd/bem-in-dynamic/master/static/images/youtube-changes.svg)

**Директория `server`**

* Добавьте [следующий код](https://gist.github.com/godfreyd/68af82df0bc171da54971990f442dddb) в файл `auth.js`.

* Отредактируйте файл `routes.js`.

  Измените:

  ```js
  var router = require('express').Router(),
      controllers = require('./controllers');

  router
      .get('/ping/', function(req, res) {
          res.send('ok');
      })
      .get('/', controllers.getContent);

  module.exports = router;
  ```

  На:

  ```js
  var router = require('express').Router(),
      controllers = require('./controllers'),
      passportYouTube = require('./auth'),
      middleware = require('./middleware/auth'),
      isAuthenticated = middleware.isAuthenticated;

  router
      .get('/auth/youtube', passportYouTube.authenticate('youtube'))
      .get('/auth/youtube/callback', passportYouTube.authenticate('youtube', { failureRedirect: '/error', failureFlash: true }), (req, res) => {
          res.redirect('/');
      })
      .get('/', isAuthenticated, controllers.getContent);

  module.exports = router;
  ```

**Директория `controllers`**

* Измените весь текущий контент файла `index.js` на [следующий](https://gist.github.com/godfreyd/60d5d123c45c067b3fb675688dc74835).

**Директория `helpers`**

* Добавьте в файл `index.js` следующий контент (см. комментарий):

  ```js
  module.exports = {
      twitter: require('./twitter'),
      youtube: require('./youtube')        // Подключаем модуль `youtube.js`
  };
  ```

* Добавьте [следующий код](https://gist.github.com/godfreyd/e103013e1fe480965cd84b3e7040d04b) в файл `youtube.js`.

**Директория `middleware`**

* Добавьте в файл `auth.js` следующий контент:

  ```js
  module.exports = {
      isAuthenticated: function(req, res, next) {
          if (req.isAuthenticated()) return next();

          return res.redirect('/auth/youtube');
      }
  };
  ```

### Верстка

Мы сознательно не рассматривали вопросы верстки и клиентского JavaScript. Это привело бы к большему объему, а, значит, и к меньшей практической ценности данной статьи.

Процесс верстки сведен к следующим шагам:

1. Удалите все блоки из директории `common.blocks`.
2. Склонируйте [следующие блоки](common.blocks) в директорию `common.blocks`.
3. Добавьте [logo.svg](static/images/logo.svg) в директорию `static/images`.
4. Перезапустите сервер: `npm run dev`.

Приложение **Social Services Search Robot** готово.

**Не получилось?**

Если при создании приложения возникли сложности, поищите решение на [форуме](https://ru.bem.info/forum/). Если готового ответа не нашлось, задайте вопрос.
