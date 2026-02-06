// test-password.mjs
import bcrypt from 'bcryptjs';

async function testCompare() {
  const inputPassword = 'barmin12'; // <-- GANTI INI DENGAN PASSWORD ASLI YANG KAMU COBA
  const dbHash = '$2b$10$IcqzNEd0fVCZKhkLgluPLu5bxHIMSMOWsqHXSemmxjeEJR/icT9Eq'; // <-- paste hash dari DB kamu

  const match = await bcrypt.compare(inputPassword, dbHash);
  console.log('Apakah password cocok?', match);
  
  if (!match) {
    console.log('Password yang kamu ketik TIDAK cocok dengan hash di DB.');
    console.log('Coba ingat-ingat password asli saat register, atau reset.');
  }
}

testCompare().catch(err => console.error('Error:', err));