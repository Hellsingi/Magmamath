import { Request, Response } from "express";
import { User } from "../models/userModel";
import { publishEvent } from "../services/rabbitmq.service";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    if (!name || !email)
      return res.status(400).json({ error: "Missing fields" });

    const user = await User.create({ name, email });
    publishEvent("user_created", {
      id: user._id,
      name: user.name,
      email: user.email,
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    const users = await User.find().skip(skip).limit(limit)
    const count = await User.countDocuments()
    res.status(200).json({
      users,
      total: count,
      page,
      pages: Math.ceil(count / limit)
    })
  } catch (error) {
    res.status(500).send(error);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    publishEvent("user_deleted", { id: user._id, email: user.email });
    res.json({ message: "User deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal error" });
  }
};
