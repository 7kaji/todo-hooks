import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as mysql from 'mysql';
import express from 'express';
const app: express.Express = express();
import cors from 'cors';

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: functions.config().credential.project_id,
    clientEmail: functions.config().credential.client_email,
    privateKey: functions.config().credential.private_key,
  }),
});

// CORS
app.use(cors({ origin: true }));

// body-parser
app.use(express.urlencoded({ extended: false }));
app.use(
  express.json({
    inflate: true,
    limit: '100kb',
    strict: true,
    type: 'application/json',
    verify: undefined,
  }),
);

export interface DbConfig {
  host: string;
  user: string;
  password: string;
  database: string;
}

const dbConfig: DbConfig = {
  host: functions.config().db.host,
  user: functions.config().db.user,
  password: functions.config().db.password,
  database: functions.config().db.database,
};

// TODO: DB Config
const pool = mysql.createPool(dbConfig);
const query = (sql: string, values?: any) => {
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err: any, connection: any) {
      if (err) {
        reject(err);
      } else {
        connection.query(sql, values, (err: any, rows: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
          connection.release();
        });
      }
    });
  });
};

// TODO: model
type User = {
  name?: string;
  auth_uid: string;
  auth_provider: string;
  email: string;
  icon_url?: string;
};

// Auth
async function isAuthenticated(
  req: express.Request,
  res: express.Response,
  next: Function,
) {
  const { authorization } = req.headers;

  if (!authorization) return res.status(401).send({ message: 'Unauthorized' });

  if (!authorization.startsWith('Bearer'))
    return res.status(401).send({ message: 'Unauthorized' });

  const split = authorization.split('Bearer ');
  if (split.length !== 2)
    return res.status(401).send({ message: 'Unauthorized' });

  const token = split[1];

  try {
    const decodedToken: admin.auth.DecodedIdToken = await admin
      .auth()
      .verifyIdToken(token);
    console.log('decodedToken', JSON.stringify(decodedToken));
    res.locals = {
      ...res.locals,
      uid: decodedToken.uid,
      email: decodedToken.email,
      auth_provider: decodedToken.firebase.sign_in_provider,
    };
    return next();
  } catch (err) {
    console.error(`${err.code} -  ${err.message}`);
    return res.status(401).send({ message: 'Unauthorized' });
  }
}

async function findUser(auth_uid: string) {
  const sql = 'SELECT * FROM users WHERE auth_uid = ?';
  const user = (await query(sql, [auth_uid])) as any;
  return user[0];
}

async function findOrCreateUser(userParams: User) {
  const { auth_uid } = userParams;
  const sql = 'SELECT * FROM users WHERE auth_uid = ?';
  const user = (await query(sql, [auth_uid])) as any;
  if (user.length === 0) {
    return createUser(userParams);
  }
  return user[0];
}

async function createUser(userParams: User) {
  const sql = 'INSERT INTO users SET ?';
  const result = (await query(sql, userParams)) as any;
  const user = (await query('SELECT * FROM users WHERE id = ?', [
    result.insertId,
  ])) as any;
  return user[0];
}

// Routing
const router: express.Router = express.Router();

// GET /user (authentecated_user)
router.get(
  '/user',
  isAuthenticated,
  async (req: express.Request, res: express.Response) => {
    const user = await findUser(res.locals.uid);
    console.log('-------------');
    console.log(user);
    res.json(user);
  },
);

// POST /users
router.post(
  '/users',
  isAuthenticated,
  async (req: express.Request, res: express.Response) => {
    // TODO: validation
    const default_icon_url =
      'https://1.bp.blogspot.com/-8WH_HUYVcMs/XL8Grn5pRsI/AAAAAAABShY/FM0q_XrGDuYV-g9nSnBEq2MVMI_SqbyNwCLcBGAs/s400/unicorn_color_hair.png';
    const icon_url =
      res.locals.auth_provider === 'password' ? default_icon_url : 'sample.png';

    const userParams: User = {
      name: req.body.name,
      auth_uid: res.locals.uid,
      auth_provider: res.locals.auth_provider,
      email: res.locals.email,
      icon_url,
    };

    const currentUser: User = await findOrCreateUser(userParams);
    console.log('-----------------------');
    console.log(currentUser.name);
    res.status(200).send({});
  },
);

// GET /todos
router.get('/todos', async (req: express.Request, res: express.Response) => {
  const sql = 'SELECT * FROM todos ORDER BY ID DESC LIMIT 10';
  const results = await query(sql);
  res.json(results);
});

// POST /todos
router.post(
  '/todos',
  isAuthenticated,
  async (req: express.Request, res: express.Response) => {
    // TODO: validation
    const currentUser = await findUser(res.locals.uid);
    const sql = 'INSERT INTO todos SET ?';
    const values = {
      title: req.body.title,
      done: false,
      user_id: currentUser.id,
    };
    const results: any = await query(sql, values);
    console.log(results);
    res.json({ id: results.insertId });
  },
);

// PATCH /todos/:id
router.patch(
  '/todos/:id',
  isAuthenticated,
  async (req: express.Request, res: express.Response) => {
    // TODO: parser
    // watch: https://github.com/ava/use-http/issues/272
    const body = JSON.parse(req.body);
    const currentUser = await findUser(res.locals.uid);
    const sql = 'UPDATE todos SET done = ? WHERE id = ?';
    const results = (await query(sql, [body.done, req.params.id])) as any;
    if (currentUser.user_id !== results.user_id) {
      res.status(401).send({ message: 'Unauthorized' });
      return;
    }

    console.log(results);
    res.json({});
  },
);

// DELETE /todos/:id
router.delete(
  '/todos/:id',
  isAuthenticated,
  async (req: express.Request, res: express.Response) => {
    const currentUser = await findUser(res.locals.uid);
    const sql = 'DELETE FROM todos WHERE id = ?';
    const results = (await query(sql, [req.params.id])) as any;
    if (currentUser.user_id !== results.user_id) {
      res.status(401).send({ message: 'Unauthorized' });
      return;
    }

    console.log(results);
    res.json({});
  },
);

app.use(router);

exports.api = functions
  .region('asia-northeast1')
  .runWith({
    timeoutSeconds: 300,
    memory: '2GB',
  })
  .https.onRequest(app);
