import { Request, Response } from 'express';
import { queryValidator } from '../../lib/utils/requestValidator';
import { getRepository, getConnection } from 'typeorm';
import Stories from './Stories.entity';

export const getAllStoriesByProject = async (req: Request, res: Response) => {
  try {
    if (!queryValidator(req.query, ['projectId'])) {
      throw new Error('query is not vaild');
    }

    const { projectId } = req.query;
    const storyRepository = getRepository(Stories);
    const stories = await storyRepository.find({
      relations: ['projects', 'epics'],
      where: { projects: { id: +(projectId as string) } },
    });

    const storiesWithEpicName = stories.map((el) => ({
      id: el.id,
      name: el.name,
      order: el.order,
      status: el.status,
      epic: el.epics.name,
    }));

    res.status(200).json(storiesWithEpicName);
  } catch (e) {
    const result = (e as Error).message;
    if (result === 'query is not vaild') {
      res.status(400).json(result);
    }
  }
};

export const postStory = async (req: Request, res: Response) => {
  try {
    const result = await getRepository(Stories)
      .createQueryBuilder()
      .insert()
      .into(Stories)
      .values({
        name: req.body.name,
        status: req.body.status,
        order: req.body.order,
        projects: () => req.body.projectId,
        epics: () => req.body.epicId,
      })
      .execute();

    const { id, status } = result.generatedMaps[0];
    res.status(201).json({ id, status });
  } catch (e) {
    res.status(400).json({
      message: (e as Error).message,
    });
  }
};

export const updateStoryWithName = async (req: Request, res: Response) => {
  const { id, name, status } = req.body;
  try {
    await getConnection()
      .createQueryBuilder()
      .update(Stories)
      .set({ id: id, name: name, status: status })
      .where('id = :id', { id: id })
      .execute();

    res.status(201).json({ id: id, name: name });
  } catch (e) {
    res.status(400).json({
      message: (e as Error).message,
    });
  }
};

export const updateStoryWithId = async (req: Request, res: Response) => {
  const { id, name, status, order } = req.body;
  try {
    await getConnection()
      .createQueryBuilder()
      .update(Stories)
      .set({ id: id, name: name, status: status, order: order })
      .where('id = :id', { id: id })
      .execute();

    res.status(201).json({ id: id, name: name });
  } catch (e) {
    res.status(400).json({
      message: (e as Error).message,
    });
  }
};

export const deleteStoryWithId = async (req: Request, res: Response) => {
  const { storyId } = req.query;
  try {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Stories)
      .where('id = :id', { id: storyId })
      .execute();
  } catch (e) {
    res.status(400).json({
      message: (e as Error).message,
    });
  }
};
