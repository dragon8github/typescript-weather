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
    log(colors.red("天气服务接口异常！"))
})