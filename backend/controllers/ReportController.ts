// we first need to import some types from express because we want to type the values explicitly
import { Response, Request } from 'express'
import { IReport } from '../Interfaces'
import { Report } from '../Models'

export const addReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as Pick<IReport, 'userId' | 'plantId' | 'report'>
    const report: IReport = new Report({
      userId: body.userId,
      plantId: body.plantId,
      report: body.report,
      status: 'pending',
    })
    const newReport: IReport = await report.save()
    res.status(201).json({ message: 'Report added', data: newReport })
  } catch (err) {
    if (err instanceof Error) {
      console.error(err)
      res.status(500).json(err)
    }
  }
}
