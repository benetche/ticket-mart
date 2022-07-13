import mongoose, { Document, model, Model, Schema } from 'mongoose';

export interface IEvent extends Document {
  _id: string;
  name: string;
  description: string;
  date: Date;
  location: string;
  price: number;
  imageUrl: string;
  stockQuantity: number;
}

const EventSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Insira o nome do evento!'],
  },
  description: {
    type: String,
    required: [true, 'Insira a descrição do evento!'],
    minLength: [20, 'A descrição deve ter no mínimo 20 caracteres!'],
    maxLength: [500, 'A descrição deve ter no máximo 500 caracteres!'],
  },
  date: {
    type: Date,
    required: [true, 'Insira a data do evento!'],
    min: [new Date(), 'O evento deve ser no futuro!'],
  },
  location: {
    type: String,
    required: [true, 'Insira o local do evento!'],
  },
  price: {
    type: Number,
    required: [true, 'Insira o preço do evento!'],
    min: [0, 'O preço deve ser maior que 0!'],
  },
  imageUrl: {
    type: String,
    default:
      'https://res.cloudinary.com/rolimans/image/upload/v1657688561/eventImages/genericParty.jpg',
  },
  stockQuantity: {
    type: Number,
    required: [true, 'Insira a quantidade de ingressos do evento!'],
    min: [0, 'A quantidade de ingressos deve ser maior que 0!'],
    default: 0,
  },
});

// EventSchema.pre('deleteOne'});

export const Event: Model<IEvent> =
  mongoose.models.Event || model('Event', EventSchema);
