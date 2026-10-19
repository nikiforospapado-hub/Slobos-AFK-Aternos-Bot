const mineflayer = require('mineflayer');

// Δημιουργία του Bot χρησιμοποιώντας τις μεταβλητές περιβάλλοντος του Railway
const bot = mineflayer.createBot({
  host: process.env.IP || process.env.HOST,     // Διαβάζει το IP από το Railway
  port: parseInt(process.env.PORT),             // Διαβάζει το Port από το Railway
  username: process.env.USERNAME || 'AFK_Bot',  // Το όνομα του bot στο παιχνίδι
  version: process.env.VERSION || false         // Αυτόματη ανίχνευση έκδοσης
});

// 🛡️ 1η ΑΣΠΙΔΑ: Στέλνει πακέτο συγχρονισμού στον server για να προλάβει το kick κίνησης
bot.on('physicTick', async () => {
  if (bot && bot._client) {
    bot._client.write('tick_end', {});
  }
});

// 🛡️ 2η ΑΣΠΙΔΑ: Μόλις το bot μπει στον κόσμο, «κλειδώνει» τη φυσική του
bot.on('spawn', () => {
  console.log("Το Bot συνδέθηκε επιτυχώς στον server!");
  if (bot.physics) {
    bot.physics.enabled = false; // Απενεργοποίηση κινήσεων για 100% ασφάλεια
  }
});

// 🔄 ΑΥΤΟΜΑΤΟ RECONNECT: Αν ο server πέσει ή γίνει restart, το bot ξαναμπαίνει μόνο του
bot.on('end', (reason) => {
  console.log(`Το bot αποσυνδέθηκε (Λόγος: ${reason}). Επανασύνδεση σε 10 δευτερόλεπτα...`);
  setTimeout(() => {
    process.exit(1); // Αναγκάζει το Railway να επανεκκινήσει την υπηρεσία αμέσως
  }, 10000);
});

// 🚨 LOG ERRORS: Καταγράφει τυχόν σφάλματα στην κονσόλα του Railway για έλεγχο
bot.on('error', (err) => {
  console.log(`Σφάλμα Bot: ${err.message}`);
});

