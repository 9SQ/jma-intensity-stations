# jma-intensity-stations

気象庁の公開情報([震度観測点](https://www.data.jma.go.jp/eqev/data/intens-st/)、[技術資料](http://xml.kishou.go.jp/tec_material.html))から震度観測点テーブルを生成する

## How to use

1. `git clone https://github.com/9SQ/jma-intensity-stations.git`
2. `cd jma-intensity-stations`
3. [気象庁防災情報XMLフォーマット 技術資料](http://xml.kishou.go.jp/tec_material.html)から個別コード表のzipをダウンロード、解凍
4. `地震火山関連コード表.xls`を同階層に置く
5. 実行

```
npm install
node index.js
```

## Output file's format

### CSV

```csv
code,name,lon,lat,pref_code,pref_name,affi_code,affi_name
0123500,石狩市花川,141.32,43.17,1,北海道,0,気象庁
0123501,石狩市聚富,141.42,43.28,1,北海道,0,気象庁
...
4738112,竹富町上原小学校,123.79,24.42,47,沖縄県,0,気象庁
4738120,竹富町上原青年会館,123.78,24.43,47,沖縄県,2,防災科学技術研究所
```

### JSON

```json
[
    {
        "code": "0123500",
        "name": "石狩市花川",
        "coordinates": [
            141.32,
            43.17
        ],
        "pref": {
            "code": "1",
            "name": "北海道"
        },
        "affi": {
            "code": "0",
            "name": "気象庁"
        }
    },
    ...,
    {
        "code": "4738120",
        "name": "竹富町上原青年会館",
        "coordinates": [
            123.78,
            24.43
        ],
        "pref": {
            "code": "47",
            "name": "沖縄県"
        },
        "affi": {
            "code": "2",
            "name": "防災科学技術研究所"
        }
    }
]
```
