import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate";
import { registroSchema, loginSchema } from "../schemas/auth.schema";
import { autenticar } from "../middlewares/auth";

const router = Router();
const controller = new AuthController();

router.post("/registro", validate(registroSchema), controller.registrar);
router.post("/login", validate(loginSchema), controller.login);
router.post("/refresh", controller.refresh);
router.get("/me", autenticar, controller.perfil);

export { router as authRouter };
