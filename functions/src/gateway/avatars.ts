import {storage} from 'firebase-admin';
import {paths} from './utils';
import {Application, NextFunction, Request, Response} from 'express';
import {File} from '@google-cloud/storage';
import fetch, {Headers} from 'node-fetch';

export function avatars(app: Application) {
  const avatarsBucket = storage().bucket('sign-mt-avatars');

  app.get(paths('avatars'), async (req: Request, res: Response) => {
    const {ownerId} = res.locals.unkey;

    const [files] = await avatarsBucket.getFiles({prefix: ownerId});

    const avatars: {[key: string]: {[key: string]: File}} = {};
    for (const file of files) {
      const [_, avatarId, name] = file.name.split('/');
      if (!(avatarId in avatars)) {
        avatars[avatarId] = {};
      }
      avatars[avatarId][name] = file;
    }

    const avatarList = await Promise.all(
      Object.entries(avatars).map(async ([avatarId, files]) => {
        const masked = files['masked.png'];
        const [url] = await masked.getSignedUrl({action: 'read', expires: Date.now() + 1000 * 60 * 60});
        return {
          id: avatarId,
          creationDate: masked.metadata.timeCreated,
          url,
        };
      })
    );

    res.json(avatarList);
  });

  app.delete(paths('avatars/:avatarId'), async (req: Request, res: Response) => {
    const {ownerId} = res.locals.unkey;
    const avatarId = req.params.avatarId;
    const [files] = await avatarsBucket.getFiles({prefix: `${ownerId}/${avatarId}`});
    await Promise.all(files.map(file => file.delete()));
    res.status(204).end();
  });

  app.post(paths('avatars/:avatarId'), async (req: Request, res: Response, next: NextFunction) => {
    const url = 'https://image-to-avatar-665830225099.us-central1.run.app/';
    const path = `${res.locals.unkey.ownerId}/${req.params.avatarId}`;

    // Set headers
    const headers = new Headers();
    for (const header of ['accept-encoding', 'content-type', 'content-length']) {
      if (req.headers[header]) {
        headers.set(header, req.headers[header] as string);
      }
    }

    const response = await fetch(`${url}${path}`, {
      method: 'POST',
      body: req.body,
      headers,
    });

    if (response.ok) {
      res.status(response.status).end();
    } else {
      const json = await response.json();
      res.status(response.status).json(json).end();
    }
  });
}
