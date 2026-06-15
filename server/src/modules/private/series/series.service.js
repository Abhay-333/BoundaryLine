import SeriesRepository from "../../../repository/series.repository";
import NotFound from "../../../shared/error/NotFound";

class SeriesService {
    constructor(){
        this.seriesRepository = SeriesRepository;
    }

    async getSeries(){
        return this.seriesRepository.findAll();
    }

    async getSeriesById(seriesId){
        return this.seriesRepository.findbyId(seriesId);
    }

    async createSeries(payload){
        return this.seriesRepository.create(payload);
    }

    async updateSeries(seriesId, payload){
        const currentTournament = await this.seriesRepository.findById(seriesId);
        
        const nextName = payload.name ?? currentTournament.name;

        if(payload.name){
            // check if unique tournament name

        }

        const updatedTournament = await this.seriesRepository.updatedById(seriesId, payload);
        
        if(!updatedTournament){
            throw new NotFound("Tournament Not Found");
        }
    }

    async deleteSeries(seriesId){
        const deletedTeam = await this.seriesRepository.softDeleteById();

        if(!deletedTeam){
            throw new NotFound("Tournament Not Found");
        }

        return deletedTeam;
    }


}