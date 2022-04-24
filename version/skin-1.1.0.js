'use strict'

const Plugin = {
    "name": "skin",
    "version": "1.1.0",
    "depends": {
        "pluginLoader": ">=4.0.0"
    },
    "Events": ["messageCreate"],
    "Commands": [
        {
            "name": "skin <名稱>",
            "note": "查看 Java 玩家 皮膚"
        },
        {
            "name": "cape <名稱>",
            "note": "查看 Java 玩家 披風"
        },
        {
            "name": "skin",
            "note": "使用此指令 回覆 玩家 查詢他的 皮膚"
        },
        {
            "name": "cape",
            "note": "使用此指令 回覆 玩家 查詢他的 披風"
        }
    ],
    "author": ["whes1015"],
    "link": "https://github.com/ExpTechTW/MPR-skin",
    "resources": ["AGPL-3.0"],
    "description": "查看 Java 玩家 皮膚"
}


const pluginLoader = require('../Core/pluginLoader')
const fetch = require('node-fetch')

async function messageCreate(client, message) {
    if (message.content.startsWith("skin") || message.content.startsWith("cape")) {
        let args = ""
        if (message.type = "REPLY") {
            args = message.mentions.repliedUser.username
        } else {
            args = message.content.replace("cape ", "").replace("skin ", "").split(" ")[0]
        }
        let res = await fetch(`https://api.mojang.com/users/profiles/minecraft/${args}`)
        if (res.status != 200) message.reply(await pluginLoader.embed(`無法找到此玩家`))
        let Json = await res.json()
        res = await fetch(`https://sessionserver.mojang.com/session/minecraft/profile/${Json["id"]}`)
        Json = await res.json()
        Json = JSON.parse(atob(Json["properties"][0]["value"]))
        if (message.content.startsWith("skin")) {
            message.reply(Json["textures"]["SKIN"]["url"])
        } else {
            if (Json["textures"]["CAPE"] == undefined) {
                message.reply(await pluginLoader.embed(`此玩家沒有自訂義披風`))
            } else {
                message.reply(Json["textures"]["CAPE"]["url"])
            }
        }
    }
}

module.exports = {
    Plugin,
    messageCreate
}
