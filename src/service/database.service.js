const create = async (model, data) => {
    return await model.create({ data });
};

const findById = async (model, id) => {
    return await model.findById(id).lean();
};

const findOne = async (model, propertyName, data) => {
    return await model
        .findOne({
            propertyName: data,
        })
        .lean();
};

const findByIdAndUpdate = async (model, id, data) => {
    return await model.findByIdAndUpdate(id, data, {
        new: true,
    });
};

const findByIdAndDelete = async (model, id) => {
    return await model.findByIdAndDelete(id);
};

const databaseService = {
    create,
    findById,
    findOne,
    findByIdAndUpdate,
    findByIdAndDelete,
};

export default databaseService;
