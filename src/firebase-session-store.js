import session from "express-session";
import { ref, get, set, remove } from "firebase/database";
import { db as firebaseDb } from "./firebase.js";

export class FirebaseSessionStore extends session.Store {
  constructor(options = {}) {
    super();
    this.defaultTtlMs = Number(options.defaultTtlMs || 30 * 60 * 1000);
    this._cache = new Map();
    this._lastTouchMap = new Map();
  }

  get(sid, callback = () => {}) {
    const now = Date.now();
    const cached = this._cache.get(sid);
    if (cached && (now - cached.cachedAt < 5000) && (cached.expiresAt > now)) {
      return callback(null, JSON.parse(JSON.stringify(cached.data)));
    }

    get(ref(firebaseDb, `app_sessions/${sid}`))
      .then((snapshot) => {
        if (!snapshot.exists()) {
          this._cache.delete(sid);
          return callback(null, null);
        }
        const data = snapshot.val();
        if (Number(data.expires_at || 0) <= Date.now()) {
          this._cache.delete(sid);
          remove(ref(firebaseDb, `app_sessions/${sid}`)).catch(() => {});
          return callback(null, null);
        }
        try {
          const sessionData = typeof data.sess === "string" ? JSON.parse(data.sess) : data.sess;
          this._cache.set(sid, {
            data: sessionData,
            cachedAt: now,
            expiresAt: Number(data.expires_at || 0)
          });
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

    this._cache.set(sid, {
      data: sessionData,
      cachedAt: Date.now(),
      expiresAt
    });

    set(ref(firebaseDb, `app_sessions/${sid}`), {
      sess: JSON.stringify(sessionData),
      expires_at: expiresAt
    })
      .then(() => callback(null))
      .catch((err) => callback(err));
  }

  destroy(sid, callback = () => {}) {
    this._cache.delete(sid);
    this._lastTouchMap.delete(sid);
    remove(ref(firebaseDb, `app_sessions/${sid}`))
      .then(() => callback(null))
      .catch((err) => callback(err));
  }

  touch(sid, sessionData, callback = () => {}) {
    const now = Date.now();
    const lastTouch = this._lastTouchMap.get(sid) || 0;
    if (now - lastTouch < 60000) {
      return callback(null);
    }
    this._lastTouchMap.set(sid, now);

    const expiresAt = sessionData?.cookie?.expires
      ? new Date(sessionData.cookie.expires).getTime()
      : Date.now() + this.defaultTtlMs;

    set(ref(firebaseDb, `app_sessions/${sid}/expires_at`), expiresAt)
      .then(() => callback(null))
      .catch((err) => callback(err));
  }
}

export default FirebaseSessionStore;
