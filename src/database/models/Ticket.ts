import mongoose, { Document, model, Model, Schema } from 'mongoose';
import { IEvent } from './Event';
import { IUser } from './User';

export interface ITicket extends Document {
  _id: mongoose.Types.ObjectId;
  event: IEvent | mongoose.Types.ObjectId;
  user: IUser | mongoose.Types.ObjectId;
  emittedAt: Date;
}

export type ITicketFull = ITicket & { event: IEvent };

const TicketSchema: Schema = new Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Insira um evento para o ticket!'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Insira um usuário para o ticket!'],
  },
  emittedAt: {
    type: Date,
    default: Date.now,
    required: [true, 'Insira a data do emissão do ticket!'],
  },
});

// TicketSchema.pre('deleteOne'});

export const Ticket: Model<ITicket> =
  mongoose.models.Ticket || model('Ticket', TicketSchema);
