import { Schema, model } from "mongoose";
import { IInterrgation } from "../../types";
import { InterrgationEnum, InterrgationStatusEnum } from "../../utils/enums";

const InterrgationSchema = new Schema<IInterrgation>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        createDate: {
            type: Number,
            default: Date.now
        },
        status: {
            type: String,
            enum: InterrgationStatusEnum,
            default: InterrgationStatusEnum.IN_PROGRESS
        },
        type: {
            type: String,
            enum: InterrgationEnum,
            required: true
        },
        questions: [
            {
                description: String,
                reverse: Boolean,
                type: {
                    type: String,
                    enum: InterrgationEnum
                },
                groupId: Schema.Types.ObjectId,
                answer: Number
            }
        ]
    },
    { versionKey: false }
);

const Interrgation = model<IInterrgation>("Interrgation", InterrgationSchema);

export default Interrgation;
