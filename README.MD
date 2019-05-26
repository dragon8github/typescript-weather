## Typescript 开发环境的最佳实践

**0️⃣ git init（略）**

**1️⃣️️ 初始化：**` $ yarn add -D ts-node typescript  `

**2️⃣ 生成 tsconfig.json：**` $ yarn tsc -init  `

**3️⃣ 配置 TSLint：**` $ yarn add tslint -D  `

**4️⃣ 生成 tslint.json：**` $ yarn tslint --init  `

**5️⃣ 创建 src/index.ts：**`$ mkdir src && echo "console.log('Hello Typescript')" > src/index.ts`

**6️⃣ 执行 .ts 文件：**` $ yarn ts-node src/index.ts `

**7️⃣ 安装 husky（没错，就是二哈🐕，哈士奇🐕）：** ` $ yarn add husky -D`

**8️⃣ 打开 package.json，添加 husky 的 hook：** 每次提交代码前，都会执行一次TSLint的检查命令。
```json
{
    "husky": {
        "pre-commit": "yarn tslint -c tslint.json './**/*.ts'"
    }
}
```

**9️⃣ 安装命令行交互神器 commander.js：** `$ yarn add commander`

```Typescript
const commander = require('commander');
const pkg = require('../package.json');

commander
  .version(pkg.version)
  .description(pkg.description)
  .usage('[options] <command> [...]')
  .option('-c, --city [name]', 'Add city name')
  .parse(process.argv);

if (process.argv.slice(2).length === 0) {
    commander.help();
    process.exit()
}
```

**1️⃣0️⃣ 测试命令：** `$ yarn ts-node src/index.ts -h`

```bash
$ yarn ts-node src/index.ts -h
yarn run v1.10.1
$ C:\Users\Lee\Desktop\ts-weather\node_modules\.bin\ts-node src/index.ts -h
Usage: index.ts [options] <command> [...]

Options:
  -V, --version  output the version number
  -c, --city     Add city name
  -h, --help     output usage information
Done in 1.91s.
```

**1️⃣1️⃣ 获取命令行输入：**`$ yarn ts-node src/index.ts --city dongguan`
```Typescript
console.log(commander.city) // => dongguan
```


**1️⃣2️⃣ 添加命令行颜色**： `$ yarn add colors`
```Typescript
const colors = require('colors');
const commander = require('commander');
const pkg = require('../package.json');

commander
  .version(pkg.version)
  .description(pkg.description)
  .usage('[options] <command> [...]')
  .option('-c, --city [name]', 'Add city name')
  .parse(process.argv);

if (process.argv.slice(2).length === 0) {
    commander.outputHelp(colors.red);
    process.exit()
}
```

**1️⃣3️⃣ 高德天气预报 - 接口文档：** 

https://lbs.amap.com/api/webservice/guide/api/weatherinfo

1. 先申请高德开发者账号，然后开通『天气接口api』的服务，重点拿到『key』；
2. 仔细阅读接口文档；
3. 可以先在浏览器中测试请求是否正常；

请求参数：

<table><tbody><tr><th colspan="2"><p>参数名</p></th><th><p>含义</p></th><th><p>规则说明</p></th><th><p>是否必须</p></th><th><p>缺省值</p></th></tr><tr><td colspan="2" style="white-space: nowrap;"><p>key</p></td><td><p>请求服务权限标识</p></td><td><p>用户在高德地图官网<a href="https://lbs.amap.com/dev/" class="" target="_blank">申请web服务API类型KEY</a></p></td><td><p>必填</p></td><td><p>无</p></td></tr><tr><td colspan="2" style="white-space: nowrap;"><p>city</p></td><td><p>城市编码</p></td><td><p>输入城市的adcode，adcode信息可参考<a href="https://lbs.amap.com/api/webservice/download" class="" target="_blank">城市编码表</a></p></td><td><p>必填</p></td><td><p>无</p></td></tr><tr><td colspan="2" style="white-space: nowrap;"><p>extensions</p></td><td><p>气象类型</p></td><td><p>可选值：base/all</p><p>base:返回实况天气</p><p>all:返回预报天气</p></td><td><p>可选</p></td><td><p>无</p></td></tr><tr><td colspan="2" style="white-space: nowrap;"><p>output</p></td><td><p>返回格式</p></td><td><p>可选值：JSON,XML</p></td><td><p>可选</p></td><td><p>JSON</p></td></tr></tbody></table>

##### 请求示例：

> https://restapi.amap.com/v3/weather/weatherInfo?key=9f1c132e77dc10edf34fe44bec1208a9&city=东莞

返回结果：

```json
{status: "1", count: "1", info: "OK", infocode: "10000", lives: [{province: "广东", city: "东莞市", adcode: "441900", weather: "小雨", temperature: "27", winddirection: "西南", windpower: "≤3", humidity: "78", reporttime: "2019-05-26 18:13:57"}]}
```

**1️⃣4️⃣根据这个 JSON 定制一个 interface**

```Typescript
interface IWeaterResponse {
    status: string,
    count: string,
    info: string,
    infocode: string,
    lives: ILive[],
}

interface ILive {
    province: string,
    city: string,
    adcode: string,
    weather: string,
    temperature: string,
    winddirection: string,
    windpower: string,
    humidity: string,
    reporttime: string,
}

// test demo
let a:IWeaterResponse = {status: "1", count: "1", info: "OK", infocode: "10000", lives: [{province: "广东", city: "东莞市", adcode: "441900", weather: "小雨", temperature: "27", winddirection: "西南", windpower: "≤3", humidity: "78", reporttime: "2019-05-26 18:13:57"}] }

// normal output
console.log(a)
```

**1️⃣5️⃣引入最流行的 axios 来处理网络请求：**`$ yarn add axios`

```Typescript
import axios, { AxiosResponse } from 'axios'
const colors = require('colors')
const commander = require('commander')
const pkg = require('../package.json')

const { log } = console
const __URL__ = "https://restapi.amap.com/v3/weather/weatherInfo"
const __KEY__ = "9f1c132e77dc10edf34fe44bec1208a9"

commander
  .version(pkg.version)
  .description(pkg.description)
  .usage('[options] <command> [...]')
  .option('-c, --city [name]', 'Add city name')
  .parse(process.argv);

if (process.argv.slice(2).length === 0) {
    commander.outputHelp(colors.red)
    process.exit()
}

interface IWeaterResponse {
    status: string,
    count: string,
    info: string,
    infocode: string,
    lives: ILive[],
}

interface ILive {
    province: string,
    city: string,
    adcode: string,
    weather: string,
    temperature: string,
    winddirection: string,
    windpower: string,
    humidity: string,
    reporttime: string,
}

axios.get(`${__URL__}?city=${encodeURI(commander.city)}&key=${__KEY__}`).then((res: AxiosResponse<IWeaterResponse>) => {
    const live = res.data.lives[0]
    log(colors.yellow(live.reporttime));
    log(colors.white(`${live.province} ${live.city}`));
    log(colors.blue(`${live.weather} ${live.temperature} °`));
}).catch((err: Error) => {
    log(colors.red("天气服务接口异常！" + err.message))
})
```

测试一下： `$ yarn ts-node src/index.ts --city 东莞`

```bash
2019-05-26 19:43:57
广东 东莞市
小雨 26 °
```