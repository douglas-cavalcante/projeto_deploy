import {AppDataSource} from "../data-source"
import { User } from "../entity/User"
import {Request, Response, Router} from "express"
import rotaAutenticada from "../middlewares/auth"
import bcrypt from "bcrypt"

const userRepository = AppDataSource.getRepository(User)

const userRouter = Router()

userRouter.get("/", async (req: Request, res: Response) => {
    try {
        const listUser = await userRepository.find()

        res.status(200).json(listUser)
    } catch (ex) {
        res.status(500).send("Ocorreu um erro ao executar a solicitação")
    }
})

userRouter.post("/", async (req: Request, res: Response) => {
    try {

        let senha = req.body.password

        const salt = await bcrypt.genSalt(10)

        let senhaCriptografada = await bcrypt.hash(senha, salt);

        const user = userRepository.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            age: req.body.age,
            login: req.body.login,
            password: senhaCriptografada
        })
                
        await userRepository.save(user)

        res.status(201).json(user)

    } catch (ex) {
        res.status(500).send("Ocorreu um erro ao executar a solicitação")
    }
})

userRouter.put("/:id", async (req: Request, res: Response) => {
    try {
        let user = await userRepository.findOne({
            where: {
                id: Number(req.params.id)
            }
        }) ?? new User()
       
        if(user.id == null){
            res.status(400).json("Usuário não encontrado!")
            return
        }

        let userUpdate = req.body as User;

        Object.assign(user, userUpdate)

        await userRepository.save(user)

        res.status(200).json(user)

    } catch (ex) {
        res.status(500).send("Ocorreu um erro ao executar a solicitação")
    }
})

userRouter.delete("/:id", async (req: Request, res: Response) => {
    try {
        let id = Number(req.params.id)

        const user = await userRepository.findOne({
            where:{
                id: id
            }
        })

        if(!user){
            res.status(400).json("Usuário não encontrado!")
            return
        }

        await userRepository.delete(id)

        res.status(200).json("Usuário removido com sucesso!")
    } catch (ex) {
        res.status(500).send("Ocorreu um erro ao executar a solicitação")
    }
})

export default userRouter;