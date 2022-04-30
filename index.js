const axios = require("axios")
const xlsx = require("xlsx")
const csv = require("csv")
const fs = require("fs")

const PREF = {
    "1": "北海道", "2": "青森県", "3": "岩手県", "4": "宮城県", "5": "秋田県", "6": "山形県", "7": "福島県",
    "8": "茨城県", "9": "栃木県", "10": "群馬県", "11": "埼玉県", "12": "千葉県", "13": "東京都", "14": "神奈川県",
    "15": "新潟県", "16": "富山県", "17": "石川県", "18": "福井県", "19": "山梨県", "20": "長野県", "21": "岐阜県",
    "22": "静岡県", "23": "愛知県", "24": "三重県", "25": "滋賀県", "26": "京都府", "27": "大阪府", "28": "兵庫県",
    "29": "奈良県", "30": "和歌山県", "31": "鳥取県", "32": "島根県", "33": "岡山県", "34": "広島県", "35": "山口県",
    "36": "徳島県", "37": "香川県", "38": "愛媛県", "39": "高知県", "40": "福岡県", "41": "佐賀県", "42": "長崎県",
    "43": "熊本県", "44": "大分県", "45": "宮崎県", "46": "鹿児島県", "47": "沖縄県"
}

const AFFI = { "0": "気象庁", "1": "地方公共団体", "2": "防災科学技術研究所" }

function openCodeTable(path, sheetName) {
    try {
        const book = xlsx.readFile(path)
        const sheet = book.Sheets[sheetName]
        const last = sheet["!ref"].match(/\:[A-Z+]([0-9]+)/)[1]
        sheet["!ref"] = `G3:I${last}`
        return xlsx.utils.sheet_to_json(sheet)
    } catch (error) {
        console.log(error)
    }
}

async function getStations(url) {
    try {
        const response = await axios.get(url)
        return response.data
    } catch (error) {
        console.log(error.response.body)
    }
}

(async () => {

    const codeTable = openCodeTable("地震火山関連コード表.xls", "24 ") //シート名にスペースが入っている...
    const stationsJson = await getStations("https://www.data.jma.go.jp/svd/eqev/data/intens-st/stations.json")

    const stations = codeTable.map(element => {
        const station = stationsJson.find(sta => sta.name === element.Name)
        if (station !== undefined) {
            return {
                "code": element.Code,
                "name": element.Name,
                "coordinates": [
                    parseFloat(station.lon),
                    parseFloat(station.lat)
                ],
                "pref": {
                    "code": station.pref,
                    "name": PREF[station.pref]
                },
                "affi": {
                    "code": station.affi,
                    "name": AFFI[station.affi]
                }
            }
        } else {
            console.log(`${element.Name}(${element.Code}) is not found.`)
        }
    }).filter(v => v)

    fs.writeFile("stations.json", JSON.stringify(stations), (err) => {
        if (err) throw err
        console.log(`Wrote ${stations.length} points to stations.json`)
    })

    const columns = {
        "code": "code",
        "name": "name",
        "coordinates[0]": "lon",
        "coordinates[1]": "lat",
        "pref.code": "pref_code",
        "pref.name": "pref_name",
        "affi.code": "affi_code",
        "affi.name": "affi_name"
    }

    csv.stringify(stations, { header: true, columns: columns }, (err, output) => {
        if (err) throw err
        fs.writeFile("stations.csv", output, (err) => {
            if (err) throw err
            console.log(`Wrote ${stations.length} points to stations.csv`)
        })
    })
})()