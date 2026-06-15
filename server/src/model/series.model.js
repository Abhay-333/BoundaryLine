import mongoose, { mongo } from "mongoose";
import { format } from "../constant/format.constant";

const seriesSchema = mongoose.Schema({
    name: {type: String, required: true, trim: true},
    format: {
        type: String,
        enum: Object.values(FORMAT), 
        default: FORMAT.FIVER
    },
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
    venue: String,
    status: {
        type: String,
        enum: Object.values(SERIES_STATUS),
        default: SERIES_STATUS.UPCOMING
    },
    totalMatches: {
        type: Number, 
        default : 3
    },
    teams:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team"
        }
    ],
    winnerTeam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        default: null
    }
},{
    timestamps: true
});

seriesSchema.path("teams").validate(
    function(teams){
        return teams.length >= 2;
    },
    "Series must have atleast 2 teams"
)

export const Series = mongoose.model("Series", seriesSchema);