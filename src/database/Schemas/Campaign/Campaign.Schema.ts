import mongoose, { Schema, Document } from 'mongoose';
import {Configuration,SendBehaviour,SendMode,TimeUnit} from '@CampaignCreator/database/classes/Campaigns/interfaces/Configuration'
import {ContactMessage} from '@CampaignCreator/database/classes/Campaigns/interfaces/Contact'
import {ImageCampaign} from '@CampaignCreator/database/classes/Campaigns/interfaces/ImageCampaign'
import {ScheduleState,MessageStatus} from '@CampaignCreator/database/classes/Campaigns/enum/ScheduleState'


export interface CampaignDb extends Document {
  _id: mongoose.Types.ObjectId;
  createDate: Date;
  configuration: Configuration;
  contacts: ContactMessage[];
  images: ImageCampaign[];
  state: ScheduleState;
}



const SendBehaviourSchema = new Schema<SendBehaviour>({
  latency: [Number],
  unit: { type: String, enum: Object.values(TimeUnit) },
  mode: { type: String, enum: Object.values(SendMode) },
});

const ConfigurationSchema = new Schema<Configuration>({
  behaviour: SendBehaviourSchema,
  startDate: Date,
  endDate: Date,
  campaignName: String,
  executionRamp: Number,
});

const ContactMessageSchema = new Schema<ContactMessage>({
  id: String,
  from: String,
  to: String,
  message: String,
  imagefield: String,
  messageMap: [{ key: String, value: String }],
  status: { type: String, enum: Object.values(MessageStatus) },
});

const ImageCampaignSchema = new Schema<ImageCampaign>({
  name: String,
  image: String,
  link: String,
  ext: String,
});

const CampaignSchema = new Schema<CampaignDb>({
  createDate: Date,
  configuration: ConfigurationSchema,
  contacts: [ContactMessageSchema],
  images: [ImageCampaignSchema],
  state: { type: String, enum: Object.values(ScheduleState) },
});

export const CampaignModel = mongoose.model<CampaignDb>('Campaign', CampaignSchema);

