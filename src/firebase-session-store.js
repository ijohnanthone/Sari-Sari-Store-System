import session from "express-session";
import { ref, get, set, remove } from "firebase/database";
import { db as firebaseDb } from "./firebase.js";

export class FirebaseSessionStore extends session.Store {
  constructor(options = {}) {
    super();
    this.defaultTtlMs = Number(options.defaultTtlMs || 30 * 60 * 1000);
  }

  get(sid, callback = () => {}) {
    get(ref(firebaseDb, `app_sessions/${sid}`))
      .then((snapshot) => {
        if (!snapshot.exists()) return callback(null, null);
        const data = snapshot.val();
        if (Number(data.expires_at || 0) <= Date.now()) {
          remove(ref(firebaseDb, `app_sessions/${sid}`)).catch(() => {});
          return callback(null, null);
        }
        try {
          const sessionData = typeof data.sess === "string" ? JSON.parse(data.sess) : data.sess;
          callback(null, sessionData);
        } catch (parseErr) {
          callback(parseErr);
        }
      })
      .catch((err) => callback(err));
  }

  set(sid, sessionData, callback = () => {}) {
    const expiresAt = sessionData?.cookie?.expires
      ? new Date(sessionData.cookie.expires).getTime()
      : Date.now() + this.defaultTtlMs;

    set(ref(firebaseDb, `app_sessions/${sid}`), {
      sess: JSON.stringify(sessionData),
      expires_at: expiresAt
    })
      .then(() => callback(null))
      .catch((err) => callback(err));
  }

  destroy(sid, callback = () => {}) {
    remove(ref(firebaseDb, `app_sessions/${sid}`))
      .then(() => callback(null))
      .catch((err) => callback(err));
  }

  touch(sid, sessionData, callback = () => {}) {
    const expiresAt = sessionData?.cookie?.expires
      ? new Date(sessionData.cookie.expires).getTime()
      : Date.now() + this.defaultTtlMs;

    set(ref(firebaseDb, `app_sessions/${sid}/expires_at`), expiresAt)
      .then(() => callback(null))
      .catch((err) => callback(err));
  }
}

export default FirebaseSessionStore;
