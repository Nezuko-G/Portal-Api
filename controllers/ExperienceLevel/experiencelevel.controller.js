import { ExperienceLevelModel } from "../../models/ExperienceLevel/experience.level.model.js";
import { BadRequestError, NotFoundError } from "../../Errors/error.js";
import { validateObjectId } from "../../utils/validateObjectId.js";
import { slugify } from "../../utils/helpers.js";

export const createExperienceLevelController = async (req, res, next) => {
    try{
        const data = req.body;
        const conflicts = {};
        if(!data.title || !data.title.en || !data.title.ar){
            conflicts.title = "Title in both English and Arabic is required";
        }
        if(data.minYears === undefined || data.minYears === null){
            conflicts.minYears = "Minimum years of experience is required";
        }
        if(data.maxYears === undefined || data.maxYears === null){
            conflicts.maxYears = "Maximum years of experience is required";
        }
        if(Object.keys(conflicts).length > 0){
            throw new BadRequestError("Validation Error", conflicts);
        }
        
        const slug = slugify(data.title.en);
        
        // Check if slug already exists (excluding soft-deleted items)
        const existExperienceLevel = await ExperienceLevelModel.findOne({slug: slug, is_deleted: false});
        if(existExperienceLevel){
            throw new BadRequestError(res.__('experience_level.already_exists'));
        }
        
        const newExperienceLevel = new ExperienceLevelModel({
            title: data.title,
            slug: slug,
            minYears: data.minYears,
            maxYears: data.maxYears
        });
        await newExperienceLevel.save();
        res.status(201).json({
            message: res.__('experience_level.created'),
            data: newExperienceLevel
        });
    }
    catch(error){
        next(error);
    }
}

export const getAllExperienceLevelsController = async (req, res, next) => {
    try {
        const lang = req.query.lang || 'en';
        const experienceLevels = await ExperienceLevelModel.find({is_deleted: false}).select("-__v").lean();
        
        // Localize the data based on language
        const localizedData = experienceLevels.map(item => ({
            _id: item._id,
            title: item.title[lang] || item.title.en,
            slug: item.slug,
            minYears: item.minYears,
            maxYears: item.maxYears,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
        }));
        
        res.json({
            message: res.__('experience_level.fetched_all'),
            total: localizedData.length,
            data: localizedData
        });
    } catch (error) {
        next(error);
    }
}

export const getExperienceLevelByIdController = async (req, res, next) => {
    try {
        const experienceLevelId = req.params.id;
        const lang = req.query.lang || 'en';
        validateObjectId(experienceLevelId);
        const experienceLevel = await ExperienceLevelModel.findOne({_id: experienceLevelId, is_deleted: false}).select("-__v").lean();
        if(!experienceLevel){
            throw new NotFoundError(res.__('experience_level.not_found'));
        }
        
        // Localize the data based on language
        const localizedData = {
            _id: experienceLevel._id,
            title: experienceLevel.title[lang] || experienceLevel.title.en,
            slug: experienceLevel.slug,
            minYears: experienceLevel.minYears,
            maxYears: experienceLevel.maxYears,
            createdAt: experienceLevel.createdAt,
            updatedAt: experienceLevel.updatedAt
        };
        
        res.json({
            message: res.__('experience_level.fetched'),
            data: localizedData
        });
    } catch (error) {
        next(error);
    }
}

export const updateExperienceLevelController = async (req, res, next) => {
    try {
        const experienceLevelId = req.params.id;
        validateObjectId(experienceLevelId);
        const data = req.body;
        const conflicts = {};
        if(data.title && (!data.title.en || !data.title.ar)){
            conflicts.title = "Title in both English and Arabic is required";
        }
        if(data.title && (data.title.en === "" || data.title.ar === "")){
            conflicts.title = "Title cannot be empty";
        }
        if(Object.keys(conflicts).length > 0){
            throw new BadRequestError("Validation Error", conflicts);
        }
        const ExperienceLevel = await ExperienceLevelModel.findOne({_id: experienceLevelId, is_deleted: false});
        if(!ExperienceLevel){
            throw new NotFoundError(res.__('experience_level.not_found'));
        }
        
        // If title is being updated, check for duplicates and update slug
        if(data.title && data.title.en && data.title.en !== ExperienceLevel.title.en){
            const newSlug = slugify(data.title.en);
            const duplicateExperienceLevel = await ExperienceLevelModel.findOne({slug: newSlug, is_deleted: false});
            if(duplicateExperienceLevel){
                throw new BadRequestError(res.__('experience_level.already_exists'));
            }
            data.slug = newSlug;
        }
        
        Object.assign(ExperienceLevel, data);
        await ExperienceLevel.save();
        res.json({
            message: res.__('experience_level.updated'),
            data: ExperienceLevel
        });
    } catch (error) {
        next(error);
    }
}

export const deleteExperienceLevelController = async (req, res, next) => {
    try {
        const experienceLevelId = req.params.id;
        validateObjectId(experienceLevelId);
        const experienceLevel = await ExperienceLevelModel.findOne({_id: experienceLevelId, is_deleted: false});
        if(!experienceLevel){
            throw new NotFoundError(res.__('experience_level.not_found'));
        }
        experienceLevel.is_deleted = true;
        await experienceLevel.save();
        res.json({
            message: res.__('experience_level.deleted')
        });
    } catch (error) {
        next(error);
    } 
}