const PastebinAPI = require('pastebin-js'),
pastebin = new PastebinAPI('EMWTMkQAVfJa9kM-MRUrxd5Oku1U7pgL');
const { makeid } = require('./id');
const express = require('express');
const fs = require('fs');
const pino = require("pino");
const {
    default: Anyway_Tech,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers
} = require("maher-zubair-baileys");

const router = express.Router();

// Delete auth temp folder
function removeFile(FilePath) {
    if (fs.existsSync(FilePath)) {
        fs.rmSync(FilePath, { recursive: true, force: true });
    }
}

// Main Route
router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;

    async function ANYWAY_MD_PAIR_CODE() {
        const { state, saveCreds } = await useMultiFileAuthState(`./temp/${id}`);

        try {
            let conn = Anyway_Tech({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
                },
                printQRInTerminal: false,
                logger: pino({ level: "fatal" }).child({ level: "fatal" }),
                browser: ["Chrome (Linux)", "", ""]
            });

            // Generate Pair Code
            if (!conn.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const code = await conn.requestPairingCode(num);
                if (!res.headersSent) {
                    await res.send({ code });
                }
            }

            conn.ev.on('creds.update', saveCreds);

            // Handle connection status
            conn.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect } = s;

                if (connection === "open") {
                    await delay(5000);
                    let data = fs.readFileSync(__dirname + `/temp/${id}/creds.json`);
                    await delay(800);
                    let b64data = Buffer.from(data).toString('base64');

                    // Send session ID
                    const session = await conn.sendMessage(conn.user.id, {
                        text: b64data
                    });

                    // Updated Message
                    const SESSION_MSG = `
╭─「 ✅ *ANYWAY XMD SESSION CONNECTED* ✅ 」─╮
│ Bot Linked Successfully by *ANYWAY TECH*
│ Session ID Generated & Sent 📥
│ 📱 Connected Number: wa.me/${conn.user.id.split(':')[0]}
╰────────────────────────────────────╯

╭───「 🌍 *RESOURCES & SUPPORT* 」───╮
│ 📌 *YouTube:* https://youtube.com/@anyway-tech
│ 📌 *GitHub:* https://github.com/anywaytech2/ANYWAY-XMD-AI-
│ 📌 *Plugins:* https://github.com/anywaytech2-plugins
│ 📌 *Owner:* https://t.me/Anywaytech
│ 🌐 *Website:* https://anywayboost.com
│ 📌 *Channel:* https://whatsapp.com/channel/0029VagWQ255q08VTCRQKP09
╰────────────────────────────────────╯

🔔 _Powered by ANYWAY TECH — Made with 🤍_
⭐ Don't forget to star our GitHub repo!
`;

                    await conn.sendMessage(conn.user.id, { text: SESSION_MSG }, { quoted: session });

                    // Close and cleanup
                    await delay(100);
                    await conn.ws.close();
                    return removeFile(`./temp/${id}`);
                }

                // Reconnect if not 401
                if (connection === "close" &&
                    lastDisconnect &&
                    lastDisconnect.error &&
                    lastDisconnect.error.output.statusCode != 401
                ) {
                    await delay(10000);
                    ANYWAY_MD_PAIR_CODE();
                }
            });

        } catch (err) {
            console.log("⚠️ Error restarting service:", err);
            removeFile(`./temp/${id}`);
            if (!res.headersSent) {
                res.send({ code: "Service Unavailable" });
            }
        }
    }

    return await ANYWAY_MD_PAIR_CODE();
});

module.exports = router;
