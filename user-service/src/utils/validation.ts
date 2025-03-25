import Joi from 'joi';

export const validateUser = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
  });

  return schema.validate(data);
};