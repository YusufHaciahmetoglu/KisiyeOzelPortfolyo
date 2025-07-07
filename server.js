const express = require('express');
const msnodesqlv8 = require('msnodesqlv8');
const path = require('path');
const app = express();
const port = 3000;
const connectionString = "server=LENOVO;Database=OkulProje;Trusted_Connection=Yes;Driver={SQL Server};";
console.log("SQL Server Bağlantı Yapılandırması (Sadeleştirilmiş Bağlantı Dizesi - doğrudan msnodesqlv8 ile):", connectionString);
app.use(express.static(__dirname));
app.get('/projeler', (req, res) => {
    console.log("-----------------------------------------");
    console.log("==> /projeler isteği alındı (doğrudan msnodesqlv8). <==");
    msnodesqlv8.open(connectionString, (err, conn) => {
        if (err) {
            console.error('!!! msnodesqlv8 ile bağlantı HATASI:', err);
            res.status(500).send(`Sunucu hatası (msnodesqlv8 bağlantı): ${err.message}.`);
            console.log("/projeler isteği tamamlandı (hata ile).");
            console.log("-----------------------------------------");
            return;
        }
        console.log(">>> msnodesqlv8 ile başarıyla BAĞLANILDI!");
        const query = "SELECT * FROM Projeler";
        console.log(`'${query}' sorgusu çalıştırılıyor...`);

        conn.queryRaw(query, (err, results) => {
            if (err) {
                console.error('!!! msnodesqlv8 sorgu HATASI:', err);
                res.status(500).send(`Sunucu hatası (msnodesqlv8 sorgu): ${err.message}.`);
            } else {
                console.log(">>> Sorgu Sonuçları:", results);
                if (results && results.rows) {
                    res.json(results.rows.map(row => {
                        let obj = {};
                        results.meta.forEach((meta, i) => {
                            obj[meta.name] = row[i];
                        });
                        return obj;
                    }));
                } else {
                    res.json([]);
                }
            }

            conn.close(() => {
                console.log("msnodesqlv8 bağlantısı kapatıldı.");
                console.log("/projeler isteği tamamlandı.");
                console.log("-----------------------------------------");
            });
        });
    });
});

app.listen(port, () => {
    console.log(`Sunucu http://localhost:${port} adresinde çalışıyor`);
});