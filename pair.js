const { makeid } = require('./gen-id');
const express = require('express');
const fs = require('fs');
let router = express.Router();
const pino = require("pino");
const { upload } = require('./mega');

// Baileys dynamic import
const baileys = async () => await import('@whiskeysockets/baileys');

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;

    async function BMB_TECH_PAIR_CODE() {
        // Import Baileys modules dynamically
        const {
            default: makeWASocket,
            useMultiFileAuthState,
            delay,
            Browsers,
            makeCacheableSignalKeyStore
        } = await baileys();

        const {
            state,
            saveCreds
        } = await useMultiFileAuthState('./temp/' + id);

        try {
            var items = ["Safari"];
            function selectRandomItem(array) {
                var randomIndex = Math.floor(Math.random() * array.length);
                return array[randomIndex];
            }
            var randomItem = selectRandomItem(items);

            let sock = makeWASocket({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
                },
                printQRInTerminal: false,
                generateHighQualityLinkPreview: true,
                logger: pino({ level: "fatal" }).child({ level: "fatal" }),
                syncFullHistory: false,
                browser: Browsers.macOS(randomItem)
            });

            if (!sock.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const code = await sock.requestPairingCode(num);
                if (!res.headersSent) {
                    await res.send({ code });
                }
            }

            sock.ev.on('creds.update', saveCreds);
            sock.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect } = s;

                if (connection == "open") {
                    await delay(5000);
                    let rf = __dirname + `/temp/${id}/creds.json`;

                    function generateRandomText() {
                        const prefix = "3EB";
                        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                        let randomText = prefix;
                        for (let i = prefix.length; i < 22; i++) {
                            const randomIndex = Math.floor(Math.random() * characters.length);
                            randomText += characters.charAt(randomIndex);
                        }
                        return randomText;
                    }

                    try {
                        const mega_url = await upload(fs.createReadStream(rf), `${sock.user.id}.json`);
                        const string_session = mega_url.replace('https://mega.nz/file/', '');
                        let md = "ANYWAY-XMD~" + string_session;
                        let code = await sock.sendMessage(sock.user.id, { text: md });

                        let desc = `╭━━━━━━━━━━━━━━━━━━━━━╮
┃  🚀 ANYWAY-XMD USER ✅  ┃
╰━━━━━━━━━━━━━━━━━━━━━╯

👋🏻 Hello there, Anyway-xmd User!

> ⚠️ *Do not share your session ID with your GF!* 🤖

✅ **Thanks for using Anyway-xmd** 🚀

━━━━━━━━━━━━━━━━━━━━━━━

📢 **Join our WhatsApp Channel:**
🔗 https://whatsapp.com/channel/0029VagWQ255q08VTCRQKP09

⭐ **Don't forget to fork the repo:**
🔗 https://github.com/anywaytech2/ANYWAY-XMD

━━━━━━━━━━━━━━━━━━━━━━━

> *© Powered by dev Anyway-xmd 🔰*`;

                        await sock.sendMessage(sock.user.id, {
                            text: desc,
                            contextInfo: {
                                externalAdReply: {
                                    title: "bmb xmd",
                                    thumbnailUrl: "https://files.catbox.moe/tpajs5.jpg",
                                    sourceUrl: "https://whatsapp.com/channel/0029VagWQ255q08VTCRQKP09",
                                    mediaType: 1,
                                    renderLargerThumbnail: true
                                }
                            }
                        }, { quoted: code });

                    } catch (e) {
                        let ddd = sock.sendMessage(sock.user.id, { text: e });
                        let desc = `*Don't Share with anyone this code use for deploy NOVA-XMD*\n\n ◦ *Github:* https://github.com/novaxmd/NOVA-XMD`;

                        await sock.sendMessage(sock.user.id, {
                            text: desc,
                            contextInfo: {
                                externalAdReply: {
                                    title: "Anyway-xmd",
                                    thumbnailUrl: "https://files.catbox.moe/tpajs5.jpg",
                                    sourceUrl: "https://whatsapp.com/channel/0029VagWQ255q08VTCRQKP09",
                                    mediaType: 2,
                                    renderLargerThumbnail: true,
                                    showAdAttribution: true
                                }
                            }
                        }, { quoted: ddd });
                    }

                    await delay(10);
                    await sock.ws.close();
                    await removeFile('./temp/' + id);
                    console.log(`👤 ${sock.user.id} Connected ✅ Restarting process...`);
                    await delay(10);
                    process.exit();

                } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    await delay(10);
                    BMB_TECH_PAIR_CODE();
                }
            });
        } catch (err) {
            console.log("service restated");
            await removeFile('./temp/' + id);
            if (!res.headersSent) {
                await res.send({ code: "❗ Service Unavailable" });
            }
        }
    }

    return await BMB_TECH_PAIR_CODE();
});

/*setInterval(() => {
    console.log("☘️ Restarting process...");
    process.exit();
}, 180000); //30min*/

module.exports = router;
