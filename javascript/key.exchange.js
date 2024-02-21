// mock key exchange for learning
const veminesSercret = 10   // random sercret and not save to database

const parsonSercret = 18    // random sercret and not save to database

const keySystem = 30        // generate when signup at app (key server will share)

const veminesPublic = keySystem + veminesSercret    // 40

const parsonPublic = keySystem + parsonSercret      // 48

const veminesKeyEchange = parsonPublic + veminesSercret         // 58

const parsonKeyEchange = veminesPublic + parsonSercret          // 58